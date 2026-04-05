import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Application, JobStatus, JOB_STATUSES } from "../types/job";
import { api } from "../services/api";
import { KanbanColumn } from "../components/KanbanColumn";

export function Dashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<JobStatus>(JOB_STATUSES[0]);
  const [confirmDelete, setConfirmDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetched = await api.getApplications();
      setApplications(fetched);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load applications",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    navigate("/login", { replace: true });
  };

  const requestDeleteApplication = (id: string, title: string) => {
    setConfirmDelete({ id, title });
  };

  const handleDeleteApplication = async (id: string) => {
    try {
      await api.deleteApplication(id);
      setApplications((prev) =>
        prev.filter((application) => application.id !== id),
      );
      setConfirmDelete(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete application",
      );
    }
  };

  const handleStatusChange = async (id: string, newStatus: JobStatus) => {
    try {
      const updated = await api.updateApplicationStatus(id, newStatus);
      setApplications((prev) =>
        prev.map((item) => (item.id === id ? updated : item)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const getAppsByStatus = (status: JobStatus) => {
    return applications.filter((app) => app.status === status);
  };

  const totalJobs = useMemo(() => applications.length, [applications]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl">
          <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-10 text-center shadow-sm shadow-slate-200/40">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
              Loading dashboard
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">
              Pulling your applications...
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Hang tight while we fetch the latest jobs from your account.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl">
          <div className="rounded-[2rem] border border-rose-200 bg-white/90 p-10 text-center shadow-sm shadow-rose-200/40">
            <p className="text-sm uppercase tracking-[0.24em] text-rose-500">
              Something went wrong
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">
              {error}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              There was a problem loading your job board. Try refreshing or
              logging out and signing in again.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={loadApplications}
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Retry
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-2xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-6 rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-sm shadow-slate-200/40 backdrop-blur-sm sm:p-6">
          <div className="flex gap-4 flex-row sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-cyan-500 to-slate-900 text-lg font-bold text-white">
                CS
              </div>
              <div className="hidden sm:block">
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-500">
                  CareerSprint
                </p>
                <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
                  Manage your applications
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={loadApplications}
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 sm:px-5 sm:py-3 sm:text-sm"
              >
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-2xl bg-rose-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-300 sm:px-5 sm:py-3 sm:text-sm"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="mt-4 hidden sm:block">
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              Move roles through your workflow and keep every application
              organized.
            </p>
          </div>
        </header>

        <section className="mb-6 overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40 sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                Overview
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {totalJobs} {totalJobs === 1 ? "job" : "jobs"} in your board
              </p>
            </div>
          </div>
        </section>

        <div className="mb-4 rounded-[1.75rem] bg-white p-3 shadow-sm shadow-slate-200/40 sm:hidden">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {JOB_STATUSES.map((status) => (
              <button
                key={status}
                onClick={() => setActiveStatus(status)}
                className={`whitespace-nowrap rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  activeStatus === status
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/90 p-10 text-center shadow-sm shadow-slate-200/40">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              No jobs yet
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-950">
              Your Kanban board is empty
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Add jobs from the extension or dashboard to begin tracking your
              applications.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {JOB_STATUSES.map((status) => (
              <div
                key={status}
                className={
                  activeStatus !== status ? "hidden sm:block" : "block"
                }
              >
                <KanbanColumn
                  title={status}
                  jobs={getAppsByStatus(status)}
                  onDeleteJob={(id: string) => {
                    const app = applications.find((item) => item.id === id);
                    if (app) {
                      requestDeleteApplication(id, app.job.title);
                    }
                  }}
                  onStatusChange={handleStatusChange}
                  onDropJob={handleStatusChange}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <div className="w-full max-w-xl rounded-[2rem] bg-slate-900 p-7 shadow-2xl shadow-slate-950/40 ring-1 ring-rose-400/20">
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-3xl text-rose-400">
                !
              </div>
              <h2 className="text-2xl font-semibold text-white">
                Confirm delete
              </h2>
              <p className="text-sm leading-6 text-slate-300">
                Are you sure you want to remove &quot;{confirmDelete.title}
                &quot; from your pipeline? This action cannot be undone.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteApplication(confirmDelete.id)}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-400 sm:w-auto"
              >
                Delete application
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
