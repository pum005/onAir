package com.toy.kafka.domain.live.repository;

import com.toy.kafka.domain.live.entity.LiveQueue;
import com.toy.kafka.domain.oncast.entity.Oncast;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LiveQueueRepository extends JpaRepository<LiveQueue, Long> {

//    @Query("select l from LiveQueue l join fetch l.oncast o order by l.liveQueueId limit 1")
//    LiveQueue findTop1ByOncastOncastIdAndOrderByLiveQueueId(Long oncastId);
//      List<LiveQueue> findTop1ByOncastOrderByLiveQueueId(Long oncastId);

      @Query("select l from LiveQueue l join fetch l.oncast o where l.readCheck = false order by l.liveQueueId")
      List<LiveQueue> findLiveQueue(Pageable pageable);

}


