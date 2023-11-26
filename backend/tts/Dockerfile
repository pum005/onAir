FROM openjdk:17

WORKDIR /app

COPY ./tts-0.0.1-SNAPSHOT.jar .

ENTRYPOINT ["java","-jar","-Dserver.port=8081","tts-0.0.1-SNAPSHOT.jar"]

