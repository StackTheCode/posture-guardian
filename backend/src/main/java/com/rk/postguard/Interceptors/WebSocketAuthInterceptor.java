package com.rk.postguard.Interceptors;

import com.rk.postguard.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtTokenProvider tokenProvider;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authToken = accessor.getFirstNativeHeader("Authorization");

            log.info("WebSocket CONNECT attempt with Authorization: {}",
                    authToken != null ? "present" : "missing");

            if (authToken != null && authToken.startsWith("Bearer ")) {
                String token = authToken.substring(7);

                if (tokenProvider.validateToken(token)) {
                    String username = tokenProvider.getUsernameFromToken(token);

                    log.info("✅ WebSocket authenticated user: {}", username);

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(username, null, new ArrayList<>());

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    accessor.setUser(authentication);
                } else {
                    log.error("❌ Invalid JWT token in WebSocket");
                }
            } else {
                log.warn("⚠️ No Authorization header in WebSocket CONNECT");
            }
        }

        return message;
    }
}