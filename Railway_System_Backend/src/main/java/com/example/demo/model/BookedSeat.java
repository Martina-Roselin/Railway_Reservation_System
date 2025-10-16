package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"booking_id", "seatNumber"})) 
@Data
@NoArgsConstructor
public class BookedSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String seatNumber;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    @JsonIgnore // Prevents infinite loops in JSON response
    private Booking booking;

    public BookedSeat(String seatNumber, Booking booking) {
        this.seatNumber = seatNumber;
        this.booking = booking;
    }
}