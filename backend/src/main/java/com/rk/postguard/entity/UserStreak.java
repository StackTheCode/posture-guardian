package com.rk.postguard.entity;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnTransformers;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_streaks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStreak {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id",unique = true,nullable = false)
    private Long userId;

   @Column(name="current_streak",nullable = false)
    private Integer currentStreak =0;

    @Column(name="longest_streak",nullable = false)
    private Integer longestStreak =0;

    @Column(name = "last_activity_date")
    private LocalDate lastActivityDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate(){
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    @PreUpdate
    protected void onUpdate(){
        updatedAt = LocalDateTime.now();
    }
}
