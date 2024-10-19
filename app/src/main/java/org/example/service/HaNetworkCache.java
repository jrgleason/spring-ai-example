package org.example.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.TreeSet;

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

        Set<String> processedTopics = new HashSet<>();

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

            processedTopics.add(topic);
        }

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
        ArrayNode functionalitiesNode = deviceNode.has("functionalities")
                ? (ArrayNode) deviceNode.get("functionalities")
                : deviceNode.putArray("functionalities");

        String functionality = parts[parts.length - 1];
        functionalitiesNode.add(functionality);

        // Add current value from Redis
        String currentValue = getState(topic);
        if (currentValue != null) {
            deviceNode.put(functionality + "_value", currentValue);
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

        ArrayNode functionalitiesNode = deviceNode.has("functionalities")
                ? (ArrayNode) deviceNode.get("functionalities")
                : deviceNode.putArray("functionalities");

        addFunctionality(functionalitiesNode, topic);

        // Add current value from Redis
        String currentValue = getState(topic);
        if (currentValue != null) {
            String functionality = topic.substring(topic.lastIndexOf("/") + 1);
            deviceNode.set(functionality + "_value", parseJsonIfPossible(currentValue));
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

    private void addFunctionality(ArrayNode functionalitiesNode, String topic) {
        boolean functionalityAdded = false;

        if (topic.contains("currentValue") || topic.contains("targetValue")) {
            addUniqueValue(functionalitiesNode, "dimming");
            functionalityAdded = true;
        }
        if (topic.contains("level")) {
            addUniqueValue(functionalitiesNode, "on/off");
            functionalityAdded = true;
        }
        if (topic.contains("dimmingDuration")) {
            addUniqueValue(functionalitiesNode, "dimming_duration");
            functionalityAdded = true;
        }
        if (topic.contains("scene")) {
            addUniqueValue(functionalitiesNode, "scene_control");
            functionalityAdded = true;
        }
        if (topic.contains("userCode")) {
            addUniqueValue(functionalitiesNode, "user_codes");
            functionalityAdded = true;
        }
        if (topic.contains("mode")) {
            addUniqueValue(functionalitiesNode, "mode");
            functionalityAdded = true;
        }
        if (topic.toLowerCase().contains("lock")) {
            addUniqueValue(functionalitiesNode, "lock/unlock");
            functionalityAdded = true;
        }

        // If no predefined functionality was added, add the last part of the topic as a functionality
        if (!functionalityAdded) {
            String[] topicParts = topic.split("/");
            String lastPart = topicParts[topicParts.length - 1];
            addUniqueValue(functionalitiesNode, lastPart);
        }
    }

    private void addUniqueValue(ArrayNode arrayNode, String value) {
        if (!arrayNode.toString().contains("\"" + value + "\"")) {
            arrayNode.add(value);
        }
    }

    private Set<String> getAllTopics() {
        Set<String> keys = redisTemplate.keys("*");
        return keys != null ? new TreeSet<>(keys) : Collections.emptySet();
    }
}
