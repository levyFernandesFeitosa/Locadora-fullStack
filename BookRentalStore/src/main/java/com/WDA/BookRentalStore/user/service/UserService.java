package com.WDA.BookRentalStore.user.service;

import com.WDA.BookRentalStore.user.dto.UserDto;
import com.WDA.BookRentalStore.user.exception.UserAlreadyExistsException;
import com.WDA.BookRentalStore.user.exception.UserNotFoundException;
import com.WDA.BookRentalStore.user.model.User;
import com.WDA.BookRentalStore.user.repositories.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors; // Import necessário para usar stream

@Service
public class UserService implements UserDetailsService {
    @Autowired
    UserRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return repository.findByUserEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User '" + email + "' not found"));
    }

    public List<UserDto> getAll() {
        return repository.findAllByOrderByIdDesc().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public User getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User with ID: " + id + " not found"));
    }

    public User save(UserDto dto) {
        if (repository.findByUserEmail(dto.userEmail()).isPresent()) {
            throw new UserAlreadyExistsException("O e-mail '" + dto.userEmail() + "' já está cadastrado.");
        }

        User user = new User();
        BeanUtils.copyProperties(dto, user);
        user.setUserPassword(passwordEncoder.encode(dto.userPassword()));
        return repository.save(user);
    }

    public void delete(Integer id) {
        User user = getById(id);
        if ("admin@admin.com".equals(user.getUserEmail())) {
            throw new RuntimeException("O administrador fixo ('admin@admin.com') não pode ser excluído.");
        }
        repository.delete(user);
    }

    public User update(Integer id, UserDto dto) {
        User existingUser = getById(id);

        if ("admin@admin.com".equals(existingUser.getUserEmail())) {
            throw new RuntimeException("O administrador fixo ('admin@admin.com') não pode ser alterado.");
        }

        repository.findByUserEmail(dto.userEmail())
                .ifPresent(u -> {
                    if (!u.getId().equals(id))
                        throw new UserAlreadyExistsException("E-mail já cadastrado.");
                });

        existingUser.setUserName(dto.userName());
        existingUser.setUserEmail(dto.userEmail());
        existingUser.setRole(dto.role());

        if (dto.userPassword() != null && !dto.userPassword().isEmpty()) {
            existingUser.setUserPassword(passwordEncoder.encode(dto.userPassword()));
        }

        return repository.save(existingUser);
    }

    public void resetPassword(String email, String newPassword) {
        User user = repository.findByUserEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado com o e-mail: " + email));
        user.setUserPassword(passwordEncoder.encode(newPassword));
        repository.save(user);
    }

    private UserDto convertToDto(User user) {
        return new UserDto(
                user.getId(),
                user.getUserName(),
                user.getUserEmail(),
                "",
                user.getRole());
    }
}