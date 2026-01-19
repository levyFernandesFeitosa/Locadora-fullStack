package com.WDA.BookRentalStore.user.controller;

import com.WDA.BookRentalStore.user.dto.UserDto;
import com.WDA.BookRentalStore.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserService service;

    @GetMapping
    public ResponseEntity getAll(){
        return ResponseEntity.ok(service.getAll());
    }
    @GetMapping("/{id}")
    public ResponseEntity getById(@PathVariable Integer id){
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity save (@RequestBody @Validated UserDto dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity delete (@PathVariable Integer id){
        service.delete(id);
        return ResponseEntity.ok("User deleted");
    }

    @PutMapping("/{id}")
    public ResponseEntity update (@PathVariable @Validated Integer id, @RequestBody UserDto dto){
        return ResponseEntity.ok(service.update(id, dto));
    }
}
