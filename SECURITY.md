# Security and Production Hardening Guide

This guide covers security best practices and production hardening for the Recipe Generator application.

## Security Headers

The application should be served with the following security headers. These should be configured at the application level or reverse proxy:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.vercel-insights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### Next.js Security Headers Configuration

The application has Next.js security headers configured in `next.config.mjs`. To add additional headers:

```typescript
// next.config.mjs
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ],
      },
    ]
  },
}
```

## HTTPS/SSL

Always use HTTPS in production. Options:

1. **Let's Encrypt (Free)**
   ```bash
   certbot certonly --standalone -d yourdomain.com
   ```

2. **AWS Certificate Manager**
   - Free SSL/TLS certificates
   - Automatic renewal

3. **Cloudflare**
   - Free or paid SSL/TLS
   - DDoS protection included

## API Security

### Rate Limiting

The application implements rate limiting on API endpoints. Configure in `lib/config.ts`:

```typescript
RATE_LIMIT_REQUESTS: 100 // requests per window
RATE_LIMIT_WINDOW_MS: 900000 // 15 minutes
```

For production, consider using:
- Redis-based rate limiting
- API Gateway rate limiting (AWS, Google Cloud)
- Reverse proxy rate limiting (nginx, Cloudflare)

### CORS Configuration

Configure CORS in `next.config.mjs`:

```typescript
async function middleware(req) {
  const origin = req.headers.get('origin')
  const allowedOrigins = ['https://yourdomain.com', 'https://www.yourdomain.com']
  
  if (allowedOrigins.includes(origin)) {
    // Allow request
  }
}
```

### Input Validation

All user inputs are validated using Zod schemas:
- Image file validation: Size, type, MIME type
- Ingredient validation: Length, format, sanitization
- JSON payload validation: Type checking, schema validation

## Environment Variables

### Production Requirements

```env
# Security
NODE_ENV=production
NEXT_PUBLIC_GROQ_API_KEY=your_production_key
NEXT_PUBLIC_API_URL=https://yourdomain.com

# Recommended for production
SENTRY_DSN=your_sentry_dsn (for error tracking)
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id

# API Configuration
API_TIMEOUT_MS=30000
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000

# Feature Flags
NEXT_PUBLIC_ENABLE_RECIPE_SAVING=true
NEXT_PUBLIC_ENABLE_USER_ACCOUNTS=true
```

### Never commit secrets to version control

1. Use `.env.local` for local development (in `.gitignore`)
2. Use environment variable management:
   - Vercel: Environment Variables in dashboard
   - AWS: AWS Secrets Manager
   - Google Cloud: Secret Manager
   - GitHub: Actions Secrets
   - Docker: Pass via `-e` flag or secrets file

## Database Security

When database support is added:

1. **Encryption at rest**: Enable database encryption
2. **Encryption in transit**: Use SSL/TLS connections
3. **Access control**: Use IAM roles and least privilege
4. **Backups**: Regular automated backups with encryption
5. **Audit logging**: Enable query audit logs

## Monitoring & Logging

### Error Tracking

Set up error tracking with Sentry:

```typescript
// lib/sentry.ts
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})
```

### Log Aggregation

For production, use:
- CloudWatch (AWS)
- Stackdriver (Google Cloud)
- Application Insights (Azure)
- Datadog
- LogRocket
- Papertrail

### Monitoring Metrics

Monitor these metrics in production:

```
- API response times
- Error rates and types
- Image detection success rate
- Recipe generation success rate
- CPU and memory usage
- Database query performance
- Request rates and patterns
```

## Dependency Management

### Keep Dependencies Updated

```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Audit for vulnerabilities
npm audit
npm audit fix
```

### Vulnerability Scanning

Enable automated scanning:
- Dependabot (GitHub)
- Snyk
- WhiteSource
- OWASP Dependency Check

## Data Privacy

### GDPR Compliance

When user accounts are implemented:

1. **User consent**: Obtain explicit consent for data collection
2. **Data minimization**: Collect only necessary data
3. **Right to access**: Provide data export functionality
4. **Right to delete**: Implement account/data deletion
5. **Data retention**: Define retention policies
6. **Privacy policy**: Create clear privacy policy

### PCI-DSS Compliance

If payment processing is added:
- Use payment gateways (Stripe, Square)
- Never store payment details
- Use HTTPS/TLS
- Implement PCI-DSS security practices

## DDoS Protection

### Cloudflare DDoS Protection

```
1. Sign up for Cloudflare
2. Point DNS to Cloudflare
3. Enable DDoS protection (automatic)
```

### AWS Shield

Built-in for AWS deployments:
- Shield Standard: Free protection
- Shield Advanced: Enhanced DDoS protection

## Penetration Testing

### Before Production Launch

1. **OWASP Top 10 Check**
   - SQL Injection prevention (parameterized queries)
   - XSS prevention (input sanitization, CSP headers)
   - CSRF protection (CSRF tokens)
   - Broken authentication (secure sessions)
   - Sensitive data exposure (HTTPS, encryption)

2. **Security Audit**
   - Code review
   - Dependency scanning
   - Configuration review

3. **Penetration Testing**
   - Professional security assessment
   - Vulnerability disclosure program

## Deployment Checklist

- [ ] All environment variables configured
- [ ] HTTPS/SSL enabled
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation in place
- [ ] Error tracking configured
- [ ] Logging configured
- [ ] Backups configured
- [ ] Monitoring configured
- [ ] DNS configured
- [ ] CDN configured (optional)
- [ ] Firewall rules configured
- [ ] DDoS protection enabled
- [ ] Security audit completed
- [ ] Penetration testing done (recommended)

## Incident Response

### Create an Incident Response Plan

1. **Detection**: Monitor alerts and logs
2. **Response**: Activate incident response team
3. **Investigation**: Identify root cause
4. **Mitigation**: Stop the incident
5. **Remediation**: Fix the issue
6. **Post-incident**: Review and improve

### Security Contact

Provide a security contact for vulnerability reports:
- Email: security@yourdomain.com
- PGP key: (optional)

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/nodejs-security/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [CWE Top 25](https://cwe.mitre.org/top25/)

## Support

For security issues:
- Report privately via email: security@yourdomain.com
- Do not open public issues for security vulnerabilities
- Follow responsible disclosure guidelines

---

**Last Updated**: May 2026 | **Version**: 1.0.0
