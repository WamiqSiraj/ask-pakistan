import { getNewsArticles } from "../../src/server/newsApi.js";

const json = (status, payload) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });

export default async (req) => {
  if (req.method !== "GET") {
    return json(405, { error: "Method not allowed" });
  }

  try {
    const url = new URL(req.url);
    const forceRefresh =
      url.searchParams.has("force") || url.searchParams.has("refresh");
    const result = await getNewsArticles(forceRefresh);
    return json(200, result);
  } catch (error) {
    console.error("News Netlify Function error:", error);
    return json(500, {
      error: "Unable to retrieve government news.",
    });
  }
};

export const config = { path: ["/api/news"] };
