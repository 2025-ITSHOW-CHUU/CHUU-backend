# 1단계: 빌드
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# 2단계: 실제 런타임
FROM node:20-alpine
WORKDIR /app

# 빌드된 파일만 복사
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# 프로덕션 의존성만 설치
RUN npm install --omit=dev

# 실행
CMD ["node", "dist/src/main"]
