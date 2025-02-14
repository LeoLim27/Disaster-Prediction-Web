package com.kcu.disaster.repository;

import com.kcu.disaster.Entity.Disaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DisasterRepository extends JpaRepository<Disaster, Long> {

}
