package com.example.demo.service;

import com.example.demo.dto.TrainDTO;
import com.example.demo.model.Train;
import com.example.demo.repository.TrainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TrainService {

    @Autowired
    private TrainRepository trainRepository;

    private TrainDTO toDto(Train train) {
        TrainDTO dto = new TrainDTO();
        dto.setId(train.getId());
        dto.setTrainNumber(train.getTrainNumber());
        dto.setTrainName(train.getTrainName());
        dto.setOrigin(train.getOrigin());
        dto.setDestination(train.getDestination());
        dto.setDepartureTime(train.getDepartureTime());
        dto.setArrivalTime(train.getArrivalTime());
        dto.setSeatsAvailable(train.getSeatsAvailable());
        dto.setPrice(train.getPrice());
        return dto;
    }

    private Train toEntity(TrainDTO dto) {
        Train train = new Train();
        train.setId(dto.getId());
        train.setTrainNumber(dto.getTrainNumber()); // Add this
        train.setTrainName(dto.getTrainName());
        train.setOrigin(dto.getOrigin());
        train.setDestination(dto.getDestination());
        train.setDepartureTime(dto.getDepartureTime());
        train.setArrivalTime(dto.getArrivalTime()); // Add this
        train.setSeatsAvailable(dto.getSeatsAvailable());
        train.setPrice(dto.getPrice()); // Add this
        return train;
    }
    public TrainDTO addTrain(TrainDTO dto) {
        Train train = toEntity(dto);
        Train saved = trainRepository.save(train);
        return toDto(saved);
    }
    public List<TrainDTO> searchTrains(String from, String to, String date) {
        // Note: The 'date' parameter is currently unused in this logic.
        // This finds trains by matching origin and destination.
        return trainRepository.findByOriginAndDestination(from, to).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<TrainDTO> getAllTrains() {
        return trainRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public TrainDTO getTrainById(Long id) {
        return trainRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Train not found with id: " + id));
    }

    public TrainDTO updateTrain(Long id, TrainDTO dto) {
        Train existing = trainRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Train not found with id: " + id));

        existing.setTrainNumber(dto.getTrainNumber());
        existing.setTrainName(dto.getTrainName());
        existing.setOrigin(dto.getOrigin());
        existing.setDestination(dto.getDestination());
        existing.setDepartureTime(dto.getDepartureTime());
        existing.setArrivalTime(dto.getArrivalTime());
        existing.setSeatsAvailable(dto.getSeatsAvailable());
        existing.setPrice(dto.getPrice());

        return toDto(trainRepository.save(existing));
    }

    public void deleteTrain(Long id) {
        trainRepository.deleteById(id);
    }
}
