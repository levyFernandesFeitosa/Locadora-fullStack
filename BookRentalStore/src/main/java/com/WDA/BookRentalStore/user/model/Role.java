package com.WDA.BookRentalStore.user.model;


import org.springframework.security.core.GrantedAuthority;

public enum Role implements GrantedAuthority {
    ADMIN,
    USER;

    @Override
    public String getAuthority(){
        return "ROLE_" + this.name();
    }
}
