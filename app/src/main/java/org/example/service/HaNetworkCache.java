package org.example.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class HaNetworkCache {
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    public HaNetworkCache(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
        this.objectMapper = new ObjectMapper();
    }

    public void updateState(String topic, String state) {
        redisTemplate.opsForValue().set(topic, state);
    }

    public String getState(String topic) {
        return redisTemplate.opsForValue().get(topic);
    }

    public void deleteState(String topic) {
        redisTemplate.delete(topic);
    }

    @Cacheable(value = "smartHomeJson", sync = true)
    public String getSmartHomeJson() {
        return generateSmartHomeJson();
    }

    public String generateSmartHomeJson() {
        ObjectNode rootNode = objectMapper.createObjectNode();
        ObjectNode roomsNode = rootNode.putObject("rooms");
        ObjectNode systemDevicesNode = rootNode.putObject("system_devices");

        Set<String> allTopics = getAllTopics();

        for (String topic : allTopics) {
            String[] parts = topic.split("/");
            if (parts.length < 4 || !parts[0].equals("zwave")) continue;

            String room = parts[1];
            String device = parts[2];

            if ("_CLIENTS".equals(room)) {
                processSystemDevice(systemDevicesNode, parts, topic);
            } else {
                processRoomDevice(roomsNode, room, device, topic);
            }
        }

        cleanupJson(rootNode);

        try {
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(rootNode);
        } catch (Exception e) {
            e.printStackTrace();
            return "{}";
        }
    }

    private void processSystemDevice(ObjectNode systemDevicesNode, String[] parts, String topic) {
        String device = parts[2];
        ObjectNode deviceNode = systemDevicesNode.has(device)
                ? (ObjectNode) systemDevicesNode.get(device)
                : systemDevicesNode.putObject(device);

        deviceNode.put("type", "Z-Wave Gateway");

        String functionality = parts[parts.length - 1];
        String currentValue = getState(topic);
        if (currentValue != null) {
            deviceNode.set(functionality, parseJsonIfPossible(currentValue));
        }
    }

    private void processRoomDevice(ObjectNode roomsNode, String room, String device, String topic) {
        ObjectNode roomNode = roomsNode.has(room)
                ? (ObjectNode) roomsNode.get(room)
                : roomsNode.putObject(room);

        ObjectNode devicesNode = roomNode.has("devices")
                ? (ObjectNode) roomNode.get("devices")
                : roomNode.putObject("devices");

        ObjectNode deviceNode = devicesNode.has(device)
                ? (ObjectNode) devicesNode.get(device)
                : devicesNode.putObject(device);

        deviceNode.put("type", getDeviceType(device));

        ObjectNode functionalitiesNode = deviceNode.has("functionalities")
                ? (ObjectNode) deviceNode.get("functionalities")
                : deviceNode.putObject("functionalities");

        String functionality = topic.substring(topic.lastIndexOf("/") + 1);
        String currentValue = getState(topic);
        if (currentValue != null) {
            functionalitiesNode.set(functionality, parseJsonIfPossible(currentValue));
        }
    }

    private JsonNode parseJsonIfPossible(String value) {
        try {
            return objectMapper.readTree(value);
        } catch (Exception e) {
            return new TextNode(value);
        }
    }

    private String getDeviceType(String deviceName) {
        if (deviceName.contains("Light")) return "Light";
        if (deviceName.contains("Lock")) return "Lock";
        if (deviceName.contains("Thermostat")) return "Thermostat";
        if (deviceName.contains("Plug")) return "Smart Plug";
        if (deviceName.contains("Power_Strip")) return "Power Strip";
        if (deviceName.contains("Alarm")) return "Security System";
        return deviceName;
    }

    private void cleanupJson(ObjectNode rootNode) {
        cleanupNode(rootNode);
    }

    private void cleanupNode(JsonNode node) {
        if (node.isObject()) {
            ObjectNode objectNode = (ObjectNode) node;
            Iterator<Map.Entry<String, JsonNode>> fields = objectNode.fields();
            Set<String> fieldsToRemove = new HashSet<>();

            while (fields.hasNext()) {
                Map.Entry<String, JsonNode> entry = fields.next();
                String key = entry.getKey();
                JsonNode value = entry.getValue();

                if (value.isObject() && value.size() == 0) {
                    fieldsToRemove.add(key);
                } else if (value.isObject() && value.has("time") && value.size() == 1) {
                    fieldsToRemove.add(key);
                } else if (key.endsWith("_value")) {
                    // Move _value fields into their parent functionality
                    String functionalityKey = key.substring(0, key.length() - 6);
                    if (objectNode.has("functionalities")) {
                        ObjectNode functionalitiesNode = (ObjectNode) objectNode.get("functionalities");
                        functionalitiesNode.set(functionalityKey, value);
                    }
                    fieldsToRemove.add(key);
                } else {
                    cleanupNode(value);
                }
            }

            for (String field : fieldsToRemove) {
                objectNode.remove(field);
            }

            // Group similar functionalities
            if (objectNode.has("functionalities")) {
                groupSimilarFunctionalities((ObjectNode) objectNode.get("functionalities"));
            }
        } else if (node.isArray()) {
            ArrayNode arrayNode = (ArrayNode) node;
            for (JsonNode element : arrayNode) {
                cleanupNode(element);
            }
        }
    }

    private void groupSimilarFunctionalities(ObjectNode functionalitiesNode) {
        Map<String, ArrayNode> groupedFunctionalities = new HashMap<>();
        Iterator<Map.Entry<String, JsonNode>> fields = functionalitiesNode.fields();
        Set<String> fieldsToRemove = new HashSet<>();

        while (fields.hasNext()) {
            Map.Entry<String, JsonNode> entry = fields.next();
            String key = entry.getKey();
            JsonNode value = entry.getValue();

            if (key.matches("\\d+")) {
                String groupKey = "numbered_functionalities";
                groupedFunctionalities.computeIfAbsent(groupKey, k -> functionalitiesNode.arrayNode())
                        .add(objectMapper.createObjectNode().set(key, value));
                fieldsToRemove.add(key);
            }
        }

        for (Map.Entry<String, ArrayNode> entry : groupedFunctionalities.entrySet()) {
            functionalitiesNode.set(entry.getKey(), entry.getValue());
        }

        for (String field : fieldsToRemove) {
            functionalitiesNode.remove(field);
        }
    }

    private Set<String> getAllTopics() {
        Set<String> keys = redisTemplate.keys("*");
        return keys != null ? new TreeSet<>(keys) : Collections.emptySet();
    }
}
