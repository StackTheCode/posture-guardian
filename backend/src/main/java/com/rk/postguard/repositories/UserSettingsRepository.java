package com.rk.postguard.repositories;

import com.rk.postguard.entity.UserSettings;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.Optional;

public interface UserSettingsRepository extends JpaRepository<UserSettings,Long> {
    Optional<UserSettings> findByUserId(Long userId);



    @Modifying
    @Transactional
    void deleteByUserId(Long userId);
}
