import { getAuthStatus, logoutCustomer } from "./api";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
}

// Check authentication status by calling the backend
export const checkAuthStatus = async (): Promise<{
  authenticated: boolean;
  user?: User;
}> => {
  try {
    const result = await getAuthStatus();
    return result;
  } catch (error) {
    return { authenticated: false };
  }
};

// For backward compatibility - now checks with server
export const isAuthenticated = async (): Promise<boolean> => {
  const status = await checkAuthStatus();
  return status.authenticated;
};

// Get user from server
export const getUser = async (): Promise<User | null> => {
  const status = await checkAuthStatus();
  return status.user || null;
};

// Logout by calling the backend
export const logout = async (): Promise<void> => {
  try {
    await logoutCustomer();
  } catch (error) {
    console.error("Logout error:", error);
    // Even if the server call fails, we should still redirect
  }
};

// For API calls - cookies are automatically included
export const getAuthHeaders = (): Record<string, string> => {
  return {
    "Content-Type": "application/json",
  };
};
