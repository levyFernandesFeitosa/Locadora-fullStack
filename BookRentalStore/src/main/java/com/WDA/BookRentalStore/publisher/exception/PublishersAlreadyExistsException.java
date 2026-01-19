package com.WDA.BookRentalStore.publisher.exception;

public class PublishersAlreadyExistsException extends RuntimeException {
    public PublishersAlreadyExistsException(String message) {
        super(message);
    }
}
