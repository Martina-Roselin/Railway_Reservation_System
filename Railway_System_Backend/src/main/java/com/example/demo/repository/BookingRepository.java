package com.example.demo.repository;

import com.example.demo.model.Booking;
import com.example.demo.model.Train;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // --- DELETE the old existsBy... method and REPLACE it with this one ---
    @Query("SELECT COUNT(s) > 0 FROM Booking b JOIN b.seats s WHERE b.train = :train AND b.canceled = false AND s.seatNumber IN :seatNumbers AND FUNCTION('DATE', b.bookingDate) = FUNCTION('DATE', :bookingDate)")
    boolean existsActiveBookingForSeatsOnDate(
            @Param("train") Train train,
            @Param("seatNumbers") List<String> seatNumbers,
            @Param("bookingDate") LocalDateTime bookingDate
    );

    /* --- Queries that ignore the canceled bookings --- */
    List<Booking> findByUserUsernameAndCanceledFalse(String username);
    List<Booking> findByUser_IdAndCanceledFalse(Long userId);
    Optional<Booking> findByIdAndCanceledFalse(Long id);

    /* --- Convenience methods that include ALL bookings --- */
    List<Booking> findByUserUsername(String username);
    List<Booking> findByUser_Id(Long userId);
}