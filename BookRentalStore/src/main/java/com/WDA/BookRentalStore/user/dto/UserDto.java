package com.WDA.BookRentalStore.user.dto;

import com.WDA.BookRentalStore.user.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserDto(
        Integer id,

        @NotBlank(message = "O nome é obrigatório")
        @Size(min = 3, max = 100, message = "O nome deve ter entre 3 e 100 caracteres.")
        String userName,

        @NotBlank(message = "O email é obrigatório")
        @Email(message = "O formato de email é inválido")
        String userEmail,

        @NotBlank(message = "A senha é obrigatória")
        @Size(min = 8, message = "A senha deve ter no mínimo 6 caracteres.")
        String userPassword,

        @NotNull(message = "O papel do usuário (role) é obrigatório.")
        Role role) {
}
