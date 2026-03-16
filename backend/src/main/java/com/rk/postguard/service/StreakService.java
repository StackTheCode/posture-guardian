package com.rk.postguard.service;


import com.rk.postguard.dto.StreakResponse;
import com.rk.postguard.entity.PostureEvent;
import com.rk.postguard.entity.User;
import com.rk.postguard.entity.UserStreak;
import com.rk.postguard.repositories.PostureEventRepository;
import com.rk.postguard.repositories.UserRepository;
import com.rk.postguard.repositories.UserStreakRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StreakService {

    private final UserStreakRepository streakRepository;
    private  final PostureEventRepository postureEventRepository;
    private final UserRepository userRepository;

    /**
         * Calculate if user has good posture for a day
     * Definition: 70%+ good posture events
     */
    private  boolean hasGoodPostureDay(Long userId, LocalDate date){
        LocalDateTime startOfDay =date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23,59,59);
        List<PostureEvent> events  =  postureEventRepository.findByUserIdAndTimestampBetweenOrderByTimestampDesc(userId,startOfDay,endOfDay);
        if(events.isEmpty()){
            return  false;
        }
        long goodCount = events.stream().
                filter(e -> "good".equalsIgnoreCase(e.getPostureState()))
                .count();

        double goodPercentage = (double) goodCount / events.size();
        return goodPercentage >= 0.70;

    }

    @Transactional
    public UserStreak updateStreak(Long userId) {
        UserStreak streak = streakRepository.findByUserId(userId)
                .orElse(UserStreak.builder()
                        .userId(userId)
                        .currentStreak(0)
                        .longestStreak(0)
                        .build());

        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        // First time or very old data
        if (streak.getLastActivityDate() == null) {
            if (hasGoodPostureDay(userId, today)) {
                streak.setCurrentStreak(1);
                streak.setLongestStreak(1);
                streak.setLastActivityDate(today);
            }
            return streakRepository.save(streak);
        }

        LocalDate lastDate = streak.getLastActivityDate();

        // Already updated today
        if (lastDate.equals(today)) {
            return streak;
        }

        // Consecutive day (yesterday was last update)
        if (lastDate.equals(yesterday)) {
            if (hasGoodPostureDay(userId, today)) {
                streak.setCurrentStreak(streak.getCurrentStreak() + 1);
                streak.setLastActivityDate(today);

                // Update longest streak if needed
                if (streak.getCurrentStreak() > streak.getLongestStreak()) {
                    streak.setLongestStreak(streak.getCurrentStreak());
                }
            } else {
                // Today wasn't a good day - streak breaks
                streak.setCurrentStreak(0);
                streak.setLastActivityDate(today);
            }
        }
        // Streak was broken (missed days)
        else {
            if (hasGoodPostureDay(userId, today)) {
                streak.setCurrentStreak(1);
                streak.setLastActivityDate(today);
            } else {
                streak.setCurrentStreak(0);
                streak.setLastActivityDate(today);
            }
        }

        return streakRepository.save(streak);
    }
    /**
     * Get current streak for user
     * */
    public int getCurrentStreak(Long userId){
        UserStreak streak = updateStreak(userId);
        return  streak.getCurrentStreak();
    }

    /**
     * Get Streak Stats
     * */
    public StreakResponse getStreakStats(String username){
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserStreak streak = updateStreak(user.getId());
        return StreakResponse.builder()
                .currentStreak(streak.getCurrentStreak())
                .longestStreak(streak.getLongestStreak())
                .lastActivateDate(streak.getLastActivityDate())
                .build();
    }

}
