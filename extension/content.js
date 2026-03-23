// Import site-specific extractors
import { naukriExtractor } from "./extractors/naukri.js";
import { linkedinExtractor } from "./extractors/linkedin.js";
import { hiristExtractor } from "./extractors/hirist.js";
import { defaultExtractor } from "./extractors/default.js";

// Site-specific job data extractors
const extractors = {
  naukri: naukriExtractor,
  linkedin: linkedinExtractor,
  hirist: hiristExtractor,
  default: defaultExtractor,
};

const getSiteExtractor = (hostname) => {
  const host = hostname.toLowerCase();
  if (host.includes("naukri.com")) return extractors.naukri;
  if (host.includes("linkedin.com")) return extractors.linkedin;
  if (host.includes("hirist.com")) return extractors.hirist;
  return extractors.default;
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.action === "EXTRACT_JOB_DATA") {
    try {
      const jobUrl = window.location.href;
      const url = new URL(jobUrl);
      const extractor = getSiteExtractor(url.hostname);

      const title = extractor.title();
      const company = extractor.company();
      const location = extractor.location();
      const salaryMin = extractor.salaryMin ? extractor.salaryMin() : null;
      const salaryMax = extractor.salaryMax ? extractor.salaryMax() : null;
      const description = extractor.description();

      console.log("Extracted job data:", {
        title,
        company,
        location,
        salaryMin,
        salaryMax,
        jobUrl,
        description,
      });

      sendResponse({
        title,
        company,
        location,
        salaryMin,
        salaryMax,
        jobUrl,
        description,
      });
    } catch (err) {
      console.error("Job extraction error:", err);
      sendResponse({ error: err?.message || "Extraction error" });
    }

    return true; // indicate async response possible
  }
});
