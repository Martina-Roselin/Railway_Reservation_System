package com.example.demo.model;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;
import java.util.ArrayList;
import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder


public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column
    private boolean paid;
    public boolean isPaid() {
        return paid;
    }

    public void setPaid(boolean paid) {
        this.paid = paid;
    }

    @Column
    private String email;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
 
    @ManyToOne
    @JoinColumn(name = "train_id", nullable = false)
    private Train train;
    
    
    @Column(nullable = false)
    private boolean canceled = false;
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookedSeat> seats = new ArrayList<>();

    public boolean isCanceled() { return canceled; }
    public void setCanceled(boolean canceled) { this.canceled = canceled; }
    private String passengerName;
        private LocalDateTime bookingDate;
      

   

  
}


