// Hirist job data extractor
export const hiristExtractor = {
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
