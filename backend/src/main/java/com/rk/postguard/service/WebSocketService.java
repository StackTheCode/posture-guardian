package com.rk.postguard.service;

import com.rk.postguard.dto.PostureEventDto;
import com.rk.postguard.entity.PostureEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebSocketService {
    private  final SimpMessagingTemplate messagingTemplate;


    public void sendPostureUpdate(String username, PostureEventDto postureEventDto) {
        messagingTemplate.convertAndSendToUser(username,"/topic/posture-updates", postureEventDto);
    }
}
