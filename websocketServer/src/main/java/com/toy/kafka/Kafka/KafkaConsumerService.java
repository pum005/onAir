package com.toy.kafka.Kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {

    @KafkaListener(topics = KafkaProducerService.TOPIC_NAME, autoStartup = "true")
    public void consumer(String message){
        System.out.println("receive message : " + message);
    }
}