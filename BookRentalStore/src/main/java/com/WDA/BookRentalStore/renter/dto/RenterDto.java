package com.WDA.BookRentalStore.renter.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RenterDto(
        Integer id,

        @NotBlank(message = "error.validation.renter_name_required") @Size(min = 3, max = 100, message = "error.validation.name_size_3_100") String renterName,

        @NotBlank(message = "error.validation.email_required") @Email(message = "error.validation.email_invalid") String renterEmail,

        @NotBlank(message = "error.validation.phone_required") @Size(min = 10, max = 20, message = "error.validation.phone_size") String renterTelephone,

        @NotBlank(message = "error.validation.cpf_required") @Size(min = 11, max = 14, message = "error.validation.cpf_size") String renterCpf,

        @NotBlank(message = "error.validation.address_required") @Size(max = 255, message = "error.validation.address_max_255") String renterAddress) {
}
