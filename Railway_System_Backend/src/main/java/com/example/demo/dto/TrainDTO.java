package com.example.demo.dto;

import lombok.Data;

import java.time.LocalTime;
@Data
public class TrainDTO {
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
