# API Defect Template

## Title

`[API] <endpoint> returns <actual behavior> when <expected behavior>`

## Environment

- Base URL:
- Collection version:
- Newman version:
- Run source: Local / GitHub Actions
- Date/time:

## Endpoint

- Method:
- Path:
- Auth required: Yes / No

## Preconditions

- Required token:
- Required booking ID:
- Test data used:

## Steps to reproduce

1. Send request:
2. Use payload:
3. Observe response:

## Expected result

Describe the expected status code, schema, and business behavior.

## Actual result

Describe the actual status code, body, and observed behavior.

## Evidence

- Newman HTML report link:
- GitHub Actions run link:
- Request/response screenshot or copied payload:

## Severity

- Critical: breaks core API flow or data integrity.
- High: blocks key user/API operation.
- Medium: wrong validation, wrong response contract, or inconsistent behavior.
- Low: unclear message, documentation mismatch, minor formatting issue.

## Business impact

Explain who is affected and what risk this creates.
