FROM golang:1.21.1-alpine AS build

WORKDIR /app

RUN go install github.com/pressly/goose/v3/cmd/goose@latest && \
go install github.com/google/wire/cmd/wire@latest

COPY go.mod go.sum ./

RUN go mod download

COPY . .

ENV GOOS=linux
ENV GOARCH=amd64

RUN go build -o main ./cmd/api/main.go && \
go build -o migrate ./cmd/goose-migrations/main.go && \
go build -o seed ./cmd/goose-seeders/main.go

FROM scratch

COPY --from=build /app/main /main
COPY --from=build /app/migrate /migrate
COPY --from=build /app/seed /seed

EXPOSE 42069

CMD ["/main"]
