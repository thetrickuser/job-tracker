// Site-specific job data extractors
const extractors = {
  naukri: {
    title: () => {
      const titleEl = document.querySelector('h1[class*="jd-header-title"]');
      return titleEl ? titleEl.textContent.trim() : "";
    },
    company: () => {
      const companyEl = document.querySelector(
        'div[class*="jd-header-comp-name"] a',
      );
      return companyEl ? companyEl.textContent.trim() : "";
    },
    location: () => {
      const locationEl = document.querySelector('span[class*="jhc__location"]');
      return locationEl ? locationEl.textContent.trim() : "";
    },
    salaryMin: () => {
      const salaryEl = document.querySelector('div[class*="jhc__salary"] span');
      if (!salaryEl) return null;

      const salaryText = salaryEl.textContent.trim();
      // Parse salary like "18-20 Lacs P.A." or "Not Disclosed"
      if (
        salaryText.includes("Not Disclosed") ||
        salaryText.includes("Not disclosed")
      ) {
        return null;
      }

      // Extract numbers from salary text (e.g., "18-20 Lacs P.A." -> [18, 20])
      const numbers = salaryText.match(/\d+/g);
      return numbers && numbers.length > 0 ? parseInt(numbers[0]) : null;
    },
    salaryMax: () => {
      const salaryEl = document.querySelector('div[class*="jhc__salary"] span');
      if (!salaryEl) return null;

      const salaryText = salaryEl.textContent.trim();
      // Parse salary like "18-20 Lacs P.A." or "Not Disclosed"
      if (
        salaryText.includes("Not Disclosed") ||
        salaryText.includes("Not disclosed")
      ) {
        return null;
      }

      // Extract numbers from salary text (e.g., "18-20 Lacs P.A." -> [18, 20])
      const numbers = salaryText.match(/\d+/g);
      return numbers && numbers.length > 1
        ? parseInt(numbers[1])
        : numbers && numbers.length === 1
          ? parseInt(numbers[0])
          : null;
    },
    description: () => {
      // Get the main job description content (excluding job highlights)
      const descEl = document.querySelector(
        'div[class*="JDC__dang-inner-html"]',
      );
      return descEl ? descEl.textContent.trim() : "";
    },
  },

  linkedin: {
    title: () => {
      const titleEl = document.querySelector(
        'h1[data-test-id="job-title"], h1[class*="job-title"], h1[class*="top-card-layout__title"]',
      );
      return titleEl ? titleEl.textContent.trim() : "";
    },
    company: () => {
      const companyEl = document.querySelector(
        'a[data-test-id="company-name"], span[class*="company-name"], a.ember-view span[dir="ltr"]',
      );
      return companyEl ? companyEl.textContent.trim() : "";
    },
    location: () => {
      const locationEl = document.querySelector(
        'span[data-test-id="job-location"], span[class*="job-location"]',
      );
      return locationEl ? locationEl.textContent.trim() : "";
    },
    salaryMin: () => null, // TODO: Implement LinkedIn salary extraction
    salaryMax: () => null, // TODO: Implement LinkedIn salary extraction
    description: () => {
      const descEl = document.querySelector(
        'div[data-test-id="job-description"], div[class*="job-description"], div[class*="description"]',
      );
      return descEl ? descEl.textContent.trim().slice(0, 2000) : "";
    },
  },

  hirist: {
    title: () => {
      const titleEl = document.querySelector(
        "h1[class*='job-title'], h1[data-job-title]",
      );
      return titleEl ? titleEl.textContent.trim() : "";
    },
    company: () => {
      const companyEl = document.querySelector(
        "span[class*='company-name'], a[class*='company-link'], [data-company-name]",
      );
      return companyEl ? companyEl.textContent.trim() : "";
    },
    location: () => {
      const locationEl = document.querySelector(
        "span[class*='location'], [data-location]",
      );
      return locationEl ? locationEl.textContent.trim() : "";
    },
    salaryMin: () => null, // TODO: Implement Hirist salary extraction
    salaryMax: () => null, // TODO: Implement Hirist salary extraction
    description: () => {
      const descEl = document.querySelector(
        "div[class*='job-description'], [data-job-description]",
      );
      return descEl ? descEl.textContent.trim().slice(0, 2000) : "";
    },
  },

  default: {
    title: () => {
      const h1 = document.querySelector("h1");
      if (h1 && h1.innerText.trim()) {
        return h1.innerText.trim();
      }
      return document.title ? document.title.trim() : "";
    },
    company: () => {
      const selectors = [
        "[data-test-company-name]",
        ".company",
        ".company-name",
        '[class*="company"]',
        '[id*="company"]',
      ];

      for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el && el.textContent && el.textContent.trim()) {
          return el.textContent.trim();
        }
      }

      // fallback from metadata
      const metas = Array.from(
        document.querySelectorAll(
          'meta[name="author"],meta[property="og:site_name"]',
        ),
      );
      if (metas.length) {
        const m = metas[0].getAttribute("content");
        if (m) return m.trim();
      }

      return "";
    },
    location: () => {
      const selectors = [
        "[data-location]",
        ".location",
        '[class*="location"]',
        '[id*="location"]',
      ];

      for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el && el.textContent && el.textContent.trim()) {
          return el.textContent.trim();
        }
      }
      return "";
    },
    salaryMin: () => {
      // Try common salary selectors
      const selectors = [
        '[class*="salary"] span',
        "[data-salary] span",
        ".salary span",
        '[id*="salary"] span',
      ];

      for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el && el.textContent && el.textContent.trim()) {
          const salaryText = el.textContent.trim();
          if (
            salaryText.includes("Not Disclosed") ||
            salaryText.includes("Not disclosed")
          ) {
            return null;
          }
          const numbers = salaryText.match(/\d+/g);
          return numbers && numbers.length > 0 ? parseInt(numbers[0]) : null;
        }
      }
      return null;
    },
    salaryMax: () => {
      // Try common salary selectors
      const selectors = [
        '[class*="salary"] span',
        "[data-salary] span",
        ".salary span",
        '[id*="salary"] span',
      ];

      for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el && el.textContent && el.textContent.trim()) {
          const salaryText = el.textContent.trim();
          if (
            salaryText.includes("Not Disclosed") ||
            salaryText.includes("Not disclosed")
          ) {
            return null;
          }
          const numbers = salaryText.match(/\d+/g);
          return numbers && numbers.length > 1
            ? parseInt(numbers[1])
            : numbers && numbers.length === 1
              ? parseInt(numbers[0])
              : null;
        }
      }
      return null;
    },
    description: () => {
      const fullText = document.body ? document.body.innerText : "";
      return fullText.trim().slice(0, 2000);
    },
  },
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
