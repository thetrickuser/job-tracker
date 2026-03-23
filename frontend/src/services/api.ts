import { Job } from "../types/job";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const api = {
  async getJobs(): Promise<Job[]> {
    const response = await fetch(`${API_BASE_URL}/api/jobs`);
    if (!response.ok) {
      throw new Error("Failed to fetch jobs");
    }
    return response.json();
  },

  async deleteJob(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete job");
    }
  },

  // TODO: Implement when backend supports status updates
  // async updateJobStatus(id: string, status: JobStatus): Promise<Job> {
  //   const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
  //     method: 'PATCH',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ status }),
  //   });
  //   if (!response.ok) {
  //     throw new Error('Failed to update job status');
  //   }
  //   return response.json();
  // },
};
