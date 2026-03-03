FROM golang:1.25
WORKDIR /api

RUN apt-get update && apt-get install -y make && rm -rf /var/lib/apt/lists/*

RUN go install github.com/air-verse/air@latest
RUN go install -tags 'mysql' github.com/golang-migrate/migrate/v4/cmd/migrate@latest
RUN go install github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen@latest

CMD ["air"]
EXPOSE 8080
