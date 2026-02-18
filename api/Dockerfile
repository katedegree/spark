FROM golang:1.25
WORKDIR /api

RUN go install github.com/air-verse/air@latest
RUN go install -tags 'mysql' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

CMD ["air"]
EXPOSE 8080
