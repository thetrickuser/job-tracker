// ============================================================================
// UI Elements
// ============================================================================

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const loggedInSection = document.getElementById("loggedInSection");
const saveJobBtn = document.getElementById("saveJobBtn");
const logoutBtn = document.getElementById("logoutBtn");
const statusEl = document.getElementById("status");

// ============================================================================
// API Configuration
// ============================================================================

const API_BASE_URL = "http://localhost:8080";

// ============================================================================
// Status Message Handler
// ============================================================================

const setStatus = (message, type = "loading") => {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.className = type; // 'loading', 'error', 'success'
};

const clearStatus = () => {
  if (!statusEl) return;
  statusEl.textContent = "";
  statusEl.className = "";
};

// ============================================================================
// Auth State Management
// ============================================================================

const getToken = () => {
  return new Promise((resolve) => {
    chrome.storage.local.get(["token"], (result) => {
      resolve(result.token || null);
    });
  });
};

const saveToken = (token) => {
  return new Promise((resolve) => {
    chrome.storage.local.set({ token }, () => {
      console.log("Token saved in chrome.storage");
      resolve();
    });
  });
};

const removeToken = () => {
  return new Promise((resolve) => {
    chrome.storage.local.remove(["token"], () => {
      console.log("Token removed from chrome.storage");
      resolve();
    });
  });
};

// ============================================================================
// UI State Management
// ============================================================================

const showLoginForm = () => {
  if (loginForm) loginForm.classList.add("active");
  if (loggedInSection) loggedInSection.style.display = "none";
  if (saveJobBtn) saveJobBtn.classList.remove("active");
  if (logoutBtn) logoutBtn.classList.remove("active");
  clearStatus();
};

const showLoggedInUI = () => {
  if (loginForm) loginForm.classList.remove("active");
  if (loggedInSection) loggedInSection.style.display = "block";
  if (saveJobBtn) saveJobBtn.classList.add("active");
  if (logoutBtn) logoutBtn.classList.add("active");
  clearStatus();
};

// ============================================================================
// Auth Flows
// ============================================================================

const handleLogin = async (event) => {
  event.preventDefault();
  setStatus("Logging in...", "loading");

  try {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      setStatus("Please enter email and password", "error");
      return;
    }

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `Login failed: ${response.status} - ${errorData || "Unknown error"}`,
      );
    }

    const data = await response.json();
    if (!data.token) {
      throw new Error("No token in response");
    }

    // Save token to chrome storage
    await saveToken(data.token);

    // Clear form and show logged-in UI
    emailInput.value = "";
    passwordInput.value = "";
    setStatus("Logged in successfully!", "success");

    // After a short delay, show the logged-in UI
    setTimeout(() => {
      showLoggedInUI();
    }, 500);
  } catch (error) {
    console.error("Login error:", error);
    setStatus(`Error: ${error.message || error}`, "error");
  }
};

const handleLogout = async () => {
  try {
    await removeToken();
    setStatus("Logged out", "success");
    setTimeout(() => {
      showLoginForm();
    }, 500);
  } catch (error) {
    console.error("Logout error:", error);
    setStatus(`Error: ${error.message || error}`, "error");
  }
};

// ============================================================================
// Job Extraction & Saving
// ============================================================================

const getHostSource = (hostname) => {
  if (!hostname) return "OTHER";
  const host = hostname.toLowerCase();
  if (host.includes("linkedin.com")) return "LINKEDIN";
  if (host.includes("naukri.com")) return "NAUKRI";
  if (host.includes("hirist.com")) return "HIRIST";
  return "OTHER";
};

const saveJob = async () => {
  setStatus("Extracting job data...", "loading");

  try {
    // Get active tab
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab || !tab.id || !tab.url) {
      throw new Error("No active tab or URL found");
    }

    // Extract job data from content script
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

    setStatus("Sending job to API...", "loading");

    // Get token from storage
    const token = await getToken();
    if (!token) {
      throw new Error("No authentication token found. Please log in.");
    }

    // Call backend API with token
    const apiResp = await fetch(`${API_BASE_URL}/api/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!apiResp.ok) {
      const body = await apiResp.text();
      throw new Error(`API error ${apiResp.status}: ${body}`);
    }

    setStatus("✓ Job saved successfully!", "success");
  } catch (error) {
    console.error("Save job failed:", error);
    setStatus(`Error: ${error.message || error}`, "error");
  }
};

// ============================================================================
// Initialization
// ============================================================================

const initializeUI = async () => {
  try {
    const token = await getToken();

    if (token) {
      showLoggedInUI();
    } else {
      showLoginForm();
    }
  } catch (error) {
    console.error("Initialization error:", error);
    showLoginForm();
  }
};

// ============================================================================
// Event Listeners
// ============================================================================

if (loginForm) {
  loginForm.addEventListener("submit", handleLogin);
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", handleLogout);
}

if (saveJobBtn) {
  saveJobBtn.addEventListener("click", saveJob);
}

// Initialize on popup open
initializeUI();
