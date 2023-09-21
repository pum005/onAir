package com.toy.kafka.domain.oncast.repository;

import com.toy.kafka.domain.oncast.entity.OncastCreateData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OncastCreateDataRepository extends JpaRepository<OncastCreateData, Long> {

}
