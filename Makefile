setup:
	docker compose build
	docker compose run api go mod tidy
	docker compose run web npm install
	docker compose up -d

build:
	docker compose build

up:
	docker compose up $(filter-out $@,$(MAKECMDGOALS))

restart:
	docker compose restart

down:
	docker compose down

run:
	docker compose run $(filter-out $@,$(MAKECMDGOALS)) bash

exec:
	docker compose exec $(filter-out $@,$(MAKECMDGOALS)) bash

logs:
	docker compose logs $(filter-out $@,$(MAKECMDGOALS)) -f

migrate:
	docker compose exec api go run ./cmd/migrate/migrate.go $(filter-out $@,$(MAKECMDGOALS))

seed:
	docker compose exec api go run ./cmd/seed/seed.go $(filter-out $@,$(MAKECMDGOALS))

%:
	@:
