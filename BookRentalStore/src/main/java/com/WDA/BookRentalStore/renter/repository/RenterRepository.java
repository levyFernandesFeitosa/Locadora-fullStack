package com.WDA.BookRentalStore.renter.repository;

import com.WDA.BookRentalStore.rental.model.Rental;
import com.WDA.BookRentalStore.renter.model.Renter;
import com.WDA.BookRentalStore.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RenterRepository extends JpaRepository<Renter, Integer> {
    List<Renter> findAllByOrderByIdDesc();
    Optional<Renter> findByRenterEmail(String renterEmail);
    Optional<Renter> findByRenterCpf(String renterCpf);

}
