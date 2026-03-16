package com.rk.postguard.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StreakResponse {
    private  Integer currentStreak;
    private Integer longestStreak;
    private LocalDate lastActivateDate;

}
