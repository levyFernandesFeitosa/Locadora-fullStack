package com.WDA.BookRentalStore.publisher.repository;

import com.WDA.BookRentalStore.publisher.model.Publishers;
import com.WDA.BookRentalStore.rental.model.Rental;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PublishersRepository extends JpaRepository<Publishers, Integer> {
    Optional<Publishers> findByPublishersName(String publishersName);
    List<Publishers> findAllByOrderByIdDesc();
    Optional<Publishers> findByPublishersEmail(String publishersEmail);
}
