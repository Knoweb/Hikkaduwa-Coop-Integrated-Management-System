import api from "../api/axiosConfig";

export interface AuthResponse {
  token: string;
  role: string;
  username: string;
}

const normalizeRole = (role: string): string => {
  if (!role) return "UNKNOWN_ROLE";

  const cleanRole = role.trim().toUpperCase();

  if (cleanRole.startsWith("ROLE_")) {
    return cleanRole;
  }

  return `ROLE_${cleanRole}`;
};

const decodeJwtPayload = (token: string): any => {
  const base64Url = token.split(".")[1];

  if (!base64Url) {
    throw new Error("Invalid JWT token");
  }

  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const paddedBase64 = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "="
  );

  const jsonPayload = decodeURIComponent(
    atob(paddedBase64)
      .split("")
      .map((char) => {
        return "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};

const extractRoleFromToken = (token: string): string => {
  try {
    const payload = decodeJwtPayload(token);

    const rawRole =
      payload.role ||
      payload.roles?.[0] ||
      payload.authorities?.[0]?.authority ||
      payload.authorities?.[0] ||
      "UNKNOWN_ROLE";

    return normalizeRole(String(rawRole));
  } catch (error) {
    console.error("Failed to parse JWT token:", error);
    return "UNKNOWN_ROLE";
  }
};

export const loginUser = async (
  username: string,
  password: string
): Promise<AuthResponse> => {
  console.log("DEBUG: Sending request with:", { username, password });

  try {
    const response = await api.post<string>("/auth/token", {
      username,
      password,
    });

    const token = response.data;

    if (!token) {
      throw new Error("Token not received from auth service");
    }

    const actualRole = extractRoleFromToken(token);

    localStorage.setItem("jwt_token", token);
    localStorage.setItem("user_role", actualRole);
    localStorage.setItem("username", username);

    return {
      token,
      role: actualRole,
      username,
    };
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const logoutUser = (): void => {
  localStorage.removeItem("jwt_token");
  localStorage.removeItem("user_role");
  localStorage.removeItem("username");
};