package com.example.demo.service;

import com.example.demo.model.BookedSeat;
import com.example.demo.model.Booking;
import com.example.demo.model.Train;
import com.example.demo.model.User;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.TrainRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepo;
    @Autowired
    private TrainRepository trainRepo;
    @Autowired
    private UserRepository userRepo;

    // --- THIS IS THE CORRECTED METHOD ---
    public Booking bookTicket(Booking bookingRequest, List<String> seatNumbers, String username) {
        // Fetch User and Train
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Train train = trainRepo.findById(bookingRequest.getTrain().getId())
                .orElseThrow(() -> new RuntimeException("Train not found"));

        // --- NEW, EFFICIENT CHECK ---
        // This one query checks all seats at once for any active bookings on that day.
        boolean seatsAreAlreadyBooked = bookingRepo.existsActiveBookingForSeatsOnDate(
            train, seatNumbers, bookingRequest.getBookingDate()
        );
        if (seatsAreAlreadyBooked) {
            throw new IllegalStateException("One or more of the selected seats are already booked for this date!");
        }
        // --- END OF NEW CHECK ---

        // Create the main booking record
        Booking newBooking = new Booking();
        newBooking.setUser(user);
        newBooking.setTrain(train);
        newBooking.setPassengerName(bookingRequest.getPassengerName());
        newBooking.setEmail(bookingRequest.getEmail());
        newBooking.setBookingDate(bookingRequest.getBookingDate());
        newBooking.setCanceled(false);
        newBooking.setPaid(false);

        // Create and add each BookedSeat to the booking
        for (String seatNumber : seatNumbers) {
            newBooking.getSeats().add(new BookedSeat(seatNumber, newBooking));
        }

        return bookingRepo.save(newBooking);
    }
    
    public Booking cancelTicket(Long id, String requester, boolean isAdmin) {
        Booking booking = bookingRepo.findByIdAndCanceledFalse(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found or already canceled"));

        if (!isAdmin && !booking.getUser().getUsername().equals(requester)) {
            throw new IllegalStateException("You do not own this booking");
        }

        booking.setCanceled(true);
        return bookingRepo.save(booking);
    }

    public List<Booking> getActiveBookingsForUsername(String username) {
        return bookingRepo.findByUserUsernameAndCanceledFalse(username);
    }

    public List<Booking> getAllBookings() {
        return bookingRepo.findAll();
    }
}