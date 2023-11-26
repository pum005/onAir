package com.b302.zizon.domain.rank.service;

import com.b302.zizon.domain.rank.dto.RankRequestDTO;
import com.b302.zizon.domain.rank.dto.RankResponseDTO;
import com.b302.zizon.domain.rank.entity.UserRank;
import com.b302.zizon.domain.rank.repository.RankRepository;
import com.b302.zizon.domain.user.GetUser;
import com.b302.zizon.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class RankService {

    private final GetUser getUser;
    private final RankRepository rankRepository;


    // 랭크 저장
    @Transactional
    public Map<String, Object> saveRank(RankRequestDTO requestDTO){
        log.info(requestDTO.toString());

        User user = getUser.getUser();

        Optional<UserRank> byUserUserId = rankRepository.findByUserUserId(user.getUserId());

        if(byUserUserId.isEmpty()){
            UserRank build = UserRank.builder()
                    .record(requestDTO.getRecord())
                    .user(user)
                    .build();

            rankRepository.save(build);
        }else{
            UserRank userRank = byUserUserId.get();

            if(userRank.getRecord() < requestDTO.getRecord()){
                userRank.updateRecord(requestDTO.getRecord());
            }
        }

        Map<String, Object> result = new HashMap<>();
        log.info("랭크 저장됨");

        result.put("message", "랭크 저장 성공");
        return result;
    }

     //기록 가져오기
    public List<RankResponseDTO> getRanking(){
        User user = getUser.getUser();

        List<UserRank> top10ByRecord = rankRepository.findTop10ByOrderByRecordDesc();

        List<RankResponseDTO> responseDTOList = new ArrayList<>();
        int count = 1;

        for(UserRank u : top10ByRecord){
            RankResponseDTO dto = new RankResponseDTO();
            dto.setIndex(count++);
            dto.setNickname(u.getUser().getNickname());
            dto.setProfileImage(u.getUser().getProfileImage());
            dto.setRecord(u.getRecord());

            responseDTOList.add(dto);
        }

        return responseDTOList;

    }
}
