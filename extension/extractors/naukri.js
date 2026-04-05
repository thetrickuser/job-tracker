// Naukri job data extractor
export const naukriExtractor = {
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
    const descEl = document.querySelector('div[class*="JDC__dang-inner-html"]');
    return descEl ? descEl.textContent.trim() : "";
  },
};
