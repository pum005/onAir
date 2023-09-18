package com.b302.zizon.domain.oncast.repository;

import com.b302.zizon.domain.oncast.entity.Oncast;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OncastRepository extends JpaRepository<Oncast, Long> {

    List<Oncast> findByUserUserIdAndDeleteCheckFalse(Long userId);

    List<Oncast> findByDeleteCheckFalseAndSelectCheckFalseAndShareCheckTrue();

    Optional<Oncast> findByOncastIdAndUserUserId(Long oncastId, Long userId);
}
