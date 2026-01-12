/**
 * Quick example (matches curl usage):
 *   await callDataApi("Youtube/search", {
 *     query: { gl: "US", hl: "en", q: "manus" },
 *   })
 */
import { ENV } from "./env";

export type DataApiCallOptions = {
  query?: Record<string, unknown>;
  body?: Record<string, unknown>;
  pathParams?: Record<string, unknown>;
  formData?: Record<string, unknown>;
};

export async function callDataApi(
  apiId: string,
  options: DataApiCallOptions = {},
): Promise<unknown> {
  if (!ENV.forgeApiUrl) {
    throw new Error("BUILT_IN_FORGE_API_URL is not configured");
  }
  if (!ENV.forgeApiKey) {
    throw new Error("BUILT_IN_FORGE_API_KEY is not configured");
  }

  // Build the full URL by appending the service path to the base URL
  const baseUrl = ENV.forgeApiUrl.endsWith("/") ? ENV.forgeApiUrl : `${ENV.forgeApiUrl}/`;
  const fullUrl = new URL("webdevtoken.v1.WebDevService/CallApi", baseUrl).toString();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

  try {
    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "connect-protocol-version": "1",
        authorization: `Bearer ${ENV.forgeApiKey}`,
      },
      body: JSON.stringify({
        apiId,
        query: options.query,
        body: options.body,
        path_params: options.pathParams,
        multipart_form_data: options.formData,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(
        `Data API request failed (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`,
      );
    }

    const payload = await response.json().catch(() => {
      throw new Error("Invalid JSON response from Data API");
    });

    if (payload && typeof payload === "object" && "jsonData" in payload) {
      try {
        const jsonData = (payload as Record<string, string>).jsonData;
        if (typeof jsonData === "string") {
          return JSON.parse(jsonData);
        }
        return jsonData;
      } catch (parseError) {
        // If parsing fails, return the raw jsonData
        return (payload as Record<string, unknown>).jsonData;
      }
    }
    return payload;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Data API request timeout");
    }
    throw error;
  }
}
