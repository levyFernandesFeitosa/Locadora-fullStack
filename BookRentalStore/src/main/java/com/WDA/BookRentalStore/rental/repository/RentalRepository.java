package com.WDA.BookRentalStore.rental.repository;

import com.WDA.BookRentalStore.book.model.Book;
import com.WDA.BookRentalStore.rental.model.Rental;
import com.WDA.BookRentalStore.rental.model.Status;
import com.WDA.BookRentalStore.renter.model.Renter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RentalRepository extends JpaRepository<Rental, Integer> {
    Long countByStatus(Status status);

    List<Rental> findAllByOrderByIdDesc();

    Optional<Rental> findByRenterAndBookAndStatus(Renter renter, Book book, Status status);

    boolean existsByRenter(Renter renter);

    boolean existsByBook(Book book);
}
