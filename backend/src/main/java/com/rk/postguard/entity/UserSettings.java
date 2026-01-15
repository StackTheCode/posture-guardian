package com.rk.postguard.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "user_settings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  long id;


    @Column(name = "user_id" ,unique = true,nullable = false)
    private long userId;

    @Column(name = "capture_interval_seconds")
    @Builder.Default
    private Integer captureIntervalSeconds = 30;

    @Column(name = "notifications_enabled")
    @Builder.Default
    private Boolean notificationsEnabled = true;


    @Column(name = "notification_sensitivity")
    @Builder.Default
    private String notificationSensitivity = "medium";

    @Column(name = "working_hours_enabled")
    @Builder.Default
    private Boolean workingHoursEnabled = false;

    @Column(name = "working_hours_start")
    @Builder.Default
    private LocalTime workingHoursStart = LocalTime.of(9, 0);

    @Column(name = "working_hours_end")
    @Builder.Default
    private LocalTime workingHoursEnd = LocalTime.of(17, 0);

    @Column(name = "camera_index")
    @Builder.Default
    private Integer cameraIndex = 0;

    @Column(name = "theme")
    @Builder.Default
    private String theme = "dark";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

}
