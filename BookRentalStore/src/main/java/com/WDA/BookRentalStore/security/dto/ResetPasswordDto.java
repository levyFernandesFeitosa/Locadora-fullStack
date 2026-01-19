package com.WDA.BookRentalStore.security.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ResetPasswordDto(
        @NotBlank(message = "O e-mail é obrigatório.") @Email(message = "Formato de e-mail inválido.") String email,

        @NotBlank(message = "A nova senha é obrigatória.") String password) {
}
