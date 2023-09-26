package com.b302.zizon.domain.oncast.repository;

import com.b302.zizon.domain.oncast.entity.LiveQueue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LiveQueueRepository extends JpaRepository<LiveQueue, Long> {
}
