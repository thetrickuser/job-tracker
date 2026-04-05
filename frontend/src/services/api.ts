import { Application, Job, JobStatus } from "../types/job";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const getToken = (): string | null => localStorage.getItem("token");
const getRefreshToken = (): string | null => localStorage.getItem("refreshToken");

const setSession = (token: string, refreshToken: string): void => {
  localStorage.setItem("token", token);
  localStorage.setItem("refreshToken", refreshToken);
};

const clearSession = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");
};

const getAuthHeaders = (): Record<string, string> => {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const refreshAccessToken = async (): Promise<void> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearSession();
    throw new Error("No refresh token available");
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    clearSession();
    throw new Error("Refresh token expired or invalid");
  }

  const data = await response.json();
  if (!data.token || !data.refreshToken) {
    clearSession();
    throw new Error("Invalid refresh token response");
  }

  setSession(data.token, data.refreshToken);
};

const request = async (
  url: string,
  options: RequestInit = {},
  retry = true,
): Promise<Response> => {
  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      ...getAuthHeaders(),
    },
  };

  const response = await fetch(url, requestOptions);

  if (response.status === 401 && retry) {
    await refreshAccessToken();
    return request(url, options, false);
  }

  return response;
};

export const api = {
  async login(
    email: string,
    password: string,
  ): Promise<{ token: string; refreshToken: string; email: string; name: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    return response.json();
  },

  async register(
    email: string,
    password: string,
    name: string,
  ): Promise<{ token: string; refreshToken: string; email: string; name: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    return response.json();
  },

  async getApplications(): Promise<Application[]> {
    const response = await request(`${API_BASE_URL}/api/applications`);
    if (!response.ok) {
      throw new Error("Failed to fetch applications");
    }
    return response.json();
  },

  async createApplication(job: Job): Promise<Application> {
    const response = await request(`${API_BASE_URL}/api/applications`, {
      method: "POST",
      body: JSON.stringify({
        title: job.title,
        company: job.company,
        jobUrl: job.jobUrl,
        source: job.source,
        location: job.location,
        description: job.description,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create application");
    }
    return response.json();
  },

  async updateApplicationStatus(
    id: string,
    status: JobStatus,
  ): Promise<Application> {
    const response = await request(`${API_BASE_URL}/api/applications/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error("Failed to update application status");
    }

    return response.json();
  },

  async deleteApplication(id: string): Promise<void> {
    const response = await request(`${API_BASE_URL}/api/applications/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete application");
    }
  },

  logout(): void {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      }).catch(() => {
        console.log("Backend logout failed, but client logout will proceed");
      });
    }
    clearSession();
  },
};
