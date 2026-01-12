import * as Linking from "expo-linking";
import * as ReactNative from "react-native";

const env = {
  portal: process.env.EXPO_PUBLIC_OAUTH_PORTAL_URL ?? "",
  server: process.env.EXPO_PUBLIC_OAUTH_SERVER_URL ?? "",
  appId: process.env.EXPO_PUBLIC_APP_ID ?? "",
  ownerId: process.env.EXPO_PUBLIC_OWNER_OPEN_ID ?? "",
  ownerName: process.env.EXPO_PUBLIC_OWNER_NAME ?? "",
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? "",
  deepLinkScheme: "grupo-one-app",
};

export const OAUTH_PORTAL_URL = env.portal;
export const OAUTH_SERVER_URL = env.server;
export const APP_ID = env.appId;
export const OWNER_OPEN_ID = env.ownerId;
export const OWNER_NAME = env.ownerName;
export const API_BASE_URL = env.apiBaseUrl;

/**
 * Get the API base URL, deriving from current hostname if not set.
 * Priority order:
 * 1. EXPO_PUBLIC_API_URL (or API_BASE_URL) environment variable (highest priority)
 * 2. For web: derive from current hostname by replacing port 8081 with 3000
 * 3. For mobile: detect IP from Expo Constants or use localhost
 * 
 * For production builds, always set EXPO_PUBLIC_API_URL environment variable.
 * For development, mobile will auto-detect IP from Metro bundler.
 */
export function getApiBaseUrl(): string {
  // Priority 1: Use EXPO_PUBLIC_API_URL if set (production/staging)
  const envApiUrl = process.env.EXPO_PUBLIC_API_URL || API_BASE_URL;
  if (envApiUrl && envApiUrl.trim() !== "") {
    return envApiUrl.trim().replace(/\/$/, "");
  }

  // Priority 2: On web, derive from current hostname by replacing port 8081 with 3000
  if (ReactNative.Platform.OS === "web" && typeof window !== "undefined" && window.location) {
    const { protocol, hostname } = window.location;
    // Pattern: 8081-sandboxid.region.domain -> 3000-sandboxid.region.domain
    const apiHostname = hostname.replace(/^8081-/, "3000-");
    if (apiHostname !== hostname) {
      return `${protocol}//${apiHostname}`;
    }
  }

  // Priority 3: For mobile (iOS/Android), detect IP dynamically
  if (ReactNative.Platform.OS !== "web") {
    try {
      const Constants = require("expo-constants");
      
      // Try to get the debugger host from Expo Constants (available in Expo Go and dev builds)
      const debuggerHost = Constants.expoConfig?.hostUri?.split(":")[0];
      
      if (debuggerHost) {
        // Use the same host as Metro bundler (works for physical devices on same network)
        // This automatically handles LAN IP detection
        return `http://${debuggerHost}:3000`;
      }
      
      // Fallback to localhost (works in simulator/emulator only)
      // For physical devices, ensure EXPO_PUBLIC_API_URL is set or use LAN IP
      console.warn(
        "[getApiBaseUrl] Could not detect host from Expo Constants. " +
        "Using localhost (will only work in simulator/emulator). " +
        "For physical devices, set EXPO_PUBLIC_API_URL environment variable."
      );
      return "http://localhost:3000";
    } catch (error) {
      console.warn("[getApiBaseUrl] Error getting Expo Constants:", error);
      // Last resort: localhost (only works in simulator/emulator)
      return "http://localhost:3000";
    }
  }

  // Fallback to empty (will use relative URL on web)
  return "";
}

export const SESSION_TOKEN_KEY = "app_session_token";
export const USER_INFO_KEY = "app-user-info";

const encodeState = (value: string) => {
  if (typeof globalThis.btoa === "function") {
    return globalThis.btoa(value);
  }
  const BufferImpl = (globalThis as Record<string, any>).Buffer;
  if (BufferImpl) {
    return BufferImpl.from(value, "utf-8").toString("base64");
  }
  return value;
};

export const getLoginUrl = () => {
  let redirectUri: string;

  if (ReactNative.Platform.OS === "web") {
    // Web platform: redirect to API server callback (not Metro bundler)
    // The API server will then redirect back to the frontend with the session token
    redirectUri = `${getApiBaseUrl()}/api/oauth/callback`;
  } else {
    // Native platform: use deep link scheme for mobile OAuth callback
    // This allows the OS to redirect back to the app after authentication
    redirectUri = Linking.createURL("/oauth/callback", {
      scheme: env.deepLinkScheme,
    });
  }

  const state = encodeState(redirectUri);

  const url = new URL(`${OAUTH_PORTAL_URL}/app-auth`);
  url.searchParams.set("appId", APP_ID);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
