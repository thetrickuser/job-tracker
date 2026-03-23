import { Job, JobStatus } from "../types/job";
import { JobCard } from "./JobCard";

interface KanbanColumnProps {
  title: JobStatus;
  jobs: Job[];
  onDeleteJob: (id: string) => void;
  onStatusChange?: (id: string, status: JobStatus) => void;
}

export function KanbanColumn({
  title,
  jobs,
  onDeleteJob,
  onStatusChange,
}: KanbanColumnProps) {
  return (
    <div className="kanban-column">
      <div className="column-header">
        <h2 className="column-title">{title}</h2>
        <span className="job-count">{jobs.length}</span>
      </div>

      <div className="column-content">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onDelete={onDeleteJob}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </div>
  );
}
