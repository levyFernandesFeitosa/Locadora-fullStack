package com.WDA.BookRentalStore.publisher.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;

public record PublishersDto(
        Integer id,

        @NotBlank(message = "error.validation.publisher_name_required") @Size(max = 100, message = "error.validation.name_max_100") String publishersName,

        @NotBlank(message = "error.validation.email_required") @Email(message = "error.validation.email_invalid") @Size(max = 255, message = "error.validation.email_max_255") String publishersEmail,

        @NotBlank(message = "error.validation.phone_required") @Size(min = 10, max = 20, message = "error.validation.phone_size") @Pattern(regexp = "^[0-9()\\s-]+$", message = "error.validation.phone_invalid") String publishersTelephone,

        @Size(max = 100, message = "error.validation.site_max_100") @URL(message = "error.validation.site_invalid") String publishersSite) {
}
