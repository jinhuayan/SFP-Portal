// API utility functions with automatic cookie/JWT handling
// Credentials: include ensures auth_token cookie is sent with every request

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Default fetch options that include credentials for cookies
 * credentials: 'include' makes browser send cookies with cross-site requests
 */
const defaultOptions: RequestInit = {
  credentials: "include", // Always include cookies in requests
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 * Wrapper around fetch that automatically includes credentials and merges headers
 */
export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  // Support both relative and absolute URLs
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  // Merge options: defaults first, then override with caller options
  return fetch(url, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers, // Caller headers override defaults
    },
  });
}

/**
 * GET request
 */
export async function apiGet(endpoint: string): Promise<any> {
  const response = await apiFetch(endpoint, { method: "GET" });
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
}

/**
 * POST request
 */
export async function apiPost(endpoint: string, data?: any): Promise<any> {
  const response = await apiFetch(endpoint, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(error.message || "API Error");
  }
  return response.json();
}

/**
 * PUT request
 */
export async function apiPut(endpoint: string, data?: any): Promise<any> {
  const response = await apiFetch(endpoint, {
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(error.message || "API Error");
  }
  return response.json();
}

/**
 * DELETE request
 */
export async function apiDelete(endpoint: string): Promise<any> {
  const response = await apiFetch(endpoint, { method: "DELETE" });
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(error.message || "API Error");
  }
  return response.json();
}

/**
 * PATCH request
 */
export async function apiPatch(endpoint: string, data?: any): Promise<any> {
  const response = await apiFetch(endpoint, {
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(error.message || "API Error");
  }
  return response.json();
}

export { API_BASE_URL };
