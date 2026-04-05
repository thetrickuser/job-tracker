import type { DragEvent } from "react";
import { Application, JobStatus } from "../types/job";
import { JobCard } from "./JobCard";

interface KanbanColumnProps {
  title: JobStatus;
  jobs: Application[];
  onDeleteJob: (id: string) => void;
  onStatusChange?: (id: string, status: JobStatus) => void;
  onDropJob?: (id: string, status: JobStatus) => void;
}

export function KanbanColumn({
  title,
  jobs,
  onDeleteJob,
  onStatusChange,
  onDropJob,
}: KanbanColumnProps) {
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const applicationId = event.dataTransfer.getData("application/id");
    if (!applicationId || !onDropJob) {
      return;
    }
    onDropJob(applicationId, title);
  };

  return (
    <section
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
      className="rounded-[2rem] border border-slate-200 bg-slate-50/90 shadow-sm shadow-slate-200/40"
    >
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4">
        <div>
          <h2 className="text-base font-semibold uppercase tracking-[0.24em] text-slate-900">
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {jobs.length} job{jobs.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="inline-flex h-10 min-w-[2.5rem] items-center justify-center rounded-2xl bg-slate-100 px-3 text-sm font-semibold text-slate-700">
          {jobs.length}
        </div>
      </div>

      <div className="space-y-4 px-4 py-5">
        {jobs.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white/80 p-6 text-center text-sm text-slate-500">
            No jobs in this stage yet.
          </div>
        ) : (
          jobs.map((app) => (
            <JobCard
              key={app.id}
              application={app}
              onDelete={onDeleteJob}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </section>
  );
}
