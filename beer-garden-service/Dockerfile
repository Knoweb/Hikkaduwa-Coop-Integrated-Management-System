# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy the pom.xml and download dependencies (caches them for faster subsequent builds)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code and build the JAR
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create the production image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy ONLY the built JAR file from the previous stage
COPY --from=build /app/target/*.jar app.jar

# Expose the standard Spring Boot port (Gateway and Discovery might differ, but Docker Compose handles mapping)
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]