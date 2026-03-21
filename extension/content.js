const extractText = () => {
  const fullText = document.body ? document.body.innerText : '';
  return fullText.trim().slice(0, 2000);
};

const extractTitle = () => {
  const h1 = document.querySelector('h1');
  if (h1 && h1.innerText.trim()) {
    return h1.innerText.trim();
  }

  const docTitle = document.title;
  return docTitle ? docTitle.trim() : '';
};

const extractCompany = () => {
  const selectors = [
    '[data-test-company-name]',
    '.company',
    '.company-name',
    '[class*="company"]',
    '[id*="company"]'
  ];

  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el && el.textContent && el.textContent.trim()) {
      return el.textContent.trim();
    }
  }

  // fallback from metadata or closest text heuristics
  const metas = Array.from(document.querySelectorAll('meta[name="author"],meta[property="og:site_name"],meta[name="og:site_name"]'));
  if (metas.length) {
    const m = metas[0].getAttribute('content');
    if (m) return m.trim();
  }

  return '';
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.action === 'EXTRACT_JOB_DATA') {
    try {
      const jobUrl = window.location.href;
      const title = extractTitle();
      const company = extractCompany();
      const description = extractText();

      sendResponse({ title, company, jobUrl, description });
    } catch (err) {
      sendResponse({ error: err?.message || 'Extraction error' });
    }

    return true; // indicate async response possible
  }
});
