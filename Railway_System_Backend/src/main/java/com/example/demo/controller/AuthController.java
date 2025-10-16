package com.example.demo.controller;
import com.example.demo.service.UserService;
import com.example.demo.dto.AuthResponse;
import com.example.demo.model.User;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest registerRequest) {
        return userService.registerUser(registerRequest.getUsername(), registerRequest.getPassword());
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest loginRequest) {
        String token = userService.loginAndGenerateToken(
                loginRequest.getUsername(),
                loginRequest.getPassword()
        );
        return new AuthResponse(token);
    }
    @PostMapping("/registerAdmin")
    public User registerAdmin(@RequestBody RegisterRequest registerRequest) {
        return userService.saveAdmin(registerRequest.getUsername(), registerRequest.getPassword());
    }



}

