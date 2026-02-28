package infrastructure

import (
	"context"
	"errors"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/katedegree/spark/internal/infrastructure/env"
)

func NewStorage() (*s3.Client, error) {
	ctx := context.Background()
	accessKey := env.AWSAccessKeyID()
	secretKey := env.AWSSecretAccessKey()
	if accessKey == "" || secretKey == "" {
		return nil, errors.New("AWS credentials or region not set in environment variables")
	}

	cfg, err := config.LoadDefaultConfig(ctx,
		config.WithRegion("ap-northeast-1"),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(
			accessKey,
			secretKey,
			"",
		)),
	)
	if err != nil {
		return nil, err
	}

	return s3.NewFromConfig(cfg), nil
}
