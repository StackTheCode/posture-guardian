package com.rk.postguard.controllers;

import com.rk.postguard.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
private  final UserService userService;

@DeleteMapping("/me")
    public ResponseEntity<?> deleteAccount(Authentication auth){
    String username = auth.getName();
    userService.deleteUser(username);
    return  ResponseEntity.noContent().build();
}
}

