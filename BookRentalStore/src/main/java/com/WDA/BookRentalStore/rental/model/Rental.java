package com.WDA.BookRentalStore.rental.model;


import com.WDA.BookRentalStore.book.model.Book;
import com.WDA.BookRentalStore.renter.model.Renter;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;

@Entity(name = "/RentalEntity")
@Table(name = "\"rental\"")
@Getter
@Setter
@NoArgsConstructor
public class Rental {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "renter_id", nullable = false)
    private Renter renter;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Column(name = "rental_renteddate")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate rentalRentedDate;

    @Column(name = "rental_deadline")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate rentalDeadline;

    @Column(name = "rental_returndate")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate rentalReturnDate;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "status")
    private Status status;

    public Rental(Integer id, Renter renter, Book book, LocalDate rentalRentedDate, LocalDate rentalDeadline, LocalDate rentalReturnDate, Status status) {
        this.id = id;
        this.renter = renter;
        this.book = book;
        this.rentalRentedDate = rentalRentedDate;
        this.rentalDeadline = rentalDeadline;
        this.rentalReturnDate = rentalReturnDate;
        this.status = status;
    }
}
