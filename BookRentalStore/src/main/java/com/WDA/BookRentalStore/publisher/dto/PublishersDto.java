package com.WDA.BookRentalStore.publisher.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;

public record PublishersDto(
        Integer id,

        @NotBlank(message = "O nome da editora é obrigatório.")
        @Size(max = 100, message = "O nome não deve exceder 100 caracteres.")
        String publishersName,

        @NotBlank(message = "O e-mail é obrigatório.")
        @Email(message = "Formato de e-mail inválido.")
        @Size(max = 255, message = "O e-mail não deve exceder 255 caracteres.")
        String publishersEmail,

        @NotBlank(message = "O telefone é obrigatório.")
        //(ex: (XX) XXXX-XXXX)
        @Pattern(regexp = "^\\(?\\d{2}\\)?\\s?\\d{4,5}-?\\d{4}$", message = "Formato de telefone inválido.")
        String publishersTelephone,

        @Size(max = 100, message = "O site não deve exceder 100 caracteres.")
        @URL(message = "O endereço do site é inválido.")
        String publishersSite
) {
}
