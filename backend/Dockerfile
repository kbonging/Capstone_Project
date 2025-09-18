FROM openjdk:17-slim

# gradle wrapper 실행을 위한 권한 부여
RUN apt-get update && apt-get install -y dos2unix

# 작업 디렉토리 설정
WORKDIR /app

# gradlew 실행 권한
COPY gradlew /app/
COPY gradle /app/gradle
RUN dos2unix gradlew && chmod +x gradlew

# 종속성만 미리 복사해서 캐싱 (옵션)
COPY build.gradle settings.gradle /app/

RUN ./gradlew dependencies

# 전체 소스코드는 실행 시점에 마운트할 예정
CMD ["./gradlew", "bootRun"]
