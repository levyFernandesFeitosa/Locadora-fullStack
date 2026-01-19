package com.WDA.BookRentalStore.user.repositories;

import com.WDA.BookRentalStore.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    List<User> findAllByOrderByIdDesc();

    Optional<User> findByUserName (String userName);

    Optional<User> findByUserEmail(String userEmail);
}
