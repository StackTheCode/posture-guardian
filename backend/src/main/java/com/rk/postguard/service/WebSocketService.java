package com.rk.postguard.service;

import com.rk.postguard.dto.PostureEventDto;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class WebSocketService {
    private  final SimpMessagingTemplate messagingTemplate;


    public void broadcastPostureUpdate(String username, PostureEventDto postureEventDto) {
        // This targets: /topic/posture-updates (Global)
        // We wrap it in a Map to include the username for the dashboard
        Map<String, Object> payload = Map.of(
                "username", username,
                "event", postureEventDto,
                "timestamp", System.currentTimeMillis()
        );

        messagingTemplate.convertAndSend("/topic/posture-updates", (Object) payload);
    }

    public void sendPostureAnalysis(String username, PostureEventDto postureEventDto){
// This targets: /user/{username}/queue/posture
        System.out.println("=== WebSocket Debug ===");
        System.out.println("Sending to user: " + username);
        System.out.println("Destination: /queue/posture");
        System.out.println("Payload: " + postureEventDto);
        messagingTemplate.convertAndSendToUser(username,"/queue/posture",postureEventDto );
        System.out.println("Message sent successfully");
        System.out.println("=====================");
    }
}
