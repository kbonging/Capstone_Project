### 개발환경 세팅 ###

# frontend/Dockerfile
FROM node:18

# 작업 디렉토리
WORKDIR /app

# 종속성 설치를 위해 package.json만 복사
COPY package*.json ./

RUN npm install

# 전체 프로젝트 복사
COPY . .

# Vite 개발 서버 실행
CMD ["npm", "run", "dev"]
