// Site-specific job data extractors

// Naukri job data extractor
const naukriExtractor = {
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
    const numbers = salaryText.match(/\d+/g);
    return numbers && numbers.length > 0 ? parseInt(numbers[0]) : null;
  },
  salaryMax: () => {
    const salaryEl = document.querySelector('div[class*="jhc__salary"] span');
    if (!salaryEl) return null;
    const salaryText = salaryEl.textContent.trim();
    const numbers = salaryText.match(/\d+/g);
    return numbers && numbers.length > 1 ? parseInt(numbers[1]) : null;
  },
  description: () => {
    const descEl = document.querySelector('div[class*="jhc__description"]');
    return descEl ? descEl.textContent.trim().slice(0, 2000) : "";
  },
};

// LinkedIn job data extractor
const linkedinExtractor = {
  title: () => {
    const titleEl = document.querySelector("h1.t-24.t-bold.inline");
    return titleEl ? titleEl.textContent.trim() : "";
  },
  company: () => {
    const companyEl = document.querySelector(
      "div.job-details-jobs-unified-top-card__company-name a",
    );
    return companyEl ? companyEl.textContent.trim() : "";
  },
  location: () => {
    const locationEl = document.querySelector(
      "span.tvm__text.tvm__text--low-emphasis",
    );
    if (locationEl) {
      // Extract location from the first span that contains location info
      const text = locationEl.textContent.trim();
      // Location is usually the first part before the dot
      const parts = text.split("·");
      return parts[0].trim();
    }
    return "";
  },
  salaryMin: () => {
    // Try to extract from the salary div first
    const salaryDiv = document.getElementById("SALARY");
    if (salaryDiv && salaryDiv.textContent.trim()) {
      const salaryText = salaryDiv.textContent.trim();
      // Parse salary text (e.g., "₹5,00,000 - ₹8,00,000 a year" -> extract numbers)
      const numbers = salaryText.match(/\d+/g);
      return numbers && numbers.length > 0 ? parseInt(numbers[0]) : null;
    }
    // Fallback: try to find salary in description
    const descEl = document.querySelector(
      "div.jobs-description__content.jobs-description-content",
    );
    if (descEl) {
      const descText = descEl.textContent.toLowerCase();
      // Look for patterns like "salary", "compensation", etc.
      if (
        descText.includes("salary") ||
        descText.includes("compensation") ||
        descText.includes("pay")
      ) {
        // Simple extraction - look for currency symbols followed by numbers
        const salaryMatch = descText.match(
          /[\$₹€£]?\s*\d+(?:,\d+)*(?:\.\d+)?(?:\s*-\s*[\$₹€£]?\s*\d+(?:,\d+)*(?:\.\d+)?)?/g,
        );
        if (salaryMatch && salaryMatch.length > 0) {
          const numbers = salaryMatch[0].match(/\d+/g);
          return numbers && numbers.length > 0 ? parseInt(numbers[0]) : null;
        }
      }
    }
    return null;
  },
  salaryMax: () => {
    // Try to extract from the salary div first
    const salaryDiv = document.getElementById("SALARY");
    if (salaryDiv && salaryDiv.textContent.trim()) {
      const salaryText = salaryDiv.textContent.trim();
      // Parse salary text (e.g., "₹5,00,000 - ₹8,00,000 a year" -> extract numbers)
      const numbers = salaryText.match(/\d+/g);
      return numbers && numbers.length > 1 ? parseInt(numbers[1]) : null;
    }
    // Fallback: try to find salary in description
    const descEl = document.querySelector(
      "div.jobs-description__content.jobs-description-content",
    );
    if (descEl) {
      const descText = descEl.textContent.toLowerCase();
      // Look for patterns like "salary", "compensation", etc.
      if (
        descText.includes("salary") ||
        descText.includes("compensation") ||
        descText.includes("pay")
      ) {
        // Simple extraction - look for currency symbols followed by numbers
        const salaryMatch = descText.match(
          /[\$₹€£]?\s*\d+(?:,\d+)*(?:\.\d+)?(?:\s*-\s*[\$₹€£]?\s*\d+(?:,\d+)*(?:\.\d+)?)?/g,
        );
        if (salaryMatch && salaryMatch.length > 0) {
          const numbers = salaryMatch[0].match(/\d+/g);
          return numbers && numbers.length > 1 ? parseInt(numbers[1]) : null;
        }
      }
    }
    return null;
  },
  description: () => {
    const descEl = document.querySelector(
      "div.jobs-description__content.jobs-description-content",
    );
    return descEl ? descEl.textContent.trim().slice(0, 2000) : "";
  },
};

// Hirist job data extractor
const hiristExtractor = {
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
};

// Default job data extractor for unknown sites
const defaultExtractor = {
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
      if (el && el.textContent.trim()) {
        return el.textContent.trim();
      }
    }
    return "";
  },
  location: () => {
    const selectors = [
      "[data-test-location]",
      ".location",
      '[class*="location"]',
      '[id*="location"]',
    ];
    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el && el.textContent.trim()) {
        return el.textContent.trim();
      }
    }
    return "";
  },
  salaryMin: () => null,
  salaryMax: () => null,
  description: () => {
    const selectors = [
      "[data-test-description]",
      ".description",
      ".job-description",
      '[class*="description"]',
      '[id*="description"]',
      "main",
      "article",
    ];
    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el && el.textContent.trim()) {
        return el.textContent.trim().slice(0, 2000);
      }
    }
    return "";
  },
};

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
