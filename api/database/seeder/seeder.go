package seeder

import (
	"fmt"

	"gorm.io/gorm"
)

func Seed(db *gorm.DB, seederName string) error {
	seederFunc, exists := Seeders[seederName]
	if !exists {
		return fmt.Errorf("seeder not found: %s", seederName)
	}

	return seederFunc(db)
}

func Register(name string, fn func(db *gorm.DB) error) {
	Seeders[name] = fn
}

var Seeders = map[string]func(db *gorm.DB) error{}
