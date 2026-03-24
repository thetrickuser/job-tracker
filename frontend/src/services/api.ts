import { Application, Job, JobStatus } from "../types/job";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
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
    const response = await fetch(`${API_BASE_URL}/api/applications`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch applications");
    }
    return response.json();
  },

  async createApplication(job: Job): Promise<Application> {
    const response = await fetch(`${API_BASE_URL}/api/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
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
    const response = await fetch(`${API_BASE_URL}/api/applications/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error("Failed to update application status");
    }

    return response.json();
  },

  async deleteApplication(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/applications/${id}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete application");
    }
  },
};
