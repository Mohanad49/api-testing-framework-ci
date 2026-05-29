# Design Thinking

## Purpose

This project proves that API testing is not just sending requests in Postman. It demonstrates a repeatable testing framework that can be run locally, inside CI, and published as public evidence for reviewers.

The user is a QA engineer, recruiter, engineering manager, or interviewer who wants to answer one question quickly: can this candidate design API tests that validate real behavior, protect contracts, and produce useful failure evidence?

## Tone

**Aesthetic direction: forensic API control room.**

The report hub is intentionally dark, compressed, and operational. It feels closer to a black-box flight recorder than a friendly SaaS dashboard. The strong typography, acid status signal, amber accents, and execution ledger are designed to make one idea memorable:

> Every API claim should leave evidence.

## Constraints

- The target API is public and can be unstable, so assertions avoid relying on fragile public seed data.
- The collection is Newman-compatible and uses Postman Collection v2.1 format.
- No secrets are required. Default Restful Booker credentials are stored in the local environment file for a public learning API.
- CI must run with a standard Node.js setup and publish static artifacts to GitHub Pages.
- The generated report hub must work as static HTML with no build framework.

## Differentiation

Most beginner API portfolios stop at a Postman collection. This project adds:

- structured environment management,
- iteration data,
- auth token handling,
- chained CRUD lifecycle validation,
- negative-path checks,
- CLI execution through Newman,
- JSON/JUnit/HTML reports,
- GitHub Actions automation,
- and a generated evidence hub for public review.

The memorable element is the **Execution Ledger**: a static CI-published page that summarizes requests, assertions, pass rate, failures, and links to the full Newman HTML report.
