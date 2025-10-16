package com.example.demo.controller;

import com.example.demo.dto.TrainDTO;
import com.example.demo.service.TrainService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trains")
@CrossOrigin
@RequiredArgsConstructor
public class TrainController {

    private final TrainService trainService;

    @GetMapping
    public ResponseEntity<List<TrainDTO>> getAllTrains() {
        return ResponseEntity.ok(trainService.getAllTrains());
    }

    @GetMapping("/search")
    public ResponseEntity<List<TrainDTO>> searchTrains(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam String date) {
        return ResponseEntity.ok(trainService.searchTrains(from, to, date));
    }

    // --- THIS IS THE CORRECTED, NON-CONFLICTING PATH ---
    @GetMapping("/details/{id}")
    public ResponseEntity<TrainDTO> getTrainById(@PathVariable Long id) {
        return ResponseEntity.ok(trainService.getTrainById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TrainDTO> addTrain(@Valid @RequestBody TrainDTO trainDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(trainService.addTrain(trainDTO));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TrainDTO> updateTrain(@PathVariable Long id,
                                                @Valid @RequestBody TrainDTO trainDTO) {
        return ResponseEntity.ok(trainService.updateTrain(id, trainDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTrain(@PathVariable Long id) {
        trainService.deleteTrain(id);
        return ResponseEntity.noContent().build();
    }
}