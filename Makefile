.PHONY: help install dev build preview lint lint-fix test test-unit test-e2e test-e2e-ui test-e2e-headed clean playwright-browsers env-check db-test-setup

help: ## Show available commands
	@echo "Gogo Front - Available Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-20s %s\n", $$1, $$2}'

install: ## Install dependencies
	npm install

dev: ## Start Vite dev server
	npm run dev

build: ## Production build
	npm run build

preview: ## Preview production build
	npm run preview

lint: ## Run ESLint
	npm run lint

lint-fix: ## ESLint with --fix
	npm run lint -- --fix

test: ## Run Playwright E2E tests
	npx playwright test

test-unit: ## Run unit tests (node:test)
	npm run test:unit

test-e2e: ## Alias for test
	npx playwright test

test-e2e-ui: ## Playwright UI mode
	npx playwright test --ui

test-e2e-headed: ## Playwright headed
	npx playwright test --headed

playwright-browsers: ## Install Playwright browsers
	npx playwright install

db-test-setup: ## Apply gogo migrations to TEST_DATABASE_URL
	cd ../gogo && $(MAKE) test-db-setup

env-check: ## Check local environment
	@echo "Node: $$(node --version)"
	@echo "NPM: $$(npm --version)"
	@if [ -f ".env" ]; then echo ".env exists"; else echo ".env missing (cp .env.example .env)"; fi

clean: ## Remove build/test artifacts
	rm -rf dist/ node_modules/.vite/ test-results/ playwright-report/

.DEFAULT_GOAL := help
