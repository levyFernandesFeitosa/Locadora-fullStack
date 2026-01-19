package com.WDA.BookRentalStore.dashboard.controller;

import com.WDA.BookRentalStore.dashboard.dto.BookMoreRentedDTO;
import com.WDA.BookRentalStore.dashboard.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService){
        this.dashboardService = dashboardService;
    }

    @GetMapping("/bookMoreRented")
    public ResponseEntity<List<BookMoreRentedDTO>> getBookMoreRented(@RequestParam Integer numberOfMonths){
        List<BookMoreRentedDTO> result = dashboardService.findBookMoreRented(numberOfMonths);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/rentsLateQuantity")
    public ResponseEntity<Long> getRentsLateQuantity(@RequestParam Integer numberOfMonths) {
        Long result = dashboardService.findRentsLateQuantity(numberOfMonths);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/rentsPerRenter")
    public ResponseEntity<?> getRentsPerRenter(@RequestParam Integer numberOfMonths) {
        return ResponseEntity.ok(dashboardService.findRentsPerRenter(numberOfMonths));
    }

    @GetMapping("/deliveredWithDelayQuantity")
    public ResponseEntity<Long> getDeliveredWithDelayQuantity(@RequestParam Integer numberOfMonths) {
        return ResponseEntity.ok(dashboardService.findDeliveredWithDelayQuantity(numberOfMonths));
    }

    @GetMapping("/deliveredInTimeQuantity")
    public ResponseEntity<Long> getDeliveredInTimeQuantity(@RequestParam Integer numberOfMonths) {
        return ResponseEntity.ok(dashboardService.findDeliveredInTimeQuantity(numberOfMonths));
    }
}