package com.rk.postguard.services;


import com.rk.postguard.dto.PostureEventDto;
import com.rk.postguard.entity.PostureEvent;
import com.rk.postguard.entity.User;
import com.rk.postguard.repositories.PostureEventRepository;
import com.rk.postguard.repositories.UserRepository;
import com.rk.postguard.service.PostureService;
import com.rk.postguard.service.WebSocketService;
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

import  static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PostureServiceTest {

    @Mock
    private PostureEventRepository postureEventRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private WebSocketService webSocketService;

    @InjectMocks
    private PostureService postureService;

    private User testUser;
    private PostureEventDto testDto;
    private PostureEvent testEvent;


    @BeforeEach
    void setup(){
        testUser = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .build();

        testDto = PostureEventDto.builder()
                .postureState("good")
                .confidence(new BigDecimal("0.85"))
                .severity(new BigDecimal("0.20"))
                .timestamp(LocalDateTime.now())
                .build();

        testEvent = PostureEvent.builder()
                .id(1L)
                .userId(1L)
                .postureState("good")
                .confidence(new BigDecimal("0.85"))
                .severity(new BigDecimal("0.20"))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Test
    void savePostureEvent_ShouldSaveAndBroadcast_WhenValidData(){
//        Arrange

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(postureEventRepository.save(any(PostureEvent.class))).thenReturn(testEvent);


        PostureEventDto result = postureService.savePostureEvent("testuser",testDto);

        assertNotNull(result);
        assertEquals("good", result.getPostureState());
        assertEquals(new BigDecimal("0.85"),result.getConfidence());
        verify(postureEventRepository,times(1)).save(any(PostureEvent.class));
        verify(webSocketService,times(1)).sendPostureAnalysis(eq("testuser"),any(PostureEventDto.class));

    }

    @Test
    void savePostureEvent_ShouldThrowException_WhenUserNotFound(){
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());
        RuntimeException exception = assertThrows(RuntimeException.class,() -> postureService.savePostureEvent("nonexistent",testDto));
        assertEquals("User not found", exception.getMessage());
        verify(postureEventRepository,never()).save(any(PostureEvent.class));
    }

    @Test
    void getPostureEvents_ShouldReturnEventsList_WhenEventsExist(){
        LocalDateTime start = LocalDateTime.now().minusDays(1);
        LocalDateTime end = LocalDateTime.now();

        List<PostureEvent> events = Arrays.asList(testEvent);

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(postureEventRepository.findByUserIdAndTimestampBetweenOrderByTimestampDesc(eq(1L), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(events);

        List<PostureEventDto> result = postureService.getPostureEvents("testuser",start,end);

        assertNotNull(result);
        assertEquals(1,result.size());
        assertEquals("good", result.get(0).getPostureState());
    }


    @Test
    void getPostureEvents_ShouldReturnEmptyList_WhenNoEvents(){
       LocalDateTime start = LocalDateTime.now().minusDays(1);
       LocalDateTime end = LocalDateTime.now();

       when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
       when(postureEventRepository.findByUserIdAndTimestampBetweenOrderByTimestampDesc(
               anyLong(),any(LocalDateTime.class),any(LocalDateTime.class)
       )).thenReturn(Arrays.asList());

       List<PostureEventDto> result = postureService.getPostureEvents("testuser", start, end);

       assertNotNull(result);
       assertTrue(result.isEmpty());

    }

}
