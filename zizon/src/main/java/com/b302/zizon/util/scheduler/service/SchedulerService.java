package com.b302.zizon.util.scheduler.service;

import com.b302.zizon.domain.oncast.entity.LiveQueue;
import com.b302.zizon.domain.oncast.repository.LiveQueueRepository;
import com.b302.zizon.domain.oncast.entity.Oncast;
import com.b302.zizon.domain.oncast.repository.OncastRepository;
import com.b302.zizon.domain.user.entity.User;
import com.b302.zizon.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SchedulerService {

    private final OncastRepository oncastRepository;
    private final LiveQueueRepository liveQueueRepository;
    private final UserRepository userRepository;
    private final RedisTemplate<String, String> redisTemplate;

    // 채택하기 라이브큐
    //    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")
    //    @Transactional
    //    public void selectedOncast(){
    //        log.info("라이브큐 채택 스케줄러 동작");
    //        List<Oncast> byOncast = oncastRepository.findByDeleteCheckFalseAndSelectCheckFalseAndShareCheckTrue();
    //        Collections.shuffle(byOncast);
    //        // 공유 상태가 10개를 넘은 경우
    //        if(byOncast.size() > 10){
    //            // 섞고
    //            int count = 0;
    //            for(Oncast oncast : byOncast){
    //                if(count >= 10){
    //                    break;
    //                }
    //                oncast.updateSeletedOncast();
    //                LiveQueue build = LiveQueue.builder()
    //                        .oncast(oncast)
    //                        .user(oncast.getUser())
    //                        .oncastCreateData(oncast.getOncastCreateData())
    //                        .build();
    //                liveQueueRepository.save(build);
    //
    //                count++;
    //            }
    //        }else{
    //            for(Oncast oncast : byOncast){
    //                oncast.updateSeletedOncast();
    //                LiveQueue build = LiveQueue.builder()
    //                        .oncast(oncast)
    //                        .user(oncast.getUser())
    //                        .oncastCreateData(oncast.getOncastCreateData())
    //                        .build();
    //                liveQueueRepository.save(build);
    //            }
    //        }
    //    }

//     라이브큐에 있는 내용 삭제하기
//    @Scheduled(cron = "0 0 23 * * *", zone = "Asia/Seoul")
//    @Transactional
//    public void deleteLiveQueue(){
//        log.info("라이브큐 삭제 스케줄러 동작");
//        List<LiveQueue> byLiveQueue = liveQueueRepository.findAll();
//        for(LiveQueue q : byLiveQueue){
//            liveQueueRepository.delete(q);
//        }
//    }

    // 모든 유저의 온캐스트 생성 여부 false로 초기화
    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")
    @Transactional
    public void resetUserOncastCreate(){
        log.info("유저의 온캐스트 생성 제한 해제");
        List<User> all = userRepository.findAll();
        for(User u : all){
            u.updateCreateCheckReset();
        }
    }

    // 라이브 서버 11시마다 on
    @Scheduled(cron = "0 0 13 * * *", zone = "Asia/Seoul")
    @Transactional
    public void liveServerOn(){
        log.info("라이브 서버 on");
        redisTemplate.opsForValue().set(
                "server-status",
                "true"
        );
    }

    // 라이브 서버 17시마다 off
    @Scheduled(cron = "0 0 21 * * *", zone = "Asia/Seoul")
    @Transactional
    public void liveServerOff(){
        log.info("라이브 서버 off");
        redisTemplate.opsForValue().set(
                "server-status",
                "false"
        );
    }
}
