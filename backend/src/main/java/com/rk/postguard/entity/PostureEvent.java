package com.rk.postguard.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import  lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "posture_events")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostureEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;

    @Column(name = "user_id",nullable = false)
    private Long userId;

    @Column(name = "posture_state", nullable = false, length = 50)
    private String postureState;

    @Column(nullable = false, precision = 3, scale = 2)
    private BigDecimal confidence;

    @Column(nullable = false, precision = 3, scale = 2)
    private  BigDecimal severity;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
