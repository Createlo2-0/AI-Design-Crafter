export const STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

export const ERROR_CODES = {
  AUTH_FAILED: "AUTH_FAILED",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  ASSET_NOT_FOUND: "ASSET_NOT_FOUND",
  POSTER_NOT_FOUND: "POSTER_NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  PERMISSION_DENIED: "PERMISSION_DENIED",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
};

// Standard error messages
export const ERROR_MESSAGES = {
  AUTH_FAILED: "Authentication failed.",
  USER_NOT_FOUND: "User not found.",
  ASSET_NOT_FOUND: "Asset not found.",
  POSTER_NOT_FOUND: "Poster not found.",
  VALIDATION_ERROR: "Validation error.",
  PERMISSION_DENIED: "You do not have permission to perform this action.",
  UNKNOWN_ERROR: "An unknown error occurred.",
};

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
};