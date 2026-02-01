# Security Checklist

## Authentication & Authorization
- [ ] Proper authentication mechanisms in place
- [ ] Authorization checks for all protected resources
- [ ] Session management implemented correctly
- [ ] Password requirements enforced

## Data Protection
- [ ] Input validation and sanitization
- [ ] SQL injection prevention
- [ ] XSS protection implemented
- [ ] CSRF tokens where applicable
- [ ] Sensitive data encrypted at rest
- [ ] HTTPS enforced for data in transit

## API Security
- [ ] Rate limiting implemented
- [ ] API keys/secrets not exposed in client code
- [ ] Proper error responses (no information leakage)
- [ ] Request/response validation

## Dependencies
- [ ] Dependencies scanned for vulnerabilities
- [ ] Only necessary dependencies included
- [ ] Regular security updates planned

## Logging & Monitoring
- [ ] Security events logged appropriately
- [ ] No sensitive data in logs
- [ ] Monitoring for suspicious activity

## Infrastructure
- [ ] Environment variables used for secrets
- [ ] Proper firewall rules
- [ ] Backup and recovery procedures
