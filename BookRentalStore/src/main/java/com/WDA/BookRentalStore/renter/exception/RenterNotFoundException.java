package com.WDA.BookRentalStore.renter.exception;

public class RenterNotFoundException extends RuntimeException {
    public RenterNotFoundException(String message) {
        super(message);
    }
}
