package org.example.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
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

    public String generateSmartHomeJson() {
        ObjectNode rootNode = objectMapper.createObjectNode();
        ObjectNode roomsNode = rootNode.putObject("rooms");
        ObjectNode systemDevicesNode = rootNode.putObject("system_devices");

        Set<String> processedTopics = new HashSet<>();

        // Assume we have a method to get all keys (topics) from Redis
        Set<String> allTopics = getAllTopics();

        for (String topic : allTopics) {
            String[] parts = topic.split("/");
            if (parts.length < 4 || !parts[0].equals("zwave")) continue;

            String room = parts[1];
            String device = parts[2];

            if ("_CLIENTS".equals(room)) {
                processSystemDevice(systemDevicesNode, parts);
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

    private void processSystemDevice(ObjectNode systemDevicesNode, String[] parts) {
        String device = parts[2];
        ObjectNode deviceNode = systemDevicesNode.has(device)
                ? (ObjectNode) systemDevicesNode.get(device)
                : systemDevicesNode.putObject(device);

        deviceNode.put("type", "Z-Wave Gateway");
        ArrayNode functionalitiesNode = deviceNode.has("functionalities")
                ? (ArrayNode) deviceNode.get("functionalities")
                : deviceNode.putArray("functionalities");

        functionalitiesNode.add(parts[parts.length - 1]);
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
    }

    private String getDeviceType(String deviceName) {
        if (deviceName.contains("Light")) return "Light";
        if (deviceName.contains("Lock")) return "Lock";
        if (deviceName.contains("Thermostat")) return "Thermostat";
        if (deviceName.contains("Plug")) return "Smart Plug";
        if (deviceName.contains("Power_Strip")) return "Power Strip";
        if (deviceName.contains("Alarm")) return "Security System";
        return "Unknown";
    }

    private void addFunctionality(ArrayNode functionalitiesNode, String topic) {
        if (topic.contains("currentValue") || topic.contains("targetValue")) {
            addUniqueValue(functionalitiesNode, "dimming");
        }
        if (topic.contains("level")) {
            addUniqueValue(functionalitiesNode, "on/off");
        }
        if (topic.contains("dimmingDuration")) {
            addUniqueValue(functionalitiesNode, "dimming_duration");
        }
        if (topic.contains("scene")) {
            addUniqueValue(functionalitiesNode, "scene_control");
        }
        if (topic.contains("userCode")) {
            addUniqueValue(functionalitiesNode, "user_codes");
        }
        if (topic.contains("mode")) {
            addUniqueValue(functionalitiesNode, "mode");
        }
        if (topic.toLowerCase().contains("lock")) {
            addUniqueValue(functionalitiesNode, "lock/unlock");
        }
    }

    private void addUniqueValue(ArrayNode arrayNode, String value) {
        if (!arrayNode.toString().contains("\"" + value + "\"")) {
            arrayNode.add(value);
        }
    }

    public Set<String> getAllTopics() {
        Set<String> keys = redisTemplate.keys("*");
        return keys != null ? new TreeSet<>(keys) : Collections.emptySet();
    }
}
