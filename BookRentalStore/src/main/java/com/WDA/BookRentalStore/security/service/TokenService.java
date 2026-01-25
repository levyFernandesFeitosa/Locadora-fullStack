package com.WDA.BookRentalStore.security.service;

import com.WDA.BookRentalStore.user.model.User;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneOffset;
import java.nio.charset.StandardCharsets; // 🚨 NOVO IMPORT

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;

    private final long EXPIRATION_TIME_SECONDS = 7200;

    public String generateToken(User user) {
        try {
            // 🚀 CORREÇÃO APLICADA: Converte a String secret para um array de bytes
            Algorithm algorithm = Algorithm.HMAC256(secret.getBytes(StandardCharsets.UTF_8));

            return JWT.create()
                    .withIssuer("book-rental-api")
                    .withSubject(user.getUserEmail())
                    .withClaim("role", user.getRole().name())
                    .withExpiresAt(getExpirationInstant())
                    .sign(algorithm);
        } catch (JWTCreationException exception) {
            // Lançamos uma RuntimeException para que o erro 500 não seja genérico,
            // mas o AuthController o intercepta e lança um 401 ou 500.
            throw new RuntimeException("Erro ao gerar token JWT", exception);
        }
    }

    public String validateToken(String token) {
        try {
            // 🚀 CORREÇÃO APLICADA: Converte a String secret para um array de bytes
            Algorithm algorithm = Algorithm.HMAC256(secret.getBytes(StandardCharsets.UTF_8));

            return JWT.require(algorithm)
                    .withIssuer("book-rental-api")
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException exception) {
            return "";
        }
    }

    private Instant getExpirationInstant() {
        return Instant.now().plusSeconds(EXPIRATION_TIME_SECONDS).atOffset(ZoneOffset.of("-03:00")).toInstant();
    }
}