# Security Policy

## Reporting a Vulnerability

We take the security of Expo GitLab Client seriously. If you believe you have found a security vulnerability, please report it to us as described below.

**Please do not report security vulnerabilities through public GitHub/GitLab issues.**

Instead, please report them via email to the maintainer. You should receive a response within 48 hours.

Please include the following information:

- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

## Supported Versions

Only the latest version of Expo GitLab Client is currently being supported with security updates.

## Security Best Practices

When setting up your own instance of this application:

1. Never commit your `.env` file or any sensitive credentials
2. Keep all dependencies up to date
3. Use environment variables for all sensitive configuration
4. Follow the principle of least privilege when setting up GitLab access tokens
5. Regularly rotate your access tokens and credentials

## Third-Party Services

This application integrates with several third-party services:

- GitLab API
- Firebase
- Expo Push Notifications

Please ensure you follow the security best practices for each of these services when setting up your own instance.
