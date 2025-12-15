package com.rk.postguard.controllers;

import com.rk.postguard.dto.PostureEventDto;
import com.rk.postguard.entity.PostureEvent;
import com.rk.postguard.service.PostureService;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/posture")
@RequiredArgsConstructor
public class PostureController {
    private final PostureService postureService;

    @PostMapping("/events")
    public ResponseEntity createPostureEvent(@Valid @RequestBody PostureEventDto dto, Authentication authentication) {
        String username = authentication.getName();
        return  ResponseEntity.ok(postureService.savePostureEvent(username, dto));
    }
    @GetMapping("/events")
    public ResponseEntity getPostureEvents(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime  end,
            Authentication authentication) {
String username = authentication.getName();
return  ResponseEntity.ok(postureService.getPostureEvents(username, start, end));
    }
}
