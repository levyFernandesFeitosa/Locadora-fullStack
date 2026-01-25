package com.WDA.BookRentalStore.book.dto;

import com.WDA.BookRentalStore.publisher.model.Publishers;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record BookDto(
                Integer id,

                @NotBlank(message = "error.validation.book_title_required") @Size(max = 255, message = "error.validation.title_max_255") String bookTitle,

                @NotBlank(message = "error.validation.author_required") @Size(max = 100, message = "error.validation.author_max_100") String bookAuthor,

                @NotNull(message = "error.validation.launch_date_required") @PastOrPresent(message = "error.validation.launch_date_past") LocalDate bookLaunch,

                @NotNull(message = "error.validation.total_quantity_required") @Min(value = 1, message = "error.validation.total_min_1") Integer bookTotal,

                @Min(value = 0, message = "error.validation.in_use_negative") Integer bookInUse,

                @NotNull(message = "error.validation.publisher_required") Publishers publisher) {
}
