package com.WDA.BookRentalStore.security;

import com.WDA.BookRentalStore.user.model.Role;
import com.WDA.BookRentalStore.user.model.User;
import com.WDA.BookRentalStore.user.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class InitialAdminConfig {

    @Bean
    public CommandLineRunner createInitialAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String adminEmail = "admin@admin.com";
            if (userRepository.findByUserEmail(adminEmail).isEmpty()) {

                System.out.println("🚨 Criando usuário ADMINISTRADOR inicial...");

                User adminUser = new User();
                adminUser.setUserName("Admin Inicial");
                adminUser.setUserEmail(adminEmail);
                adminUser.setUserPassword(passwordEncoder.encode("admin123"));
                adminUser.setRole(Role.ADMIN);

                userRepository.save(adminUser);
                System.out.println("✅ Usuário 'admin' inicial criado com sucesso. Senha: admin123");
            }
        };
    }
}
