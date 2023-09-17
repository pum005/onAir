package com.b302.zizon.domain.live.repository;

import com.b302.zizon.domain.live.entity.LiveQueue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LiveQueueRepository extends JpaRepository<LiveQueue, Long> {
}
