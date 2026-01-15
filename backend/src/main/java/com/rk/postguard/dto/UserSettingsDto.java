package com.rk.postguard.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSettingsDto {
private Integer captureIntervalSeconds;
    private Boolean notificationsEnabled;
    private String notificationSensitivity;
    private Boolean workingHoursEnabled;
    private LocalTime workingHoursStart;
    private LocalTime workingHoursEnd;
    private Integer cameraIndex;
    private String theme;

}
