package com.toy.kafka.Kafka;

import com.toy.kafka.dto.radio.RadioStateDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.kafka.core.KafkaTemplate;

@RequiredArgsConstructor
@Service
public class KafkaProducerService {
    public static final String TOPIC_NAME = "walter";

    private final KafkaTemplate<String, String> kafkaTemplate;

    public void send(String state, Object data){
        try{
            kafkaTemplate.send(state, data.toString());
        } catch (Exception e){
            e.printStackTrace();
        }
    }
}
