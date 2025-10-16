package com.example.demo.repository;
import com.example.demo.model.Train;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainRepository extends JpaRepository<Train, Long> {
    // You can add custom queries if needed
	List<Train> findByOriginAndDestination(String origin, String destination);
}


