package com.toy.kafka.Kafka;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.springframework.kafka.annotation.KafkaListener;

import java.io.IOException;
import java.util.Arrays;
import java.util.Properties;
import java.time.Duration;

public class Consumer {

    @KafkaListener(topics = "TOPIC", groupId = "test")
    public void consume(String message) throws IOException {
        System.out.println("스트링 : " + String.format("Consumed message : %s", message));
    }

    public static void main(String[] args) throws IOException {
        System.out.println(1);
        Properties configs = new Properties();
        configs.put("bootstrap.servers", "43.202.61.126:9092");
        configs.put("group.id", "click_log_group");
        configs.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeSerializer");
        configs.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeSerializer");

        KafkaConsumer<String, String> consumer = new KafkaConsumer<String, String>(configs);

//        consumer.subscribe(Arrays.asList("test_logs"));
//
//        Duration duration = Duration.ofSeconds(5);

//        while(true) {
//            ConsumerRecords<String, String> records = consumer.poll(duration);
//            for (ConsumerRecord<String, String> record : records) {
//                System.out.println(record.value());
//            }
//        }
    }
}
