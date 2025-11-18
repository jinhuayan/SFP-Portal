// API utility functions with automatic cookie handling

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Default fetch options that include credentials for cookies
 */
const defaultOptions: RequestInit = {
  credentials: "include", // Always include cookies
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 * Wrapper around fetch that automatically includes credentials
 */
export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  return fetch(url, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
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
