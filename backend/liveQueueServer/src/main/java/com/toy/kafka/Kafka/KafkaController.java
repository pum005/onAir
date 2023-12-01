package com.toy.kafka.Kafka;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

//@RequiredArgsConstructor
//@RestController
//public class KafkaController {
//
//    private final KafkaProducerService producerService;
//
//    private final KafkaConsumerService consumerService;
//
//    @GetMapping("/send/{message}")
//    public void sendMessage(@PathVariable("message") String message){
//        producerService.send(message);
//    }
//}
//    public static void main(String[] args) throws IOException {
//        Properties configs = new Properties();
//        configs.put("bootstrap.servers", "43.202.61.126:9092");
//        configs.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
//        configs.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");
//
//        KafkaProducer<String, String> producer = new KafkaProducer<String, String>(configs);
//
//        ProducerRecord record = new ProducerRecord<String, String>("test_logs", "login");
//
//        producer.send(record);
//
//        producer.close();

//        kafkaService.sendMessage("hello");
//    }

