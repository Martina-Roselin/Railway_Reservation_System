package com.example.demo.service;

import com.example.demo.model.Booking;
import com.example.demo.repository.BookingRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.io.FileNotFoundException;

@Service
public class PaymentService {

    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private PdfGeneratorService pdfService;
    @Autowired
    private EmailService emailService;

    public Booking simulatePayment(Long bookingId) 
            throws IOException,FileNotFoundException, MessagingException {
        
        // Find the booking that needs to be paid for
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        // Mark the booking as paid and save it
        booking.setPaid(true);
        Booking savedBooking = bookingRepository.save(booking);

        // --- TICKET GENERATION LOGIC IS NOW HERE ---
        String pdfPath = pdfService.generateBookingTicket(savedBooking);
        emailService.sendBookingEmail(
                savedBooking.getEmail(),
                "Your Railway Reservation Ticket",
                "Payment successful! Please find your ticket attached.",
                pdfPath
        );

        return savedBooking;
    }
}