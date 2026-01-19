package com.WDA.BookRentalStore.book.dto;

import com.WDA.BookRentalStore.publisher.model.Publishers;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record BookDto(
        Integer id,

        @NotBlank(message = "O título é obrigatório.")
        @Size(max = 255, message = "O título não pode exceder 255 caracteres.")
        String bookTitle,

        @NotBlank(message = "O autor é obrigatório.")
        @Size(max = 100, message = "O nome do autor não pode exceder 100 caracteres.")
        String bookAuthor,

        @NotNull(message = "A data de lançamento é obrigatória.")
        @PastOrPresent(message = "A data de lançamento não pode ser futura.")
        LocalDate bookLaunch,

        @NotNull(message = "O estoque total é obrigatório.")
        @Min(value = 1, message = "O estoque total deve ser no mínimo 1.")
        Integer bookTotal,

        @Min(value = 0, message = "O número de cópias em uso não pode ser negativo.")
        Integer bookInUse,

        @NotNull(message = "A editora é obrigatória.")
        Publishers publisher) {
}
