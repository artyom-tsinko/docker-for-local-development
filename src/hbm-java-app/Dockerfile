# Build
FROM docker.io/maven:3.9.6-amazoncorretto-21 AS build
COPY src /home/app/src
COPY pom.xml /home/app
RUN mvn -f /home/app/pom.xml clean package

# Run
FROM docker.io/amazoncorretto:21-alpine
COPY --from=build /home/app/target/hbm-java-app-0.0.1-SNAPSHOT.jar /usr/local/lib/hbm-java-app-0.0.1-SNAPSHOT.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/usr/local/lib/hbm-java-app-0.0.1-SNAPSHOT.jar"]
