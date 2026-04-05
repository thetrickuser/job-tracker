import { Application, Job, JobStatus } from "../types/job";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const getToken = (): string | null => localStorage.getItem("token");

const clearSession = (): void => {
  localStorage.removeItem("token");
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

const request = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      ...getAuthHeaders(),
    },
  };

  const response = await fetch(url, requestOptions);

  return response;
};

export const api = {
  async login(
    email: string,
    password: string,
  ): Promise<{ token: string; email: string; name: string }> {
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
  ): Promise<{ token: string; email: string; name: string }> {
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
    clearSession();
  },
};
