package com.rk.postguard.service;


import com.rk.postguard.dto.AnalyticsResponse;
import com.rk.postguard.entity.PostureEvent;
import com.rk.postguard.entity.User;
import com.rk.postguard.repositories.PostureEventRepository;
import com.rk.postguard.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.format.TextStyle;
import java.util.*;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsService {

    private final PostureEventRepository postureEventRepository;
    private final UserRepository userRepository;


    public AnalyticsResponse getWeeklyAnalytics(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime weekAgo = now.minusDays(7);
        List<PostureEvent> events = postureEventRepository.findByUserIdAndTimestampBetweenOrderByTimestampDesc(user.getId(), weekAgo, now);

        return calculateAnalytics(events, weekAgo, now);
    }

    public AnalyticsResponse getTodayAnalytics(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfDay = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);
        List<PostureEvent> events = postureEventRepository.findByUserIdAndTimestampBetweenOrderByTimestampDesc(user.getId(), startOfDay, endOfDay);
        return calculateAnalytics(events, startOfDay, endOfDay);
    }

    public AnalyticsResponse calculateAnalytics(List<PostureEvent> events, LocalDateTime start, LocalDateTime end) {
        if (events.isEmpty()) {
            return AnalyticsResponse.builder()
                    .totalEvents(0)
                    .goodPostureCount(0)
                    .badPostureCount(0)
                    .averageSeverity(0)
                    .goodPosturePercentage(0.0)
                    .postureDistribution(new HashMap<>())
                    .weeklyData(new ArrayList<>())
                    .insights(List.of("No data available yet. Start tracking your posture!"))
                    .build();
        }
//    Calculate basic stats

            long totalEvents = events.size();
            long goodPostureCount = events.stream()
                    .filter(e -> "good".equalsIgnoreCase(e.getPostureState()))
                    .count();
            long badPostureCount = totalEvents - goodPostureCount;

            double averageSeverity = events.stream()
                    .mapToDouble(e -> e.getSeverity().doubleValue())
                    .average().orElse(0);
            double goodPosturePercentage = (double) goodPostureCount / totalEvents * 100;


//        Posture Distribution

            Map<String, Long> postureDistribution = events.stream()
                    .collect(Collectors.groupingBy(PostureEvent::getPostureState, Collectors.counting()));

//    Weekly Data (group by day)
            Map<DayOfWeek, List<PostureEvent>> eventsByDay = events.stream()
                    .collect(Collectors.groupingBy(e -> e.getTimestamp().getDayOfWeek()));

            List<AnalyticsResponse.DailyStats> weeklyData = new ArrayList<>();

//    Last 7 days

            for (int i = 6; i >= 0; i--) {
                LocalDateTime day = LocalDateTime.now().minusDays(i);
                DayOfWeek dayOfWeek = day.getDayOfWeek();
                String dayName = dayOfWeek.getDisplayName(TextStyle.SHORT, Locale.ENGLISH);

                List<PostureEvent> dayEvents = eventsByDay.getOrDefault(dayOfWeek, Collections.emptyList());
                long dayGood = dayEvents.stream()
                        .filter(e -> "good".equalsIgnoreCase(e.getPostureState()))
                        .count();
                long dayBad = dayEvents.size() - dayGood;
                double dayGoodPercentage = dayEvents.isEmpty() ? 0 : (double) dayGood / dayEvents.size() * 100;

                weeklyData.add(AnalyticsResponse.DailyStats.builder()
                        .day(dayName)
                        .good(dayGood)
                        .bad(dayBad)
                        .goodPercentage(dayGoodPercentage)
                        .build());
            }

            // Generate insights
            List<String> insights = new ArrayList<>();

            return AnalyticsResponse.builder()
                    .totalEvents(totalEvents)
                    .goodPostureCount(goodPostureCount)
                    .badPostureCount(badPostureCount)
                    .averageSeverity(averageSeverity)
                    .goodPosturePercentage(goodPosturePercentage)
                    .postureDistribution(postureDistribution)
                    .weeklyData(weeklyData)
                    .insights(insights)
                    .build();


    }


    private  List<String> generateInsights (List<PostureEvent> events,double goodPosturePercentage,
                                            Map<String, Long> distribution) {
     List<String> insights = new ArrayList<>();
      // Insight 1: Overall performance

        if(goodPosturePercentage > 80){
            insights.add("Excellent! You're maintaining good posture " +
            String.format("%.0f%%",goodPosturePercentage) + "of the time");
                    
        } else if (goodPosturePercentage >= 60) {
            insights.add("Good progress! Aim to increase your good posture percentage above 80%.");
        }
        else{
            insights.add("Your posture needs attention. Try setting reminders to check your posture hourly.");
        }


//        Insight 2: Most Common bad posture

        String mostCommonBadPosture = distribution.entrySet().stream()
                .filter(e ->!"good".equalsIgnoreCase(e.getKey()))
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);

        if(mostCommonBadPosture !=null){
            switch (mostCommonBadPosture){
                case "forward_lean":
                    insights.add("Forward lean is your most common issue. Raise your monitor to eye level.");
                    break;
                case "slouched":
                    insights.add("You tend to slouch frequently. Check your chair's lumbar support.");
                    break;
                case "shoulder_tilt":
                    insights.add("Shoulder tilt detected often. Ensure your desk and chair are level.");
                    break;
                default:
                    insights.add("Monitor your " + mostCommonBadPosture.replace("_", " ") + " posture.");
            }
        }

        // Insight 3: Time-based pattern (if we have timestamp data)
        Map<Integer, List<PostureEvent>> eventsByHour = events.stream()
                .collect(Collectors.groupingBy(e -> e.getTimestamp().getHour()));
        Integer worstHour = eventsByHour.entrySet().stream()
                .filter(e -> e.getValue().stream()
                        .filter(event -> !"good".equalsIgnoreCase(event.getPostureState()))
                        .count() > e.getValue().size() / 2)
                .map(Map.Entry::getKey)
                .findFirst()
                .orElse(null);

        if (worstHour != null) {
            insights.add(String.format("Your posture tends to worsen around %d:00. Take a stretch break!", worstHour));
        }

        return insights;

    }



}