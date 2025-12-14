package com.rk.postguard.repositories;

import com.rk.postguard.entity.PostureEvent;
import com.rk.postguard.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface PostureEventRepository extends JpaRepository<PostureEvent,Long> {
    List<PostureEvent> findByUserIdAndTimestampBetweenOrderByTimestampDesc(Long userId, LocalDateTime start, LocalDateTime end);


    @Query("SELECT pe.postureState,COUNT(pe) FROM PostureEvent  pe " +
            " WHERE pe.userId  = :userId AND pe.timestamp  BETWEEN :start AND :end " +
           "GROUP BY pe.postureState")
    List countPosturesByState(
            @Param("userId") Long userId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
    @Query("SELECT AVG (pe.severity) FROM PostureEvent as pe " +
    "WHERE pe.userId = :userId AND pe.timestamp  BETWEEN :start AND :end ")
    Double getAverageSeverity(
            @Param("userId") Long userId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}
