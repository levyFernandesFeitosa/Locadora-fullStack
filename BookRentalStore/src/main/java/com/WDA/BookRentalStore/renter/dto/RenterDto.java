package com.WDA.BookRentalStore.renter.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RenterDto(
        Integer id,

        @NotBlank(message = "O nome do locatário é obrigatório.")
        @Size(min = 3, max = 100, message = "O nome deve ter entre 3 e 100 caracteres.")
        String renterName,

        @NotBlank(message = "O email é obrigatório.")
        @Email(message = "O formato do email é inválido.")
        String renterEmail,

        @NotBlank(message = "O telefone é obrigatório.")
        @Size(min = 10, max = 20, message = "O telefone deve ter entre 10 e 20 caracteres.")
        String renterTelephone,

        @NotBlank(message = "O CPF é obrigatório.")
        @Size(min = 11, max = 14, message = "O CPF deve ter entre 11 e 14 caracteres (com ou sem pontuação).")
        String renterCpf,

        @NotBlank(message = "O endereço é obrigatório.")
        @Size(max = 255, message = "O endereço não pode exceder 255 caracteres.")
        String renterAddress
) {
}
