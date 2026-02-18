package custom

import (
	"fmt"

	"github.com/katedegree/spark/internal/env"
	"github.com/sashabaranov/go-openai"
)

// custom.AI
type AI struct {
	*openai.Client
}

func NewAI() (*AI, error) {
	apiKey := env.OpenAIAPIKey()
	if apiKey == "" {
		return nil, fmt.Errorf("OpenAI API key is not set")
	}

	return &AI{Client: openai.NewClient(apiKey)}, nil
}
