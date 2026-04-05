import type { DragEvent } from "react";
import { Application, JobStatus, JOB_STATUSES } from "../types/job";

const sourceColors: Record<string, string> = {
  LINKEDIN: "bg-sky-100 text-sky-800",
  NAUKRI: "bg-amber-100 text-amber-800",
  HIRIST: "bg-violet-100 text-violet-800",
  OTHER: "bg-slate-100 text-slate-700",
};

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

  const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("application/id", application.id);
    event.dataTransfer.effectAllowed = "move";
  };

  const badgeClass = sourceColors[application.job.source] ?? sourceColors.OTHER;

  return (
    <article
      draggable
      onDragStart={handleDragStart}
      className="group rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate max-w-full text-lg font-semibold text-slate-950">
            {application.job.title}
          </h3>
          <p className="mt-2 text-sm font-medium text-slate-600">
            {application.job.company}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onDelete(application.id)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-600 transition hover:border-rose-300 hover:bg-rose-100 hover:text-rose-700"
          title="Delete application"
        >
          ×
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span
          className={`inline-flex rounded-full px-3 py-1 font-semibold ${badgeClass}`}
        >
          {application.job.source}
        </span>
        {application.job.location && (
          <span className="text-slate-500">{application.job.location}</span>
        )}
      </div>

      {application.job.description && (
        <p className="mt-4 text-sm leading-6 text-slate-600">
          {application.job.description.length > 140
            ? `${application.job.description.substring(0, 140)}...`
            : application.job.description}
        </p>
      )}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handleOpenJob}
          className="inline-flex justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Open Job
        </button>

        {onStatusChange && (
          <select
            value={application.status}
            onChange={(e) => handleStatusChange(e.target.value as JobStatus)}
            className="w-full min-w-0 max-w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 sm:w-auto"
          >
            {JOB_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        )}
      </div>
    </article>
  );
}
