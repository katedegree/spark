package env

import "os"

func AWSAccessKeyID() string {
	return os.Getenv("AWS_ACCESS_KEY_ID")
}
func AWSSecretAccessKey() string {
	return os.Getenv("AWS_SECRET_ACCESS_KEY")
}
func AWSBucket() string { return os.Getenv("AWS_BUCKET") }
