export interface Job {
  id: string;
  title: string;
  company: string;
  jobUrl: string;
  source: string;
  location?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  job: Job;
  status: JobStatus;
  appliedAt?: string;
  notes?: string;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

export type JobStatus =
  | "SAVED"
  | "APPLIED"
  | "INTERVIEWING"
  | "OFFER"
  | "REJECTED";

export const JOB_STATUSES: JobStatus[] = [
  "SAVED",
  "APPLIED",
  "INTERVIEWING",
  "OFFER",
  "REJECTED",
];
