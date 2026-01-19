package com.WDA.BookRentalStore.publisher.model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "/publishersEntity")
@Table(name = "\"publishers\"")
@Getter
@Setter
@NoArgsConstructor
public class Publishers {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String publishersName;
    private String publishersEmail;
    private String publishersTelephone;
    private String publishersSite;

    public Publishers(Integer id, String publishersName, String publishersEmail, String publishersTelephone, String publishersSite) {
        this.id = id;
        this.publishersName = publishersName;
        this.publishersEmail = publishersEmail;
        this.publishersTelephone = publishersTelephone;
        this.publishersSite = publishersSite;
    }
}
