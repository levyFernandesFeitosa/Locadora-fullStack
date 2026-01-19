package com.WDA.BookRentalStore.user.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity(name = "userEntity")
@Table(name = "\"user\"")
@Getter // Adicionado pelo Lombok
@Setter // Adicionado pelo Lombok
@NoArgsConstructor
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(unique = true, nullable = false)
    private String userName;

    @Column(unique = true, nullable = false)
    private String userEmail;

    @Column(name = "user_password")
    private String userPassword;

    // A anotação @JdbcTypeCode(SqlTypes.NAMED_ENUM) é mantida
    // pois é necessária para o Hibernate 6 mapear corretamente Enums no PostgreSQL.
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    private Role role;

    // Construtor completo (útil para testes ou serviços)
    public User(Integer id, String userName, String userEmail, String userPassword, Role role){
        this.id = id;
        this.userName = userName;
        this.userEmail= userEmail;
        this.userPassword= userPassword;
        this.role = role;
    }

    // --- Implementação da Interface UserDetails ---

    /**
     * Retorna a lista de permissões do usuário.
     * Como a classe Role implementa GrantedAuthority e adiciona o prefixo "ROLE_",
     * basta retornar a instância do Enum.
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Agora, this.role é um GrantedAuthority válido que retorna "ROLE_ADMIN" ou "ROLE_USER".
        return List.of(this.role);
    }

    /**
     * Retorna o que é usado como senha para autenticação (o hash BCrypt).
     */
    @Override
    public String getPassword() {
        return this.userPassword;
    }

    /**
     * Retorna o que é usado para identificação/login (o e-mail, no seu caso).
     */
    @Override
    public String getUsername() {
        return this.userEmail;
    }

    // --- Métodos de Status da Conta (Mantidos como true) ---

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
    
    // --- Getters auxiliares para outros serviços (redundantes com Lombok @Getter, mas mantidos se houver necessidade) ---

    public Integer getId() {
        return this.id;
    }

    public String getUserName() {
        return this.userName;
    }

    public String getUserEmail() {
        return this.userEmail;
    }

    public Role getUserRole() {
        return this.role;
    }
}