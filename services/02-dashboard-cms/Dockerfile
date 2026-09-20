# ==============================================================================
# Stage 1: Build Vue 3 + TypeScript Frontend SPA
# ==============================================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ==============================================================================
# Stage 2: Compile Native Go Backend BFF & Static Server (Latest Golang, Zero Nginx)
# ==============================================================================
FROM golang:alpine AS backend-builder
WORKDIR /app

ENV GOTOOLCHAIN=local \
    CGO_ENABLED=0

RUN apk add --no-cache git ca-certificates

COPY go.mod go.sum ./
RUN go mod download

COPY cmd/ ./cmd/
COPY internal/ ./internal/
RUN GOOS=linux go build -ldflags="-s -w" -o dashboard-cms-server ./cmd/server/main.go

# ==============================================================================
# Stage 3: Ultra-Lightweight Production Runtime (Pure Alpine, No Nginx)
# ==============================================================================
FROM alpine:3.20
WORKDIR /app

RUN apk --no-cache add ca-certificates tzdata

COPY --from=backend-builder /app/dashboard-cms-server /app/dashboard-cms-server
COPY --from=frontend-builder /app/dist /app/dist

ENV PORT=8085 \
    DIST_DIR=/app/dist \
    GIN_MODE=release

EXPOSE 8085

CMD ["/app/dashboard-cms-server"]
