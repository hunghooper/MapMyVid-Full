# Security Headers Configuration

This document explains the security headers implemented using Helmet middleware in the Map My Vid API.

## Overview

Helmet is a middleware that sets various HTTP headers to help protect your app from well-known web vulnerabilities. It's not a silver bullet, but it can help!

## Security Headers Implemented

### 1. Content Security Policy (CSP)
- **Purpose**: Helps prevent Cross-Site Scripting (XSS) attacks
- **Configuration**: Restricts resource loading to trusted sources
- **Development**: Disabled for easier debugging
- **Production**: Strict policy enforced

### 2. Cross-Origin Policies
- **Cross-Origin Embedder Policy**: Controls cross-origin embedding
- **Cross-Origin Opener Policy**: Prevents cross-origin window access
- **Cross-Origin Resource Policy**: Controls cross-origin resource access

### 3. DNS Prefetch Control
- **Purpose**: Prevents DNS prefetching attacks
- **Configuration**: Disabled by default

### 4. Expect-CT
- **Purpose**: Certificate Transparency monitoring
- **Configuration**: 24-hour max age

### 5. Feature Policy / Permissions Policy
- **Purpose**: Controls browser features access
- **Restrictions**: Camera, microphone, geolocation, payment, USB, etc. disabled
- **Allowed**: Speaker and fullscreen for self-origin

### 6. Hide X-Powered-By
- **Purpose**: Removes server technology disclosure
- **Configuration**: Always enabled

### 7. HTTP Strict Transport Security (HSTS)
- **Purpose**: Forces HTTPS connections
- **Configuration**: 1 year max age, includes subdomains, preload enabled
- **Development**: Disabled for local development

### 8. IE No Open
- **Purpose**: Prevents IE from executing downloads
- **Configuration**: Always enabled

### 9. No Sniff
- **Purpose**: Prevents MIME type sniffing
- **Configuration**: Always enabled

### 10. Origin Agent Cluster
- **Purpose**: Isolates origins in separate processes
- **Configuration**: Always enabled

### 11. Referrer Policy
- **Purpose**: Controls referrer information sharing
- **Configuration**: No referrer information sent

### 12. XSS Filter
- **Purpose**: Enables browser XSS filtering
- **Configuration**: Always enabled

## Environment-Specific Configuration

### Development Environment
- CSP disabled for easier debugging
- HSTS disabled for local development
- Other security headers maintained

### Production Environment
- All security headers enabled
- Strict CSP policy
- HSTS with preload enabled

## Testing Security Headers

You can test the security headers using:

1. **Browser Developer Tools**: Check Network tab for response headers
2. **Online Tools**: 
   - https://securityheaders.com/
   - https://observatory.mozilla.org/
3. **Command Line**: `curl -I https://your-domain.com`

## Customization

To modify security headers, edit `src/config/helmet.config.ts`:

```typescript
// Example: Allow Google Fonts in CSP
contentSecurityPolicy: {
  directives: {
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
  },
}
```

## Security Considerations

1. **CSP**: May need adjustment based on your frontend requirements
2. **HSTS**: Only enable in production with HTTPS
3. **CORS**: Configure separately based on your frontend domains
4. **Rate Limiting**: Consider adding rate limiting middleware
5. **Input Validation**: Ensure proper validation pipes are configured

## Monitoring

Monitor security headers using:
- Application logs
- Security scanning tools
- Browser console warnings
- CSP violation reports

## References

- [Helmet.js Documentation](https://helmetjs.github.io/)
- [OWASP Security Headers](https://owasp.org/www-project-secure-headers/)
- [MDN Security Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers#security)
