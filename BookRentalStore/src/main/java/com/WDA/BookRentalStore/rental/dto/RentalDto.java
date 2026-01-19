package com.WDA.BookRentalStore.rental.dto;

import com.WDA.BookRentalStore.book.model.Book;
import com.WDA.BookRentalStore.renter.model.Renter;
import com.WDA.BookRentalStore.rental.model.Status;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record RentalDto(
        Integer id,

        @NotNull(message = "O Locatário é obrigatório.")
        Renter renter,

        @NotNull(message = "O livro é obrigátorio.")
        Book book,

        @NotNull(message = "A data de devolução é obrigatória.")
        LocalDate rentalRentedDate,

        @NotNull(message = "A data de devolução é obrigatória.")
        @FutureOrPresent(message = "A data de devulução deve ser hoje ou futura.")
        LocalDate rentalDeadline,

        LocalDate rentalReturnDate,
        Status status
) {
}
