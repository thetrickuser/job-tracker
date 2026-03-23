import { useState, useEffect } from "react";
import { Job, JobStatus, JOB_STATUSES } from "../types/job";
import { api } from "../services/api";
import { KanbanColumn } from "../components/KanbanColumn";

export function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedJobs = await api.getJobs();
      setJobs(fetchedJobs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (id: string) => {
    try {
      await api.deleteJob(id);
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete job");
    }
  };

  const handleStatusChange = (id: string, newStatus: JobStatus) => {
    // For now, just update the local state
    // TODO: Implement API call when backend supports status updates
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === id ? { ...job, status: newStatus } : job,
      ),
    );
  };

  const getJobsByStatus = (status: JobStatus) => {
    return jobs.filter((job) => (job.status || "SAVED") === status);
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading jobs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={loadJobs}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Job Tracker</h1>
        <button onClick={loadJobs} className="refresh-btn">
          Refresh
        </button>
      </header>

      <div className="kanban-board">
        {JOB_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            title={status}
            jobs={getJobsByStatus(status)}
            onDeleteJob={handleDeleteJob}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </div>
  );
}
