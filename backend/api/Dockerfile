FROM openjdk:17

WORKDIR /app

COPY ./zizon-0.0.1-SNAPSHOT.jar .

ENTRYPOINT ["java","-jar","-Dserver.port=8080","zizon-0.0.1-SNAPSHOT.jar"]
