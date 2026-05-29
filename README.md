# API Testing Framework with CI Integration

[![API Evidence Pipeline](https://github.com/Mohanad49/api-testing-framework-ci/actions/workflows/api-evidence.yml/badge.svg)](https://github.com/Mohanad49/api-testing-framework-ci/actions/workflows/api-evidence.yml)

**Live Report Hub:** `https://mohanad49.github.io/api-testing-framework-ci/`  
**Target API:** `https://restful-booker.herokuapp.com`  
**API Docs:** `https://restful-booker.herokuapp.com/apidoc/index.html`

A production-style API testing framework using **Postman collections**, **Newman CLI**, **GitHub Actions**, and **HTML/JSON/JUnit reporting** against the public Restful Booker API.

## Why this project exists

Most beginner API portfolios are just exported Postman collections. This project is structured like a real API QA evidence pipeline:

- Environment-driven test execution.
- Iteration data for repeatable booking payloads.
- Authentication token handling.
- End-to-end CRUD lifecycle coverage.
- Positive and negative API assertions.
- Response schema and data-persistence checks.
- Response-time SLA guardrails.
- Newman CLI execution.
- HTML, JSON, and JUnit reports.
- GitHub Actions CI.
- GitHub Pages-ready evidence hub.

## Target application

- App: Restful Booker
- Public URL: `https://restful-booker.herokuapp.com`
- API docs: `https://restful-booker.herokuapp.com/apidoc/index.html`

Restful Booker is a public API playground for practicing API testing. It supports authentication and CRUD-style hotel booking operations.

## Design direction

**Aesthetic:** forensic API control room.

The generated report hub is intentionally dark, sharp, and evidence-focused. It is designed to feel like a black-box flight recorder for API behavior: requests, assertions, pass rate, failures, and execution history are visible immediately.

## Project structure

```text
api-testing-framework-ci/
├── .github/workflows/api-evidence.yml       # CI + GitHub Pages deployment
├── collections/                             # Postman collection
├── data/                                    # Iteration test data
├── docs/                                    # Strategy, design thinking, defect template
├── environments/                            # Postman environment files
├── report-hub/                              # Reserved for report assets/design notes
├── reports/newman/                          # Generated reports after execution
├── scripts/                                 # Report hub generator and cleanup helpers
├── package.json                             # Newman tooling and npm scripts
└── README.md
```

## Coverage summary

| Area | Coverage |
|---|---|
| Health check | API availability through `/ping` |
| Discovery | Booking ID listing through `GET /booking` |
| Authentication | Valid token generation and invalid credential behavior |
| Create | Booking creation with data-driven payloads |
| Read | Created booking retrieval and schema validation |
| Update | Authenticated full update with field persistence checks |
| Patch | Authenticated partial update with non-mutated field checks |
| Delete | Authenticated deletion and cleanup verification |
| Negative paths | Unknown booking ID and unauthenticated mutation checks |
| Reporting | CLI, JSON, JUnit, Newman HTML, generated report hub |

## Prerequisites

Install these before running locally:

- Node.js 20+
- npm
- Internet connection to reach the public Restful Booker API

## Local installation

```bash
cd api-testing-framework-ci
npm install
```

For CI-style local installation, use:

```bash
npm ci
```

## Run the tests

### Full API suite

```bash
npm run test:api
```

This generates:

```text
reports/newman/summary.json
reports/newman/junit.xml
reports/newman/newman-report.html
```

### CLI-only run

```bash
npm run test:api:cli
```

### Smoke folder only

```bash
npm run test:smoke
```

## Generate the report hub

After running the suite:

```bash
npm run build:report-hub
```

Then open:

```text
public/index.html
```

The report hub copies the Newman HTML report into:

```text
public/newman-report.html
```

## Clean generated outputs

```bash
npm run clean
```

## GitHub Actions

The workflow runs on:

- push to `main`,
- pull request to `main`,
- manual workflow dispatch.

Workflow file:

```text
.github/workflows/api-evidence.yml
```

The pipeline:

1. checks out the repository,
2. installs Node dependencies,
3. runs the Newman API suite,
4. generates HTML/JSON/JUnit evidence,
5. builds the static report hub,
6. uploads raw artifacts,
7. deploys the report hub to GitHub Pages when not running on a pull request.

## Deploy to GitHub Pages

After pushing to GitHub:

1. Go to the repository.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **GitHub Actions**.
4. Go to **Actions**.
5. Run **API Evidence Pipeline** manually or push to `main`.
6. Wait for the workflow to finish successfully.
7. GitHub will publish the report hub at:

```text
https://Mohanad49.github.io/api-testing-framework-ci/
```

## Push to GitHub

Create an empty GitHub repository named:

```text
api-testing-framework-ci
```

Then run:

```bash
git init
git add .
git commit -m "Build API testing framework with CI evidence"
git branch -M main
git remote add origin https://github.com/Mohanad49/api-testing-framework-ci.git
git push -u origin main
```

## Recommended GitHub About description

```text
Postman/Newman API testing framework for Restful Booker with auth, CRUD, negative tests, GitHub Actions CI, and published HTML evidence reports.
```

## Resume-ready project entry

```text
API Testing Framework with CI Integration | Postman, Newman, GitHub Actions, HTML Reports
```

```text
• Built a Postman/Newman API automation framework targeting the public Restful Booker API, covering authentication, CRUD booking workflows, negative paths, schema validation, and response-time checks.

• Implemented data-driven test execution with environment variables, chained auth token handling, reusable iteration payloads, and automated JSON/JUnit/HTML report generation.

• Integrated GitHub Actions CI to run the API suite on pull requests and main-branch updates, then publish a GitHub Pages evidence hub with the latest Newman HTML report.
```

## Next upgrades

- Add OpenAPI contract validation.
- Add Dockerized execution.
- Add GitHub Actions test summary annotations.
- Add Slack/Discord failure notifications.
- Add separate environments for staging and production-like targets.
