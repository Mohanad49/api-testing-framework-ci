# API Test Strategy

## Target

Restful Booker public API: `https://restful-booker.herokuapp.com`

The API models hotel booking operations and supports health checks, authentication, booking discovery, booking creation, full update, partial update, and deletion.

## Scope

### Covered

- API availability through `/ping`.
- Booking discovery through `GET /booking`.
- Authentication through `POST /auth`.
- Valid and invalid credential behavior.
- Full booking lifecycle:
  - create,
  - read,
  - full update,
  - partial update,
  - delete,
  - verify deletion.
- Negative checks:
  - unknown booking ID,
  - unauthenticated protected mutation.
- Response status codes.
- Response schema shape.
- Key field persistence.
- Basic response-time SLA guardrail.

### Not covered

- Load/performance testing.
- Security scanning.
- Contract testing with a formal OpenAPI validator.
- Production-grade secret management, because the target uses public practice credentials.

## Test data approach

The collection uses `data/booking-data.json` to run the lifecycle tests with multiple payloads. This makes the suite less hardcoded and proves that the same flow can validate different data combinations.

## Risk management

Because the target API is public, the suite avoids tests that depend on exact existing production data. It creates and deletes its own records during the run.

## Reporting

The framework produces:

- CLI output for fast developer feedback,
- JSON summary for machine-readable analysis,
- JUnit XML for CI test results,
- Newman HTML report for readable execution evidence,
- generated GitHub Pages report hub for public portfolio review.
