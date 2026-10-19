// src/services/newsServices.js

export async function fetchAINews() {
  const nonce =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  const url = `/api/news?refresh=${Date.now()}-${nonce}`;

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Cache-Control": "no-cache",
    },
  });

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error(
      "News endpoint returned non-JSON content. If deploying on Netlify, ensure netlify/functions/news.mjs is active."
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error || `News request failed with status ${response.status}`
    );
  }

  if (!Array.isArray(data.articles)) {
    throw new Error("Invalid news response received from server.");
  }

  return data.articles;
}
