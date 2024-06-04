FROM golang:1.21.1 AS build

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download
RUN go install github.com/pressly/goose/v3/cmd/goose@latest
RUN go install github.com/google/wire/cmd/wire@latest

COPY . .

RUN go build -o main ./cmd/api/main.go

EXPOSE 42069

CMD ["./main"]
