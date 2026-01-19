package com.WDA.BookRentalStore.security.filter;

import com.WDA.BookRentalStore.security.service.TokenService;
import com.WDA.BookRentalStore.user.model.User;
import com.WDA.BookRentalStore.user.repositories.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    TokenService tokenService;

    @Autowired
    UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException{
        String token = this.recoverToken(request);
        String requestURI = request.getRequestURI(); 

        // 1. IGNORAR ROTAS PÚBLICAS (LOGIN E CADASTRO)
        // O filtro é encerrado aqui para que o Spring Security lide com a rota de forma anônima.
        // A rota GET /api/user DEVE passar por este filtro para ter o token validado.
        
        // Inclui /auth/login e /api/auth/login em qualquer método.
        // Inclui /user e /api/user APENAS se for POST (cadastro).
        if (requestURI.contains("/auth/login") || 
            (requestURI.equals("/user") && request.getMethod().equals("POST")) ||
            (requestURI.equals("/api/user") && request.getMethod().equals("POST")) ) {
            
            filterChain.doFilter(request, response);
            return;
        }

        // 2. VALIDAR TOKEN PARA ROTAS PROTEGIDAS (inclui GET /api/user)
        if (token != null){
            try {
                String login = tokenService.validateToken(token); // Valida e retorna o e-mail

                // Se o token for válido e não estiver vazio
                if (login != null && !login.isEmpty()) { 
                    Optional<User> userOptional = userRepository.findByUserEmail(login);

                    if (userOptional.isPresent()){
                        UserDetails user = userOptional.get();

                        // Seta o usuário no contexto de segurança (Autentica a requisição)
                        var authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }
            } catch (Exception e) {
                // Em caso de exceção de validação (token expirado, etc.), 
                // apenas ignoramos a autenticação para que o 403 seja retornado
                // (ou 401, dependendo do handler do Spring Security).
                System.out.println("Falha na validação do token: " + e.getMessage());
            }
        }
        
        // Continua para o próximo filtro (onde a autorização do Spring verifica a ROLE)
        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null) return null;
        return authHeader.replace("Bearer ", "");
    }
}