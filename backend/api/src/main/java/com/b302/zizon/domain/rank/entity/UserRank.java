package com.b302.zizon.domain.rank.entity;


import com.b302.zizon.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Entity
@Getter
@ToString
@EntityListeners(AuditingEntityListener.class)
public class UserRank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userRankId;
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
    private Long record;

    public UserRank() {
    }

    @Builder
    public UserRank(Long userRankId, User user, Long record) {
        this.userRankId = userRankId;
        this.user = user;
        this.record = record;
    }

    public void updateRecord(Long record) {
        this.record = record;
    }
}
