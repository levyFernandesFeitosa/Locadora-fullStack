FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copia arquivos de configuração e baixa dependências (cache)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copia o código fonte e gera o JAR
COPY src ./src
RUN mvn package -DskipTests

# Estágio 2: Run (Execução)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copia o JAR gerado no estágio anterior
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENV API_PORT=8080

CMD ["java", "-jar", "app.jar"]