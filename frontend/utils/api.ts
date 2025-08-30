import { getBaseURL } from "./getBaseURL";

export interface RegisterCustomerData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  date_of_birth?: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  preferred_language?: string;
  marketing_consent?: boolean;
  referral_code?: string;
  referred_by_code?: string;
}

export interface RegisterResponse {
  message: string;
  user_id: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    user_type: string;
  };
}

export const registerCustomer = async (
  data: RegisterCustomerData
): Promise<RegisterResponse> => {
  const baseURL = getBaseURL();

  const response = await fetch(`${baseURL}/customers/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Registration failed");
  }

  return response.json();
};

export const loginCustomer = async (
  data: LoginData
): Promise<LoginResponse> => {
  const baseURL = getBaseURL();

  const response = await fetch(`${baseURL}/customers/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies in the request
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Login failed");
  }

  return response.json();
};

export const logoutCustomer = async (): Promise<{ message: string }> => {
  const baseURL = getBaseURL();

  const response = await fetch(`${baseURL}/customers/logout`, {
    method: "POST",
    credentials: "include", // Include cookies in the request
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Logout failed");
  }

  return response.json();
};

export const getAuthStatus = async (): Promise<{
  authenticated: boolean;
  user?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    user_type: string;
  };
}> => {
  const baseURL = getBaseURL();

  const response = await fetch(`${baseURL}/customers/auth-status`, {
    method: "GET",
    credentials: "include", // Include cookies in the request
  });

  if (!response.ok) {
    return { authenticated: false };
  }

  return response.json();
};
