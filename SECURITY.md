# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | Yes       |

## Reporting a Vulnerability

**Please do NOT open a public issue for security vulnerabilities.**

Instead, email **denisvieira05@gmail.com** with:

- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response Timeline

- **48 hours** — acknowledgment of your report
- **7 days** — initial assessment and severity classification
- **30 days** — target for fix release (critical issues prioritized)

## Disclosure Policy

We follow coordinated disclosure. Once a fix is released, we will:

1. Publish a security advisory on GitHub
2. Credit the reporter (unless anonymity is requested)
3. Release a patched version on npm

## Security by Design

- API keys are stored in `.devflow/.env` with `0600` permissions and are never committed to git
- Sensitive files (`.env`, credentials, keys) are automatically excluded from `devflow commit`
