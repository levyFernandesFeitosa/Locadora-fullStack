package com.WDA.BookRentalStore.dashboard.service;

import com.WDA.BookRentalStore.book.repositorie.BookRepository;
import com.WDA.BookRentalStore.dashboard.dto.BookMoreRentedDTO;
import com.WDA.BookRentalStore.dashboard.dto.RentsPerRenterDTO;
import com.WDA.BookRentalStore.rental.model.Status;
import com.WDA.BookRentalStore.rental.repository.RentalRepository;
import com.WDA.BookRentalStore.renter.repository.RenterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private RentalRepository rentalRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private RenterRepository renterRepository;

    public List<BookMoreRentedDTO> findBookMoreRented(Integer numberOfMonths){
        return bookRepository.findTopRentedBooksNative()
                .stream()
                .map(obj -> {
                    String bookTitle = (String) obj[0];
                    Long rentalCount = ((Number) obj[1]).longValue();
                    return new BookMoreRentedDTO(bookTitle, rentalCount);
                })
                .collect(Collectors.toList());
    }

    public Long findRentsLateQuantity(Integer numberOfMonths){
        return rentalRepository.countByStatus(Status.late);
    }

    public Long findDeliveredInTimeQuantity(Integer numberOfMonths) {
        return rentalRepository.countByStatus(Status.in_time);
    }

    public Long findDeliveredWithDelayQuantity(Integer numberOfMonths) {
        return rentalRepository.countByStatus(Status.returned_with_delay);
    }

    public List<RentsPerRenterDTO> findRentsPerRenter(Integer numberOfMonths) {
        return List.of();
    }
}