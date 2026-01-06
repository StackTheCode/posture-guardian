package com.rk.postguard.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {
    private long totalEvents;
    private  long goodPostureCount;
    private  long badPostureCount;
    private  double averageSeverity;
    private double goodPosturePercentage;

    private Map<String,Long> postureDistribution;

    private  List<DailyStats> weeklyData;
    private List<String> insights;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
    public static class DailyStats {
       private String day;
       private long good;
       private long bad;
       private double goodPercentage;
}
}
