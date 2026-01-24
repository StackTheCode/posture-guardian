package com.rk.postguard;


import com.rk.postguard.security.JwtTokenProvider;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

public class JwtTokenProviderTest {
    private JwtTokenProvider tokenProvider;


    @BeforeEach
    void setUp(){
        tokenProvider = new JwtTokenProvider();

        ReflectionTestUtils.setField(tokenProvider,"jwtSecret","testSecretKeyThatIsLongEnoughForHS256Algorithm1234567890");
        ReflectionTestUtils.setField(tokenProvider,"expiration",3600000L);

        tokenProvider.init();
    }

    @Test
    void generateToken_ShouldCreateValidToken(){

        String token = tokenProvider.generateToken("testuser");

            assertNotNull(token);
            assertTrue(token.length() > 0);
            assertTrue(token.contains("."));

    }


    @Test
    void getUsernameFromToken_ShouldReturnCorrectUsername(){
        String token = tokenProvider.generateToken("testuser");

        String username = tokenProvider.getUsernameFromToken(token);

        assertEquals("testuser",username);
    }

    @Test
    void validateToken_ShouldReturnTrue_WhenTokenValid(){
        String token = tokenProvider.generateToken("testuser");

        boolean isValid = tokenProvider.validateToken(token);

        assertTrue(isValid);
    }

    @Test
    void validateToken_ShouldReturnFalse_WhenTokenInvalid(){
        String invalid = "invalid.jwt.token";

        boolean isValid = tokenProvider.validateToken(invalid);

        assertFalse(isValid);
    }


    @Test
    void validateToken_ShouldReturnFalse_WhenTokenExpired(){
        JwtTokenProvider shortTokenProvider  = new JwtTokenProvider();
        ReflectionTestUtils.setField(shortTokenProvider,"jwtSecret",
                "testSecretKeyThatIsLongEnoughForHS256Algorithm1234567890");
        ReflectionTestUtils.setField(shortTokenProvider,"expiration", 1L);
        shortTokenProvider.init();

        String token = shortTokenProvider.generateToken("testuser");

        try{
       Thread.sleep(10);
        } catch (InterruptedException e ){
            fail("Thread interrupted");
        }

        boolean isValid = shortTokenProvider.validateToken(token);

        assertFalse(isValid);
    }
}
