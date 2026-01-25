package com.WDA.BookRentalStore.book.repositorie;

import com.WDA.BookRentalStore.book.model.Book;
import com.WDA.BookRentalStore.publisher.model.Publishers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {

    Optional<Book> findByBookTitle(String bookTitle);

    List<Book> findAllByOrderByIdDesc();

    @Query(value = "SELECT b.book_title, COUNT(r.id) as total_rents " +
            "FROM book b JOIN rental r ON b.id = r.book_id " +
            "GROUP BY b.book_title " +
            "ORDER BY total_rents DESC " +
            "LIMIT 5", nativeQuery = true)
    List<Object[]> findTopRentedBooksNative();

    boolean existsByPublisher(Publishers publisher);
}
