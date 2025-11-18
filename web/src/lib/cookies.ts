// Cookie utility functions for the frontend

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

/**
 * Parse user info from cookie
 */
export function getUserFromCookie(): any | null {
  const userInfoCookie = getCookie('user_info');
  console.log('🍪 Raw user_info cookie:', userInfoCookie);
  
  if (!userInfoCookie) {
    console.log('❌ No user_info cookie found');
    return null;
  }
  
  try {
    const decoded = decodeURIComponent(userInfoCookie);
    console.log('📝 Decoded cookie:', decoded);
    const parsed = JSON.parse(decoded);
    console.log('✅ Parsed user:', parsed);
    return parsed;
  } catch (error) {
    console.error('❌ Failed to parse user info from cookie:', error);
    return null;
  }
}

/**
 * Delete a cookie by name
 */
export function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/**
 * Check if user is authenticated by checking for auth cookie
 */
export function isAuthenticated(): boolean {
  const authToken = getCookie('auth_token');
  const userInfo = getCookie('user_info');
  return !!(authToken && userInfo);
}
