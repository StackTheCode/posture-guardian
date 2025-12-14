package com.rk.postguard.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;


@Data
public class RegisterRequest {

    @NotBlank(message = "username is required")
    @Size(min = 3,max = 50)
    private String username;

    @NotBlank(message = "email is required")
    private  String email;

    @NotBlank(message = "password is required")
    @Size(min = 6,message = "Password should be at least 6 characters")
    private  String password;

}
