package com.rk.postguard.controllers;


import com.rk.postguard.dto.StreakResponse;
import com.rk.postguard.service.StreakService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class StreakController {
    private final StreakService streakService;



    @GetMapping("/streak")
    public ResponseEntity<StreakResponse> getStreak(Authentication authentication){
        String username = authentication.getName();
    StreakResponse streak = streakService.getStreakStats(username);
    return  ResponseEntity.ok(streak);
    }
}
