
export async function fetchAINews() {
  const url = `/api/news?refresh=${Date.now()}-${crypto.randomUUID()}`;

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Cache-Control": "no-cache",
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error || `News request failed (${response.status})`
    );
  }

  if (!Array.isArray(data.articles)) {
    throw new Error("Invalid news response from server.");
  }

  return data.articles;
}
