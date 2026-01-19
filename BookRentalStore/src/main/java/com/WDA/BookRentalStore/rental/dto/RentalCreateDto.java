package com.WDA.BookRentalStore.rental.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record RentalCreateDto(
                Integer id,

                @NotNull(message = "O Locatário é obrigatório.") Integer renterId,

                @NotNull(message = "O livro é obrigátorio.") Integer bookId, // Recebe o ID

                @JsonFormat(pattern = "yyyy-MM-dd") LocalDate rentalRentedDate,

                @NotNull(message = "A data de devolução é obrigatória.") @FutureOrPresent(message = "A data de devulução deve ser hoje ou futura.") @JsonFormat(pattern = "yyyy-MM-dd") LocalDate rentalDeadline) {
}
