package com.WDA.BookRentalStore.book.service;

import com.WDA.BookRentalStore.book.dto.BookDto;
import com.WDA.BookRentalStore.book.exception.BookAlreadyExistsException;
import com.WDA.BookRentalStore.book.exception.BookNotFoundException;
import com.WDA.BookRentalStore.book.exception.BookStockZeroExcept;
import com.WDA.BookRentalStore.book.model.Book;
import com.WDA.BookRentalStore.book.repositorie.BookRepository;
import com.WDA.BookRentalStore.rental.exception.RentalBusinessException;
import com.WDA.BookRentalStore.rental.model.Rental;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {
    @Autowired
    BookRepository repository;

    @Autowired
    private com.WDA.BookRentalStore.rental.repository.RentalRepository rentalRepository;

    public List<Book> getAll() {
        return repository.findAllByOrderByIdDesc();
    }

    public Book getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new BookNotFoundException("Book with ID: " + id + " not found"));

    }

    public Book save(BookDto dto) {
        if (repository.findByBookTitle(dto.bookTitle()).isPresent()) {
            throw new BookAlreadyExistsException("error.already_exists");
        }
        Book book = new Book();
        BeanUtils.copyProperties(dto, book);
        return repository.save(book);
    }

    public void delete(Integer id) {
        Book book = getById(id);

        if (rentalRepository.existsByBook(book)) {
            throw new RentalBusinessException("error.resource_linked");
        }

        repository.delete(book);
    }

    public Book update(Integer id, BookDto dto) {
        Book existingBook = getById(id);
        Optional<Book> bookWithSameTitle = repository.findByBookTitle(dto.bookTitle());

        if (bookWithSameTitle.isPresent() && !bookWithSameTitle.get().getId().equals(id)) {
            throw new BookAlreadyExistsException("error.already_exists");
        }
        BeanUtils.copyProperties(dto, existingBook);
        existingBook.setId(id);
        return repository.save(existingBook);
    }

    // atualiza o total e inUse
    public void updateStockForRental(Integer bookId, int quantityChange) {
        Book book = getById(bookId);
        int newInUse = book.getBookInUse() + quantityChange;
        int newTotal = book.getBookTotal() - quantityChange;

        if (newTotal < 0 && quantityChange > 0) {
            throw new BookStockZeroExcept("Não há cópias disponíveis de '" + book.getBookTitle() + "' para aluguel.");
        }

        if (newInUse < 0) {
            throw new RuntimeException("Erro de lógica: Tentativa de devolver uma cópia que não estava em uso.");
        }

        book.setBookInUse(newInUse);
        book.setBookTotal(newTotal);

        repository.save(book);
    }
}
