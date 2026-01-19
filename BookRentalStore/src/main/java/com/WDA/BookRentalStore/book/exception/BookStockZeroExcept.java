package com.WDA.BookRentalStore.book.exception;

public class BookStockZeroExcept extends RuntimeException {
    public BookStockZeroExcept(String message) {
        super(message);
    }
}
