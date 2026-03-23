const statusEl = document.getElementById("status");
const saveButton = document.getElementById("saveJobBtn");

const getHostSource = (hostname) => {
  if (!hostname) return "OTHER";
  const host = hostname.toLowerCase();
  if (host.includes("linkedin.com")) return "LINKEDIN";
  if (host.includes("naukri.com")) return "NAUKRI";
  if (host.includes("hirist.com")) return "HIRIST";
  return "OTHER";
};

const setStatus = (message, isError = false) => {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.style.color = isError ? "red" : "green";
};

const saveJob = async () => {
  setStatus("Extracting job data...");

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab || !tab.id || !tab.url) {
      throw new Error("No active tab or URL found");
    }

    const response = await chrome.tabs.sendMessage(tab.id, {
      action: "EXTRACT_JOB_DATA",
    });
    if (!response || response.error) {
      throw new Error(response?.error || "Job data extraction failed");
    }

    const {
      title,
      company,
      location,
      salaryMin,
      salaryMax,
      jobUrl,
      description,
    } = response;
    const source = getHostSource(new URL(jobUrl).hostname);

    const payload = {
      title,
      company,
      jobUrl,
      source,
      location,
      salaryMin,
      salaryMax,
      description,
    };

    setStatus("Sending job to API...");

    const apiResp = await fetch(
      "https://job-tracker-backend-a5bm.onrender.com/api/jobs",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!apiResp.ok) {
      const body = await apiResp.text();
      throw new Error(`API responded with status ${apiResp.status}: ${body}`);
    }

    setStatus("Saved ✓");
  } catch (error) {
    console.error("Save job failed", error);
    setStatus(`Error: ${error.message || error}`, true);
  }
};

if (saveButton) {
  saveButton.addEventListener("click", saveJob);
}
