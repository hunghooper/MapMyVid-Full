// Error Messages Constants
// This file contains all error messages used throughout the application
// for better maintainability and consistency

export const ERROR_MESSAGES = {
  // Authentication & Authorization
  AUTH: {
    EMAIL_PASSWORD_REQUIRED: 'Email and password are required',
    INVALID_CREDENTIALS: 'Invalid credentials',
    ACCOUNT_DEACTIVATED: 'Account is deactivated',
    INVALID_USER_DATA: 'Invalid user data for login',
    EMAIL_ALREADY_EXISTS: 'Email already exists',
    PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long',
    INVALID_EMAIL_FORMAT: 'Invalid email format',
    FAILED_CREATE_USER: 'Failed to create user account',
    ACCESS_DENIED: 'Access denied',
    UNAUTHORIZED_ACCESS: 'Unauthorized access',
    ACCESS_FORBIDDEN: 'Access forbidden'
  },

  // User Management
  USER: {
    ID_REQUIRED: 'User ID is required',
    EMAIL_REQUIRED: 'Email is required',
    NOT_FOUND: 'User not found',
    FAILED_CREATE: 'Failed to create user',
    FAILED_FIND_BY_EMAIL: 'Failed to find user by email',
    FAILED_FIND_BY_ID: 'Failed to find user by ID',
    FAILED_UPDATE: 'Failed to update user',
    ROLE_REQUIRED: 'User ID and role are required',
    INVALID_ROLE: 'Invalid user role',
    FAILED_UPDATE_ROLE: 'Failed to update user role',
    ACTIVE_STATUS_REQUIRED: 'User ID and active status are required',
    FAILED_UPDATE_STATUS: 'Failed to update user status',
    FAILED_DELETE: 'Failed to delete user',
    CANNOT_DELETE_WITH_VIDEOS: 'Cannot delete user with existing videos. Please delete videos first.',
    FAILED_FETCH_USERS: 'Failed to fetch users'
  },

  // Location Management
  LOCATION: {
    VIDEO_ID_REQUIRED: 'Video ID and original name are required',
    USER_ID_REQUIRED: 'User ID is required',
    LOCATION_ID_REQUIRED: 'User ID and location ID are required',
    NOT_FOUND: 'Location not found',
    FAILED_CREATE: 'Failed to create location',
    FAILED_FETCH: 'Failed to fetch locations',
    FAILED_FIND: 'Failed to find location',
    FAILED_UPDATE: 'Failed to update location',
    FAILED_DELETE: 'Failed to delete location',
    FAILED_TOGGLE_FAVORITE: 'Failed to toggle favorite status',
    FAILED_SET_FAVORITE: 'Failed to set favorite status',
    INVALID_FAVORITE_STATUS: 'Invalid favorite status value',
    INVALID_PAGINATION: 'Invalid pagination parameters'
  },

  // Video Analysis
  VIDEO: {
    MISSING_PARAMETERS: 'Missing required parameters for video analysis',
    FILE_TOO_LARGE: 'Video file too large. Maximum size is 100MB',
    INVALID_FILE_TYPE: 'Invalid file type. Only video files are allowed',
    ANALYSIS_FAILED: 'Video analysis failed',
    PROCESSING_FAILED: 'Failed to process video',
    NOT_FOUND: 'Video not found',
    FAILED_FETCH_USER_VIDEOS: 'Failed to fetch user videos',
    FAILED_FETCH_VIDEO: 'Failed to fetch video',
    FAILED_DELETE: 'Failed to delete video',
    FAILED_FETCH_STATISTICS: 'Failed to fetch user statistics',
    INVALID_PAGINATION: 'Invalid pagination parameters'
  },

  // Admin Operations
  ADMIN: {
    INVALID_PAGINATION: 'Invalid pagination parameters',
    FAILED_FETCH_USERS: 'Failed to fetch users',
    FAILED_FETCH_STATISTICS: 'Failed to fetch system statistics'
  },

  // General Validation
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_FORMAT: 'Invalid format',
    INVALID_VALUE: 'Invalid value',
    MISSING_PARAMETERS: 'Missing required parameters',
    INVALID_REQUEST: 'Invalid request parameters'
  },

  // Database Operations
  DATABASE: {
    CONNECTION_FAILED: 'Database connection failed',
    QUERY_FAILED: 'Database query failed',
    TRANSACTION_FAILED: 'Database transaction failed',
    CONSTRAINT_VIOLATION: 'Database constraint violation'
  },

  // File Operations
  FILE: {
    UPLOAD_FAILED: 'File upload failed',
    INVALID_SIZE: 'Invalid file size',
    INVALID_TYPE: 'Invalid file type',
    PROCESSING_FAILED: 'File processing failed'
  },

  // External Services
  EXTERNAL: {
    AI_SERVICE_FAILED: 'AI analysis service failed',
    MAPS_SERVICE_FAILED: 'Maps service failed',
    STORAGE_SERVICE_FAILED: 'Storage service failed'
  }
} as const;

// Error Codes for programmatic error handling
export const ERROR_CODES = {
  // Authentication
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  ACCOUNT_DEACTIVATED: 'ACCOUNT_DEACTIVATED',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  
  // Resource Management
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
  ACCESS_DENIED: 'ACCESS_DENIED',
  
  // File Operations
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  
  // System
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE'
} as const;

// HTTP Status Code mappings
export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const;
