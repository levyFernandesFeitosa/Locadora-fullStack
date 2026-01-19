package com.WDA.BookRentalStore.book.model;


import com.WDA.BookRentalStore.publisher.model.Publishers;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity(name = "/bookEntity")
@Table(name = "\"book\"")
@Getter
@Setter
@NoArgsConstructor
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "book_title")
    private String bookTitle;

    @Column(name = "book_author")
    private String bookAuthor;


    @Column(name = "book_launch")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate bookLaunch;

    @Column(name = "book_total")
    private Integer bookTotal;

    @Column(name = "book_inuse")
    private Integer bookInUse;

    @ManyToOne
    @JoinColumn(name = "publisher_id", nullable = false)
    private Publishers publisher;

    public Book(Integer id, String bookTitle, String bookAuthor, LocalDate bookLaunch, Integer bookTotal, Integer bookInUse, Publishers publisher) {
        this.id = id;
        this.bookTitle = bookTitle;
        this.bookAuthor = bookAuthor;
        this.bookLaunch = bookLaunch;
        this.bookTotal = bookTotal;
        this.bookInUse = bookInUse;
        this.publisher = publisher;
    }
}
