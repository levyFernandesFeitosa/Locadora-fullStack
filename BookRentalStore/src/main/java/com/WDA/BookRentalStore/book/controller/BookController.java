package com.WDA.BookRentalStore.book.controller;


import com.WDA.BookRentalStore.book.dto.BookDto;
import com.WDA.BookRentalStore.book.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/book")
public class BookController {

    @Autowired
    BookService service;

    @GetMapping
    public ResponseEntity getAll(){
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity getById(@PathVariable Integer id){
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity save (@RequestBody @Validated BookDto dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity delete (@PathVariable(value = "id") Integer id){
        service.delete(id);
        return ResponseEntity.ok("Book deleted");
    }

    @PutMapping("/{id}")
    public ResponseEntity update (@PathVariable(value = "id") Integer id, @RequestBody @Validated BookDto dto){
        return ResponseEntity.ok(service.update(id, dto));
    }
}
