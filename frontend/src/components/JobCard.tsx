import { Job, JobStatus, JOB_STATUSES } from "../types/job";

interface JobCardProps {
  job: Job;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, status: JobStatus) => void;
}

export function JobCard({ job, onDelete, onStatusChange }: JobCardProps) {
  const handleOpenJob = () => {
    window.open(job.jobUrl, "_blank");
  };

  const handleStatusChange = (newStatus: JobStatus) => {
    if (onStatusChange) {
      onStatusChange(job.id, newStatus);
    }
  };

  return (
    <div className="job-card">
      <div className="job-card-header">
        <h3 className="job-title">{job.title}</h3>
        <button
          className="delete-btn"
          onClick={() => onDelete(job.id)}
          title="Delete job"
        >
          ×
        </button>
      </div>

      <div className="job-company">{job.company}</div>

      <div className="job-meta">
        <span className="job-source">{job.source}</span>
        {job.location && <span className="job-location">• {job.location}</span>}
      </div>

      {job.description && (
        <div className="job-description">
          {job.description.length > 100
            ? `${job.description.substring(0, 100)}...`
            : job.description}
        </div>
      )}

      <div className="job-actions">
        <button className="view-job-btn" onClick={handleOpenJob}>
          View Job
        </button>

        {onStatusChange && (
          <select
            className="status-select"
            value={job.status || "SAVED"}
            onChange={(e) => handleStatusChange(e.target.value as JobStatus)}
          >
            {JOB_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
