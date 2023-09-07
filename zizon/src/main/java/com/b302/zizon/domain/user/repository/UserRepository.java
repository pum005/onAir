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

    //Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.email = :email AND u.accountType = 'ORIGIN'")
    Optional<User> findByOriginEmail(@Param("email") String email);


    @Query("SELECT u FROM User u WHERE u.email = :email AND u.accountType = 'KAKAO'")
    Optional<User> findByKakaoEmail(@Param("email")String email);

    Optional<User> findByUserPw(String userPw);

    @Query("SELECT u FROM User u WHERE u.nickname LIKE %:nickname% AND u.userNo != :userNo") // 나는 빼고 검색
    List<User> findByNicknameContainingAndUserNoNot(@Param("nickname") String nickname, @Param("userNo") Long userNo);

    Optional<User> findByUserNo(Long userNo);

    @Query("SELECT u.nickname FROM User u WHERE u.userNo = :userNo")
    String findUserNicknameByUserNo(@Param("userNo") Long userNo);
}
