package com.b302.zizon.domain.user.repository;

import com.b302.zizon.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailAndAccountType(String email, String provider);

    Optional<User> findByUserNo(Long userNo);

    Optional<User> findByPrivateAccess(String access);

    boolean existsByNickname(String nickname);
}
