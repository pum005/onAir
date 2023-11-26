package com.b302.zizon.domain.oncast.repository;

import com.b302.zizon.domain.oncast.entity.OncastCreateData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OncastCreateDataRepository extends JpaRepository<OncastCreateData, Long> {

}
