FROM openjdk:17

WORKDIR /app

COPY ./websocket-0.0.1-SNAPSHOT.jar .

ENTRYPOINT ["java","-jar","-Dserver.port=8080","websocket-0.0.1-SNAPSHOT.jar"]

