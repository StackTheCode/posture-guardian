package com.rk.postguard.service;


import com.rk.postguard.dto.UserSettingsDto;
import com.rk.postguard.entity.User;
import com.rk.postguard.entity.UserSettings;
import com.rk.postguard.repositories.UserRepository;
import com.rk.postguard.repositories.UserSettingsRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserSettingsService {
    private final UserSettingsRepository settingsRepository;
    private final UserRepository userRepository;


    @Transactional(readOnly = true)
    public UserSettingsDto getSettings(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserSettings settings = settingsRepository.findByUserId(user.getId())
                .orElseGet(() -> createDefaultSettings(user.getId()));

        return mapToDto(settings);
    }


    @Transactional(readOnly = true)
    public UserSettingsDto updateSettings (String username,UserSettingsDto dto){
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserSettings settings = settingsRepository.findByUserId(user.getId())
                .orElseGet(() -> createDefaultSettings(user.getId()));



//        Update fields

        if(dto.getCaptureIntervalSeconds() != null){
            settings.setCaptureIntervalSeconds(dto.getCaptureIntervalSeconds());
        }
        if(dto.getNotificationsEnabled() != null){
            settings.setNotificationsEnabled(dto.getNotificationsEnabled());
        }
        if(dto.getNotificationSensitivity() != null){
            settings.setNotificationSensitivity(dto.getNotificationSensitivity());
        }
        if(dto.getWorkingHoursEnabled() != null){
            settings.setWorkingHoursEnabled(dto.getWorkingHoursEnabled());
        }
        if(dto.getWorkingHoursStart() != null){
            settings.setWorkingHoursStart(dto.getWorkingHoursStart());
        }
        if(dto.getWorkingHoursEnd() !=null) {
            settings.setWorkingHoursEnd(dto.getWorkingHoursEnd());
        }
        if(dto.getCameraIndex() != null){
            settings.setCameraIndex(dto.getCameraIndex());
        }
        if(dto.getTheme() != null){
            settings.setTheme(dto.getTheme());
        }

        settings = settingsRepository.save(settings);

        log.info("Updated settings for user: {}", username);
        return mapToDto(settings);

    }


    private UserSettingsDto mapToDto(UserSettings settings) {
        return  UserSettingsDto.builder()
                .captureIntervalSeconds(settings.getCaptureIntervalSeconds())
                .notificationsEnabled(settings.getNotificationsEnabled())
                .workingHoursEnabled(settings.getWorkingHoursEnabled())
                .workingHoursStart(settings.getWorkingHoursStart())
                .workingHoursEnd(settings.getWorkingHoursEnd())
                .cameraIndex(settings.getCameraIndex())
                .theme(settings.getTheme())
                .build();
    }

    private UserSettings createDefaultSettings(Long userId){
        UserSettings settings = UserSettings.builder()
                .userId(userId)
                .build();
        return  settingsRepository.save(settings);
    }
}
