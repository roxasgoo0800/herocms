# ==============================================================================
# Stage 1: Build React/Vite Marketing Site Frontend
# ==============================================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ==============================================================================
# Stage 2: Compile Native Go Static Host (Zero Nginx, Production Ready)
# ==============================================================================
FROM golang:1.23-alpine AS backend-builder
WORKDIR /app
COPY server.go ./
RUN go mod init marketing-server && \
    CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o marketing-server server.go

# ==============================================================================
# Stage 3: Minimalist Production Runner
# ==============================================================================
FROM alpine:3.20
WORKDIR /app

RUN apk --no-cache add ca-certificates tzdata

COPY --from=backend-builder /app/marketing-server /app/marketing-server
COPY --from=frontend-builder /app/dist /app/dist

ENV PORT=8084 \
    DIST_DIR=/app/dist

EXPOSE 8084

CMD ["/app/marketing-server"]
