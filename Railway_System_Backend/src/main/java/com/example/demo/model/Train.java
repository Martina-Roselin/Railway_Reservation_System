package com.example.demo.model;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Train {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;
     private long trainNumber;
	 private String trainName;
	    private String origin;
	    private String destination;
	    private LocalTime arrivalTime;
	    private LocalTime departureTime;
	    private long seatsAvailable;
	    private long price;
}
