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

	// DBインスタンス生成
	db, err := custom.NewGorm()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close() // 後処理

	// ストレージインスタンス生成
	storage, err := custom.NewS3()
	if err != nil {
		log.Fatal(err)
	}

	// メールインスタンス生成
	mailer, err := custom.NewSES()
	if err != nil {
		log.Fatal(err)
	}

	// AIインスタンス生成
	ai, err := custom.NewAI()
	if err != nil {
		log.Fatal(err)
	}

	e, err := custom.NewEcho(custom.Deps{
		DB:      db,
		Storage: storage,
		Mailer:  mailer,
		AI:      ai,
	})
	if err != nil {
		log.Fatal(err)
	}
	e.Use(middleware.CORS)
	e.Use(middleware.Recover)

	e.GET("/", func(cc *custom.Context) error {
		return cc.JSON(http.StatusOK, "Hello Echo!")
	})
	router.Api(e.Group("api"))

	e.Logger.Fatal(e.Start(":8080"))
}
