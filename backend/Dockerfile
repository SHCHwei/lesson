FROM golang:1.23-alpine

RUN apk add --no-cache git gcc musl-dev

WORKDIR /app

ENV PATH="/usr/local/bin:/go/bin:${PATH}"

COPY go.mod go.sum ./
RUN go mod download

# 複製全部程式碼
COPY . .

# ＃EXPOSE 8080

# 預設指令（會被 docker-compose 覆蓋）
CMD ["go", "run", "main.go"]
