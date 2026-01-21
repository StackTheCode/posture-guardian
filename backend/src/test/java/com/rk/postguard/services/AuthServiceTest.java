package com.rk.postguard.services;

import com.rk.postguard.dto.AuthRequest;
import com.rk.postguard.dto.AuthResponse;
import com.rk.postguard.dto.RegisterRequest;
import com.rk.postguard.entity.User;
import com.rk.postguard.repositories.UserRepository;
import com.rk.postguard.security.JwtTokenProvider;
import com.rk.postguard.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {
    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private AuthService authService;

    private User testUser;


    @BeforeEach
    void setUp(){
        testUser = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .passwordHash("$2a$10$hashedpassword")
                .build();
    }


    @Test
    void register_ShouldCreateUserAndReturnToken_WhenValidRequest(){

        RegisterRequest request = new RegisterRequest();
        request.setUsername("newuser");
        request.setEmail("new@gmail.com");
        request.setPassword("password123");


        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$10$hashedpassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtTokenProvider.generateToken(anyString())).thenReturn("token");


        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("token",response.getToken());
        assertEquals("newuser",response.getUsername());
        verify(userRepository,times(1)).save(any(User.class));
    }

@Test
    void register_ShouldThrowException_WhenUsernameExists(){
    RegisterRequest request = new RegisterRequest();
    request.setUsername("existinguser");
    request.setEmail("new@example.com");
    request.setPassword("password123");

    when(userRepository.existsByUsername("existinguser")).thenReturn(true);

    // Act & Assert
    RuntimeException exception = assertThrows(RuntimeException.class,
            () -> authService.register(request));

    assertEquals("Username already exists", exception.getMessage());
    verify(userRepository, never()).save(any(User.class));
}

@Test
void register_ShouldThrowException_WhenEmailExists(){
        RegisterRequest request = new RegisterRequest();

        request.setUsername("existinguser");
        request.setEmail("existing@example.com");
        request.setPassword("password123");

        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> authService.register(request));

        assertEquals("Email already exists",exception.getMessage());
}



@Test
    void login_ShouldReturnToken_WhenCredentialsValid(){
    // Arrange

    AuthRequest request = new AuthRequest();
    request.setUsername("testuser");
    request.setPassword("password123");

    when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
    when(passwordEncoder.matches("password123", testUser.getPasswordHash())).thenReturn(true);
    when(jwtTokenProvider.generateToken("testuser")).thenReturn("jwt.token.here");

    // Act
    AuthResponse response = authService.login(request);

    assertNotNull(response);
    assertEquals("jwt.token.here",response.getToken());
    assertEquals("testuser",response.getUsername());
    assertEquals("test@example.com", response.getEmail());

}

@Test
    void login_ShouldThrowException_WhenUserNotFound(){
    AuthRequest request = new AuthRequest();
    request.setUsername("notexistent");
    request.setPassword("password123");

    when(userRepository.findByUsername("notexistent")).thenReturn(Optional.empty());

RuntimeException exception = assertThrows(RuntimeException.class, ()-> authService.login(request));

assertEquals("User not found", exception.getMessage());
}

@Test
    void login_ShouldThrowException_WhenPasswordInvalid(){
        AuthRequest request = new AuthRequest();
        request.setUsername("testuser");
        request.setPassword("wrongpassword");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongpassword", testUser.getPasswordHash())).thenReturn(false);
    RuntimeException exception = assertThrows(RuntimeException.class,
            () -> authService.login(request));
    assertEquals("Invalid credentials", exception.getMessage());
}
}
