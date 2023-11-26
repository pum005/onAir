package com.toy.kafka.domain.live.entity;

import com.toy.kafka.domain.oncast.entity.Oncast;
import com.toy.kafka.domain.oncast.entity.OncastCreateData;
import com.toy.kafka.domain.user.entity.User;
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
    @JoinColumn(name = "oncast_create_data_id")
    private OncastCreateData oncastCreateData;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private boolean readCheck;

    public LiveQueue() {
    }

    public void updateReadCheck() {
        this.readCheck = true;
    }
}
