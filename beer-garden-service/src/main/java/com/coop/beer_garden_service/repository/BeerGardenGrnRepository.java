package com.coop.beer_garden_service.repository;

import com.coop.beer_garden_service.entity.BeerGardenGrn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface BeerGardenGrnRepository extends JpaRepository<BeerGardenGrn, UUID> {
}