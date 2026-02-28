package infrastructure

import (
	"fmt"

	"github.com/katedegree/spark/internal/infrastructure/env"
	"github.com/sashabaranov/go-openai"
)

func NewAI() (*openai.Client, error) {
	apiKey := env.OpenAIAPIKey()
	if apiKey == "" {
		return nil, fmt.Errorf("OpenAI API key is not set")
	}

	return openai.NewClient(apiKey), nil
}
