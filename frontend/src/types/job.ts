export interface Job {
  id: string;
  title: string;
  company: string;
  jobUrl: string;
  source: string;
  location?: string;
  description?: string;
  createdAt: string;
  status?: JobStatus;
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
