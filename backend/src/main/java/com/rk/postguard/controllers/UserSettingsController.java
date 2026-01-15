package com.rk.postguard.controllers;


import com.rk.postguard.dto.UserSettingsDto;
import com.rk.postguard.service.UserSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/settings")
@RequiredArgsConstructor
public class UserSettingsController {
 private final UserSettingsService settingsService;

    @GetMapping
    public ResponseEntity<UserSettingsDto> getSettings(Authentication authentication){
        String username = authentication.getName();
        return  ResponseEntity.ok(settingsService.getSettings(username));

    }

    @PutMapping
    public ResponseEntity<UserSettingsDto> updateSettings ( Authentication authentication, @RequestBody UserSettingsDto dto){
String username = authentication.getName();
return  ResponseEntity.ok(settingsService.updateSettings(username, dto));
    }



}
