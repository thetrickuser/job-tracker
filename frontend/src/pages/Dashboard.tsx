import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Application, JobStatus, JOB_STATUSES } from "../types/job";
import { api } from "../services/api";
import { KanbanColumn } from "../components/KanbanColumn";

export function Dashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const handleDeleteApplication = async (id: string) => {
    try {
      await api.deleteApplication(id);
      setApplications((prev) =>
        prev.filter((application) => application.id !== id),
      );
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

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading applications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={loadApplications}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Job Tracker</h1>
        <div className="header-actions">
          <button onClick={loadApplications} className="refresh-btn">
            Refresh
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="kanban-board">
        {JOB_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            title={status}
            jobs={getAppsByStatus(status)}
            onDeleteJob={handleDeleteApplication}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </div>
  );
}
