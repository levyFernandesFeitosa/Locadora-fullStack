package com.WDA.BookRentalStore.rental.controller;


import com.WDA.BookRentalStore.rental.dto.RentalCreateDto;
import com.WDA.BookRentalStore.rental.dto.RentalDto;
import com.WDA.BookRentalStore.rental.service.RentalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rent") // Rota base correta: /rent
public class RentalController {

    @Autowired
    RentalService service;

    @GetMapping
    public ResponseEntity getAll(){
        return ResponseEntity.ok(service.getAll());
    }
    @GetMapping("/{id}")
    public ResponseEntity getById(@PathVariable Integer id){
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity save (@RequestBody @Validated RentalCreateDto dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity delete (@PathVariable Integer id){
        service.delete(id);
        return ResponseEntity.ok("Rental deleted");
    }

    @PutMapping("/{id}")
    public ResponseEntity update (@PathVariable Integer id, @RequestBody @Validated RentalDto dto){
        return ResponseEntity.ok(service.update(id, dto));
    }

    @PutMapping("/return/{id}")
    public ResponseEntity returnBook(@PathVariable(value = "id") Integer id){
        return ResponseEntity.ok(service.returnBook(id));
    }
}