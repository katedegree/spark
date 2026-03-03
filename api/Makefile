migrate:
	go run ./cmd/migrate/migrate.go $(filter-out $@,$(MAKECMDGOALS))

seed:
	go run ./cmd/seed/seed.go $(filter-out $@,$(MAKECMDGOALS))

codegen-v1:
	oapi-codegen --config oapi_codegen_v1.yaml /schema/v1/openapi.yaml

%:
	@:
