package com.WDA.BookRentalStore.renter.exception;

public class RenterAlreadyExistsException extends RuntimeException {
    public RenterAlreadyExistsException(String message) {
        super(message);
    }
}
