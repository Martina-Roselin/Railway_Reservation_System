package com.example.demo.dto;
import com.example.demo.model.Booking;
import lombok.Data;
import java.util.List;

@Data
public class BookingRequestDTO {
    private Booking bookingDetails;
    private List<String> seatNumbers;
}