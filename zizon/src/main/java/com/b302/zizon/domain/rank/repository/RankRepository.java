package com.b302.zizon.domain.rank.repository;

import com.b302.zizon.domain.rank.entity.UserRank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RankRepository extends JpaRepository<UserRank, Long> {

    Optional<UserRank> findByUserUserId(Long userId);
}
