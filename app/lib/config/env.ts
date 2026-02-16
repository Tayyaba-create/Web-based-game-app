// Environment configuration

// Get the API URL - use relative path for same-origin requests on production
const getApiUrl = () => {
  // If explicitly set, use it
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // On production (Vercel), use relative path for API routes
  if (typeof window === "undefined") {
    // Server-side: use localhost for development
    return process.env.NODE_ENV === "production" ? "" : "http://localhost:3000";
  }

  // Client-side: use relative path (empty string = current origin)
  return "";
};

// Validate required environment variables
const validateEnv = () => {
  const required = ["SESSION_VERIFICATION_URL"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0 && process.env.NODE_ENV === "production") {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
};

// Call validation on server-side
if (typeof window === "undefined") {
  validateEnv();
}

export const env = {
  API_URL: getApiUrl(),
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3000",
  SESSION_VERIFICATION_URL:
    process.env.SESSION_VERIFICATION_URL ||
    "https://flowapp-hdx-d5d7hvdeeee4g3dr.uaenorth-01.azurewebsites.net",
  NODE_ENV: process.env.NODE_ENV || "development",
  // API credentials - retrieved only on server-side via API routes
  API_AUTH_USERNAME: process.env.API_AUTH_USERNAME || "",
  API_AUTH_PASSWORD: process.env.API_AUTH_PASSWORD || "",
};

// Type-safe environment checks
export const isDevelopment = env.NODE_ENV === "development";
export const isProduction = env.NODE_ENV === "production";

// Warn if credentials are missing in production
if (isProduction && (!env.API_AUTH_USERNAME || !env.API_AUTH_PASSWORD)) {
  console.error(
    "⚠️ WARNING: API credentials not configured. Set API_AUTH_USERNAME and API_AUTH_PASSWORD environment variables.",
  );
}
