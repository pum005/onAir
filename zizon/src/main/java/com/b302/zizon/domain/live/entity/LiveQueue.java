package com.b302.zizon.domain.live.entity;

import com.b302.zizon.domain.oncast.entity.Oncast;
import com.b302.zizon.domain.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Entity
@Getter
@ToString
@EntityListeners(AuditingEntityListener.class)
@Builder
@AllArgsConstructor
public class LiveQueue {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long liveQueueId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "oncast_id")
    private Oncast oncast;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public LiveQueue() {
    }
}
