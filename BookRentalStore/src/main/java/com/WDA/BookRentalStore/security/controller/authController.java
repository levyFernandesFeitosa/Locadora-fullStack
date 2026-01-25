package com.WDA.BookRentalStore.security.controller;

import com.WDA.BookRentalStore.security.dto.ForgotPasswordDto;
import com.WDA.BookRentalStore.security.dto.LoginDto;
import com.WDA.BookRentalStore.security.dto.LoginResponseDto;
import com.WDA.BookRentalStore.security.dto.ResetPasswordDto;
import com.WDA.BookRentalStore.security.service.TokenService;
import com.WDA.BookRentalStore.user.model.User;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class authController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private com.WDA.BookRentalStore.user.service.UserService userService;

    @Autowired
    private com.WDA.BookRentalStore.user.repositories.UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> authenticateUser(@RequestBody @Valid LoginDto loginDto) {
        try {
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                    loginDto.email(),
                    loginDto.password());
            Authentication authentication = authenticationManager.authenticate(authenticationToken);

            User user = (User) authentication.getPrincipal();

            String token = tokenService.generateToken(user);

            return ResponseEntity.ok(new LoginResponseDto(
                    token,
                    user.getUserName(),
                    user.getUserEmail(),
                    user.getRole().name()));

        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody @Valid ForgotPasswordDto forgotPasswordDto) {
        var user = userRepository.findByUserEmail(forgotPasswordDto.email());
        if (user.isPresent()) {
            return ResponseEntity.ok("E-mail validado.");
        } else {
            return ResponseEntity.status(404).body("E-mail não encontrado.");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody @Valid ResetPasswordDto resetPasswordDto) {
        try {
            userService.resetPassword(resetPasswordDto.email(), resetPasswordDto.password());
            return ResponseEntity.ok("Senha redefinida com sucesso.");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Erro ao redefinir senha.");
        }
    }
}
