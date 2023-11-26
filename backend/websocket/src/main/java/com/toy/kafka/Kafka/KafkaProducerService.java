package com.toy.kafka.Kafka;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.kafka.core.KafkaTemplate;

@RequiredArgsConstructor
@Service
public class KafkaProducerService {
    public static final String TOPIC_NAME = "walter";

    private final KafkaTemplate<String, String> kafkaTemplate;

    public void send(String state, String data){
        try{
            kafkaTemplate.send(state, data);
        } catch (Exception e){
            e.printStackTrace();
        }
    }
}
