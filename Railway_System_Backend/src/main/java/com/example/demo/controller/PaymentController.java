package com.example.demo.controller;

import com.example.demo.model.Booking;
import com.example.demo.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.io.FileNotFoundException;
import jakarta.mail.MessagingException;
import java.io.IOException;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/simulate")
    public Booking simulatePayment(@RequestParam Long bookingId) throws IOException,FileNotFoundException, MessagingException {
        return paymentService.simulatePayment(bookingId);
    }
}
