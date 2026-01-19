package com.WDA.BookRentalStore.publisher.exception;

public class PublishersNotFoundException extends RuntimeException {
    public PublishersNotFoundException(String message) {
        super(message);
    }
    public PublishersNotFoundException(Integer id) {
        super("Editora com ID " + id + " não foi encontrada.");
    }
}
