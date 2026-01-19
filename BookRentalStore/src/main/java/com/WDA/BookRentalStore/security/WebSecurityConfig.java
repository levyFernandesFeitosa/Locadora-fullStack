package com.WDA.BookRentalStore.security;

import com.WDA.BookRentalStore.security.filter.SecurityFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
// 🚨 NOVOS IMPORTS NECESSÁRIOS PARA CORS:
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays; // 🚨 NOVO IMPORT

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true)
public class WebSecurityConfig {

    @Autowired
    private SecurityFilter securityFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 🚨 PASSO 2: APLICAR A CONFIGURAÇÃO CORS
                .cors(Customizer.withDefaults())

                .csrf(csrf -> csrf.disable())

                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/users").permitAll()
                        .requestMatchers("/auth/login").permitAll()
                        .requestMatchers("/auth/forgot-password").permitAll()
                        .requestMatchers("/auth/reset-password").permitAll()
                        .requestMatchers(HttpMethod.POST, "/user").permitAll()

                        // Permite requisições OPTIONS (pré-voo do CORS) sem autenticação
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/publishers/**").hasAnyRole("ADMIN", "USER")
                        .requestMatchers(HttpMethod.GET, "/renters/**").hasAnyRole("ADMIN", "USER")
                        .requestMatchers(HttpMethod.GET, "/books/**").hasAnyRole("ADMIN", "USER")
                        .requestMatchers(HttpMethod.GET, "/rentals/**").hasAnyRole("ADMIN", "USER")
                        .requestMatchers(HttpMethod.GET, "/users/**").hasAnyRole("ADMIN", "USER")

                        .requestMatchers("/publishers/**").hasRole("ADMIN")
                        .requestMatchers("/renters/**").hasRole("ADMIN")
                        .requestMatchers("/books/**").hasRole("ADMIN")
                        .requestMatchers("/rentals/**").hasRole("ADMIN")
                        .requestMatchers("/users/**").hasRole("ADMIN")

                        .anyRequest().authenticated())
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(Arrays.asList("http://localhost:9000"));

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}