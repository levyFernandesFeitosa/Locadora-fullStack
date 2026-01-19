package com.WDA.BookRentalStore.renter.controller;

import com.WDA.BookRentalStore.renter.dto.RenterDto;
import com.WDA.BookRentalStore.renter.service.RenterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/renter")
public class RenterController {

    @Autowired
    RenterService service;

    @GetMapping
    public ResponseEntity getAll(){
        return ResponseEntity.ok(service.getAll());
    }
    @GetMapping("/{id}")
    public ResponseEntity getById(@PathVariable Integer id){
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity save (@RequestBody RenterDto dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity delete (@PathVariable @Validated Integer id){
        service.delete(id);
        return ResponseEntity.ok("Renter deleted");
    }

    @PutMapping("/{id}")
    public ResponseEntity update (@PathVariable Integer id, @RequestBody @Validated RenterDto dto){
        return ResponseEntity.ok(service.update(id, dto));
    }

}
