// LinkedIn job data extractor
export const linkedinExtractor = {
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
        if (salaryMatch) {
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
      return numbers && numbers.length > 1
        ? parseInt(numbers[1])
        : numbers && numbers.length === 1
          ? parseInt(numbers[0])
          : null;
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
        if (salaryMatch) {
          const numbers = salaryMatch[0].match(/\d+/g);
          return numbers && numbers.length > 1
            ? parseInt(numbers[1])
            : numbers && numbers.length === 1
              ? parseInt(numbers[0])
              : null;
        }
      }
    }
    return null;
  },
  description: () => {
    const descEl = document.querySelector(
      "div.jobs-description__content.jobs-description-content span",
    );
    return descEl ? descEl.textContent.trim().slice(0, 2000) : "";
  },
};
