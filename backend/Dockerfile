FROM golang:1.23-alpine

RUN apk add --no-cache git gcc musl-dev

WORKDIR /app

ENV PATH="/usr/local/bin:/go/bin:${PATH}"

COPY go.mod go.sum ./
RUN go mod download

#RUN GOBIN=/usr/local/bin go install github.com/air-verse/air@1.52

# 安裝 air
RUN go install github.com/air-verse/air@v1.52

# 複製全部程式碼
COPY . .

EXPOSE 8080

CMD ["air", "-c", ".air.toml"]
