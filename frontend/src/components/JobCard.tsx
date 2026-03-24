import { Application, JobStatus, JOB_STATUSES } from "../types/job";

interface JobCardProps {
  application: Application;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, status: JobStatus) => void;
}

export function JobCard({
  application,
  onDelete,
  onStatusChange,
}: JobCardProps) {
  const handleOpenJob = () => {
    window.open(application.job.jobUrl, "_blank");
  };

  const handleStatusChange = (newStatus: JobStatus) => {
    if (onStatusChange) {
      onStatusChange(application.id, newStatus);
    }
  };

  return (
    <div className="job-card">
      <div className="job-card-header">
        <h3 className="job-title">{application.job.title}</h3>
        <button
          className="delete-btn"
          onClick={() => onDelete(application.id)}
          title="Delete application"
        >
          ×
        </button>
      </div>

      <div className="job-company">{application.job.company}</div>

      <div className="job-meta">
        <span className="job-source">{application.job.source}</span>
        {application.job.location && (
          <span className="job-location">• {application.job.location}</span>
        )}
      </div>

      {application.job.description && (
        <div className="job-description">
          {application.job.description.length > 100
            ? `${application.job.description.substring(0, 100)}...`
            : application.job.description}
        </div>
      )}

      <div className="job-actions">
        <button className="view-job-btn" onClick={handleOpenJob}>
          View Job
        </button>

        {onStatusChange && (
          <select
            className="status-select"
            value={application.status}
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
