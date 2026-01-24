package com.rk.postguard.repositories;
import com.rk.postguard.entity.PostureEvent;
import com.rk.postguard.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class PostureEventRepositoryTest {


    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private PostureEventRepository postureEventRepository;

    @Autowired
    private UserRepository userRepository;

    private User testUser;


    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .username("testuser")
                .email("test@example.com")
                .passwordHash("hashedpassword")
                .build();
        testUser = entityManager.persist(testUser);
        entityManager.flush();
    }

    @Test
    void findByUserIdAndTimestampBetween_ShouldReturnEvents_WhenInRange(){
        LocalDateTime now = LocalDateTime.now();

        PostureEvent event1 = PostureEvent.builder()
                .userId(testUser.getId())
                .postureState("good")
                .confidence(new BigDecimal("0.85"))
                .severity(new BigDecimal("0.20"))
                .timestamp(now.minusHours(2))
                .build();

        PostureEvent event2 = PostureEvent.builder()
                .userId(testUser.getId())
                .postureState("forward_lean")
                .confidence(new BigDecimal("0.80"))
                .severity(new BigDecimal("0.60"))
                .timestamp(now.minusHours(1))
                .build();

entityManager.persist(event1);
entityManager.persist(event2);
entityManager.flush();


List<PostureEvent> events = postureEventRepository.findByUserIdAndTimestampBetweenOrderByTimestampDesc(
        testUser.getId(),
        now.minusDays(1),
        now
);
assertEquals(2,events.size());
assertEquals("forward_lean",events.get(0).getPostureState());
    }


    @Test
    void findByUserIdAndTimestampBetween_ShouldReturnEmpty_WhenOutsideRange(){
        LocalDateTime now = LocalDateTime.now();

        PostureEvent event = PostureEvent.builder()
                .userId(testUser.getId())
                .postureState("good")
                .confidence(new BigDecimal("0.85"))
                .severity(new BigDecimal("0.20"))
                .timestamp(now.minusDays(8))
                .build();

        entityManager.persist(event);
        entityManager.flush();

        List<PostureEvent> events = postureEventRepository.findByUserIdAndTimestampBetweenOrderByTimestampDesc(
                testUser.getId(),
                now.minusDays(7),
                now
        );
        assertTrue(events.isEmpty());

    }

    @Test
    void save_ShouldPersistPostureEvent(){
        PostureEvent event = PostureEvent.builder()
                .userId(testUser.getId())
                .postureState("slouched")
                .confidence(new BigDecimal("0.90"))
                .severity(new BigDecimal("0.75"))
                .timestamp(LocalDateTime.now())
                .build();


        PostureEvent saved = postureEventRepository.save(event);

        assertNotNull(saved.getId());
        assertEquals("slouched",saved.getPostureState());
        assertNotNull(saved.getCreatedAt());
    }
}
