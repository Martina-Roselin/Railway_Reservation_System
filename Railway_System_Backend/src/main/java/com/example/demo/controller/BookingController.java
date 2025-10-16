package com.example.demo.controller;
import com.example.demo.dto.BookingRequestDTO;
import com.example.demo.model.Booking;
import com.example.demo.service.BookingService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<Booking> bookTicket(@Valid @RequestBody BookingRequestDTO request, Authentication auth) {
        String username = auth.getName();
        Booking saved = bookingService.bookTicket(
            request.getBookingDetails(),
            request.getSeatNumbers(),
            username
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancelTicket(@PathVariable Long id, Authentication auth) {
        String username = auth.getName();
        boolean isAdmin = auth.getAuthorities().stream()
                              .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        Booking canceled = bookingService.cancelTicket(id, username, isAdmin);
        return ResponseEntity.ok(canceled);
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getMyBookings(Authentication auth) {
        return ResponseEntity.ok(
                bookingService.getActiveBookingsForUsername(auth.getName())
        );
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Booking>> getAllBookingsForAdmin() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/{id}/ticket")
    public ResponseEntity<Resource> downloadTicket(@PathVariable Long id)
            throws FileNotFoundException {

        File file = new File("Ticket_" + id + ".pdf");
        if (!file.exists()) return ResponseEntity.notFound().build();

        Resource res = new FileSystemResource(file);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=" + file.getName())
                .body(res);
    }
}