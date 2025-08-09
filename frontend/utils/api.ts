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
