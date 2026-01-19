package com.WDA.BookRentalStore.security.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginDto(
        @NotBlank(message = "O e-mail é obrigatório.")
        @Email(message = "Formato de e-mail inválido.") // Adiciona validação de formato
        String email,

        @NotBlank(message = "A senha é obrigatória.")
        String password
) {
}
