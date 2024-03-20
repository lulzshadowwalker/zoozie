CMD := $(firstword $(MAKECMDGOALS))
ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
%::
	@true

.DEFAULT_TARGET=watch
.PHONY: watch build run test clean proto-go goose-up goose-up-by-one goose-up-to goose-down goose-down-to goose-redo goose-reset goose-status goose-version goose-create goose-fix goose-validate

# Live Reload
watch:
	@if command -v air > /dev/null; then \
	    air; \
	    echo "Watching...";\
	else \
	    read -p "Go's 'air' is not installed on your machine. Do you want to install it? [Y/n] " choice; \
	    if [ "$$choice" != "n" ] && [ "$$choice" != "N" ]; then \
	        go install github.com/cosmtrek/air@latest; \
	        air; \
	        echo "Watching...";\
	    else \
	        echo "You chose not to install air. Exiting..."; \
	        exit 1; \
	    fi; \
	fi

# Build the application
build:
	@echo "Building..."
	@go build -o ./bin/main cmd/api/main.go
	@echo "executable built at ./bin/main"

# Run the application
run:
	@go run cmd/api/main.go

# Run Jet migrations
jet-migrations:
	@go run cmd/migrations/main.go


# Test the application
test:
	@echo "Testing..."
	@go test ./tests -v

# Clean the binary
clean:
	@echo "Cleaning..."
	@rm -rf ./bin

PROTO_FILE_PATH ?= $(shell bash -c 'read -p ".proto file path: " proto_file_path; echo $$proto_file_path')
# protoc code generation for Go
proto-go:
	@protoc --go_out=. --go_opt=paths=source_relative \
		--go-grpc_out=. --go-grpc_opt=paths=source_relative \
		internal/$(PROTO_FILE_PATH)



GOOSE_DIR="./internal/database/migrations/"
# goose up
goose-up:
	@goose --dir ${GOOSE_DIR} up

# goose up-by-one
goose-up-by-one:
	@goose --dir ${GOOSE_DIR} up-by-one

# goose up-to VERSION
goose-up-to:
	@goose --dir ${GOOSE_DIR} up-to $(ARGS)

# goose down
goose-down:
	@goose --dir ${GOOSE_DIR} down

# goose down-to VERSION
goose-down-to:
	@goose --dir ${GOOSE_DIR} down-to $(ARGS)

# goose redo
goose-redo:
	@goose --dir ${GOOSE_DIR} redo

# goose reset
goose-reset:
	@goose --dir ${GOOSE_DIR} reset

# goose status
goose-status:
	@goose --dir ${GOOSE_DIR} status

# goose version
goose-version:
	@goose --dir ${GOOSE_DIR} version

# goose create NAME [sql|go] 
goose-create:
	@goose --dir ${GOOSE_DIR} create $(ARGS)

# goose fix
gosoe-fix:
	@goose --dir ${GOOSE_DIR} fix

# goose validate
goose-validate:
	@goose --dir ${GOOSE_DIR} validate
