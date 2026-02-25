package main

import (
	"log"
	"net/http"

	"github.com/joho/godotenv"
	"github.com/katedegree/spark/internal/infrastructure/custom"
	"github.com/katedegree/spark/internal/infrastructure/middleware"
	"github.com/katedegree/spark/internal/infrastructure/router"
)

func main() {
	_ = godotenv.Load()

	db, err := custom.NewGorm()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close() // 後処理
	storage, err := custom.NewS3()
	if err != nil {
		log.Fatal(err)
	}
	ai, err := custom.NewAI()
	if err != nil {
		log.Fatal(err)
	}

	e := custom.NewEcho(db, storage, ai)
	e.Use(middleware.CORS)
	e.Use(middleware.Recover)

	e.GET("/", func(cc *custom.Context) error {
		return cc.JSON(http.StatusOK, "Hello Echo!")
	})
	router.Api(e.Group("api"))

	e.Logger.Fatal(e.Start(":8080"))
}
