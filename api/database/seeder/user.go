package seeder

import (
	"gorm.io/gorm"
	"time"
)

func User(db *gorm.DB) error {
	users := []map[string]interface{}{
		{
			"email":      "taro@example.com",
			"password":   "password123",
			"created_at": time.Now(),
			"updated_at": time.Now(),
		},
		{
			"email":      "hanako@example.com",
			"password":   "password123",
			"created_at": time.Now(),
			"updated_at": time.Now(),
		},
	}

	for _, user := range users {
		// すでに存在する場合は削除してから追加
		db.Table("users").Where("email = ?", user["email"]).Delete(nil)
		if err := db.Table("users").Create(user).Error; err != nil {
			return err
		}
	}

	return nil
}

func init() {
	Register("user", User)
}
