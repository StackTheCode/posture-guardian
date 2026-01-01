package com.rk.postguard.service;

import com.rk.postguard.dto.PostureEventDto;
import com.rk.postguard.entity.PostureEvent;
import com.rk.postguard.repositories.PostureEventRepository;
import com.rk.postguard.repositories.UserRepository;
import com.rk.postguard.entity.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Slf4j
public class PostureService {
    private final UserRepository userRepository;
    private  final PostureEventRepository postureEventRepository;
    private  final   WebSocketService webSocketService;

    @Transactional
    public PostureEventDto savePostureEvent(String username, PostureEventDto dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PostureEvent event = PostureEvent.builder()
                .userId(user.getId())
                .postureState(dto.getPostureState())
                .confidence(dto.getConfidence())
                .severity(dto.getSeverity())
                .timestamp(dto.getTimestamp())
                .build();

        event = postureEventRepository.save(event);

        PostureEventDto savedDto = mapToDto(event);
        // Send real-time update via WebSocket
        webSocketService.sendPostureAnalysis(username,dto);

        webSocketService.broadcastPostureUpdate(username, dto);

        log.info("Saved posture event for user: {} - State: {}", username, dto.getPostureState());

        return savedDto;
    }

    public List<PostureEventDto> getPostureEvents(String username, LocalDateTime start, LocalDateTime end) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<PostureEvent> events = postureEventRepository
                .findByUserIdAndTimestampBetweenOrderByTimestampDesc(user.getId(), start, end);

        return events.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }


    public PostureEventDto mapToDto(PostureEvent event) {
        return  PostureEventDto.builder()
                 .id(event.getId())
                .postureState(event.getPostureState())
                .confidence(event.getConfidence())
                .severity(event.getSeverity())
                .timestamp(event.getTimestamp())
                .build();

    }
}
