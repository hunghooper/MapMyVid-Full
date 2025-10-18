import helmet from 'helmet';

// Security configuration for Helmet
export const helmetConfig = {
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  // Cross-Origin Embedder Policy
  crossOriginEmbedderPolicy: false,
  // Cross-Origin Opener Policy
  crossOriginOpenerPolicy: { policy: "same-origin" as const },
  // Cross-Origin Resource Policy
  crossOriginResourcePolicy: { policy: "cross-origin" as const },
  // DNS Prefetch Control
  dnsPrefetchControl: { allow: false },
  // Expect CT
  expectCt: { maxAge: 86400 },
  // Feature Policy (deprecated, but kept for older browsers)
  featurePolicy: {
    features: {
      camera: ["'none'"],
      microphone: ["'none'"],
      geolocation: ["'none'"],
      payment: ["'none'"],
      usb: ["'none'"],
      magnetometer: ["'none'"],
      gyroscope: ["'none'"],
      speaker: ["'self'"],
      vibrate: ["'none'"],
      fullscreen: ["'self'"],
      syncXhr: ["'none'"],
    },
  },
  // Hide X-Powered-By header
  hidePoweredBy: true,
  // HSTS (HTTP Strict Transport Security)
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  // IE No Open
  ieNoOpen: true,
  // No Sniff
  noSniff: true,
  // Origin Agent Cluster
  originAgentCluster: true,
  // Permissions Policy
  permissionsPolicy: {
    camera: [],
    microphone: [],
    geolocation: [],
    payment: [],
    usb: [],
    magnetometer: [],
    gyroscope: [],
    speaker: ["self"],
    vibrate: [],
    fullscreen: ["self"],
    syncXhr: [],
  },
  // Referrer Policy
  referrerPolicy: { policy: "no-referrer" as const },
  // XSS Filter
  xssFilter: true,
};

// Development-specific configuration (more permissive)
export const helmetDevConfig = {
  ...helmetConfig,
  contentSecurityPolicy: false, // Disable CSP in development for easier debugging
  hsts: false, // Disable HSTS in development
};

// Production-specific configuration (strictest)
export const helmetProdConfig = {
  ...helmetConfig,
  // Additional production-specific settings can be added here
};
