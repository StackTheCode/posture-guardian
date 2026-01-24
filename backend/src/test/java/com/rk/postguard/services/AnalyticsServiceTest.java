package com.rk.postguard.services;


import com.rk.postguard.dto.AnalyticsResponse;
import com.rk.postguard.entity.PostureEvent;
import com.rk.postguard.entity.User;
import com.rk.postguard.repositories.PostureEventRepository;
import com.rk.postguard.repositories.UserRepository;
import com.rk.postguard.service.AnalyticsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;


import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import  static org.mockito.ArgumentMatchers.eq;
import  static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
public class AnalyticsServiceTest {

    @Mock
    private PostureEventRepository postureEventRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AnalyticsService analyticsService;

    private User testUser;
    private List<PostureEvent> testEvents;

    @BeforeEach
    void setUp(){
        testUser = User.builder()
                .id(1L)
                .username("testuser")
                .build();

        LocalDateTime now = LocalDateTime.now();

        testEvents = Arrays.asList(
                PostureEvent.builder()
                        .id(1L).userId(1L).postureState("good")
                        .confidence(new BigDecimal("0.90")).severity(new BigDecimal("0.10"))
                        .timestamp(now.minusHours(2))
                        .build(),
                PostureEvent.builder()
                        .id(2L).userId(1L).postureState("forward_lean")
                        .confidence(new BigDecimal("0.85")).severity(new BigDecimal("0.60"))
                        .timestamp(now.minusHours(1))
                        .build(),
                PostureEvent.builder()
                        .id(3L).userId(1L).postureState("good")
                        .confidence(new BigDecimal("0.88")).severity(new BigDecimal("0.15"))
                        .timestamp(now)
                        .build()
        );


    }

    @Test
    void getWeeklyAnalytics_ShouldReturnCorrectStats_WhenEventsExist(){
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(postureEventRepository.findByUserIdAndTimestampBetweenOrderByTimestampDesc(
                eq(1L), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(testEvents);


        AnalyticsResponse response = analyticsService.getWeeklyAnalytics("testuser");

        assertNotNull(response);
        assertEquals(3, response.getTotalEvents());
        assertEquals(2, response.getGoodPostureCount());
        assertEquals(1, response.getBadPostureCount());
        assertTrue(response.getGoodPosturePercentage() > 60);
        assertTrue(response.getAverageSeverity() < 0.5);
        assertNotNull(response.getPostureDistribution());
        assertEquals(2, response.getPostureDistribution().get("good"));
        assertEquals(1, response.getPostureDistribution().get("forward_lean"));

    }

@Test
    void getWeeklyAnalytics_ShouldReturnEmptyStats_WhenNoEvents(){
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(postureEventRepository.findByUserIdAndTimestampBetweenOrderByTimestampDesc(
                eq(1L),any(LocalDateTime.class),any(LocalDateTime.class)
        )).thenReturn(Arrays.asList());


        AnalyticsResponse response = analyticsService.getWeeklyAnalytics("testuser");



        assertNotNull(response);
        assertEquals(0,response.getTotalEvents());
        assertEquals(0,response.getGoodPostureCount());
        assertEquals(0.0,response.getAverageSeverity());
        assertTrue(response.getInsights().size() > 0);
        assertTrue(response.getInsights().get(0).contains("No data available"));
}
@Test
    void getTodayAnalytics_ShouldReturnTodayStats(){

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(postureEventRepository.findByUserIdAndTimestampBetweenOrderByTimestampDesc(
                eq(1L), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(testEvents);
        AnalyticsResponse response = analyticsService.getTodayAnalytics("testuser");

        assertNotNull(response);
        assertEquals(3,response.getTotalEvents());
}

}
