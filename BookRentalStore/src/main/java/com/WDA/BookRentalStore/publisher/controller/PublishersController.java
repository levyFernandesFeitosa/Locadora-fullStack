package com.WDA.BookRentalStore.publisher.controller;

import com.WDA.BookRentalStore.publisher.dto.PublishersDto;
import com.WDA.BookRentalStore.publisher.service.PublishersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/publisher") // ⬅️ CORRIGIDO: Rota ajustada para /publisher
public class PublishersController {

    @Autowired
    PublishersService service;

    @GetMapping
    public ResponseEntity getAll(){
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity getById(@PathVariable Integer id){
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity save (@RequestBody @Validated PublishersDto dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity delete (@PathVariable(value = "id") Integer id){
        service.delete(id);
        return ResponseEntity.ok("Publisher deleted");
    }

    @PutMapping("/{id}")
    public ResponseEntity update (@PathVariable(value = "id") Integer id, @RequestBody @Validated PublishersDto dto){
        return ResponseEntity.ok(service.update(id, dto));
    }
}