// Default job data extractor for unknown sites
export const defaultExtractor = {
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
      "article",
      "main",
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
