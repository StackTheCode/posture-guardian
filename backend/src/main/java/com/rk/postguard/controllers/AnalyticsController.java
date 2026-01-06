package com.rk.postguard.controllers;


import com.rk.postguard.dto.AnalyticsResponse;
import com.rk.postguard.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/weekly")
    public ResponseEntity<AnalyticsResponse> getWeeklyAnalytics(Authentication authentication){
        String username = authentication.getName();
        return ResponseEntity.ok(analyticsService.getWeeklyAnalytics(username));
    }
    @GetMapping("/today")
    public ResponseEntity<AnalyticsResponse> getTodayAnalytics(Authentication authentication){
        String username = authentication.getName();
        return  ResponseEntity.ok(analyticsService.getTodayAnalytics(username));
    }
}
