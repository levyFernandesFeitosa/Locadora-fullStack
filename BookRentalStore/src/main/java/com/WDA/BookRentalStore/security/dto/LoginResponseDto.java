package com.WDA.BookRentalStore.security.dto;

public record LoginResponseDto(String token, String userName, String userEmail, String role) {
}
