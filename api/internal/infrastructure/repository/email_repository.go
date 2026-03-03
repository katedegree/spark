package repository

import (
	"context"
	"fmt"

	domain "github.com/katedegree/spark/internal/domain/repository"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/ses"
	"github.com/aws/aws-sdk-go-v2/service/ses/types"
)

type EmailRepository struct {
	mailer *ses.Client
}

func NewEmailRepository(mailer *ses.Client) domain.EmailRepository {
	return &EmailRepository{
		mailer: mailer,
	}
}

func (r *EmailRepository) SendOTP(ctx context.Context, to, otp string) error {
	subject := "認証コード"
	body := fmt.Sprintf("認証コードは %s です。", otp)
	charset := "UTF-8"

	input := &ses.SendEmailInput{
		Destination: &types.Destination{
			ToAddresses: []string{to},
		},
		Message: &types.Message{
			Subject: &types.Content{
				Data:    &subject,
				Charset: &charset,
			},
			Body: &types.Body{
				Text: &types.Content{
					Data:    &body,
					Charset: &charset,
				},
			},
		},
		Source: aws.String("no-reply@spark.katedegree.com"),
	}

	_, err := r.mailer.SendEmail(ctx, input)
	return err
}
