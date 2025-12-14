package com.rk.postguard.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
@AllArgsConstructor
public class AnalyticsResponse {
    private  long id;
    private Map postureDistribution;
    private  double averageSeverity;
    private  String mostCommonPosture;
    private  long goodPostureCount;
    private  long badPostureCount;
}
