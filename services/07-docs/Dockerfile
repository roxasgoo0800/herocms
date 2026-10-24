# ==============================================================================
# Stage 1: Build Vue 3 + TypeScript Frontend SPA (Node.js 26 Patched CVE-2026-48930)
# ==============================================================================
FROM node:26-alpine AS frontend-builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ==============================================================================
# Stage 2: Compile Native Go Backend BFF & Static Server (Go 1.22+, Zero Nginx)
# ==============================================================================
FROM golang:alpine AS backend-builder
WORKDIR /app

ENV GOTOOLCHAIN=local \
    CGO_ENABLED=0

RUN apk add --no-cache git ca-certificates

COPY go.mod ./
COPY cmd/ ./cmd/
COPY internal/ ./internal/
RUN GOOS=linux go build -ldflags="-s -w" -o docs-server ./cmd/server/main.go

# ==============================================================================
# Stage 3: Ultra-Lightweight Production Runtime (Pure Alpine, No Nginx)
# ==============================================================================
FROM alpine:3.20
WORKDIR /app

RUN apk --no-cache add ca-certificates tzdata

COPY --from=backend-builder /app/docs-server /app/docs-server
COPY --from=frontend-builder /app/dist /app/dist

ENV PORT=8087 \
    DIST_DIR=/app/dist

EXPOSE 8087

CMD ["/app/docs-server"]
