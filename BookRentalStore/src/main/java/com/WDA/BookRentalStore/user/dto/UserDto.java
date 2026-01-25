package com.WDA.BookRentalStore.user.dto;

import com.WDA.BookRentalStore.user.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserDto(
        Integer id,

        @NotBlank(message = "error.validation.name_required") @Size(min = 3, max = 100, message = "error.validation.name_size_3_100") String userName,

        @NotBlank(message = "error.validation.email_required") @Email(message = "error.validation.email_invalid") String userEmail,

        @NotBlank(message = "error.validation.password_required") @Size(min = 8, message = "error.validation.password_size_8") String userPassword,

        @NotNull(message = "error.validation.role_required") Role role) {
}
