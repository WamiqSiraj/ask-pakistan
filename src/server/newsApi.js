
import * as cheerio from "cheerio";

const SOURCES = [
  {
    name: "Press Information Department",
    url: "https://www.pid.gov.pk/press",
    domain: "pid.gov.pk",
  },
];

function clean(text = "") {
  return String(text).replace(/\s+/g, " ").trim();
}

function absoluteUrl(value, base) {
  try {
    if (!value) return null;
    const url = new URL(value, base);

    if (url.protocol !== "https:") return null;

    return url.href;
  } catch {
    return null;
  }
}

function parseDate(text) {
  const match = text.match(
    /\b(20\d{2}-\d{2}-\d{2})\s*,?\s*(\d{2}:\d{2}(?::\d{2})?)\b/
  );

  if (!match) return null;

  // PID displays Pakistan local time.
  const time = match[2].length === 5
    ? `${match[2]}:00`
    : match[2];

  const iso = `${match[1]}T${time}+05:00`;
  const date = new Date(iso);

  return Number.isNaN(date.getTime())
    ? null
    : date.toISOString();
}

async function fetchGovernmentNews(source) {
  const response = await fetch(source.url, {
    cache: "no-store",
    redirect: "follow",
    signal: AbortSignal.timeout(15000),
    headers: {
      Accept: "text/html",
      "Cache-Control": "no-cache",
      "User-Agent": "AskPakistanNews/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(
      `${source.name} returned HTTP ${response.status}`
    );
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const articles = [];
  const seen = new Set();

  $('a[href*="press_detail"]').each((_, element) => {
    const anchor = $(element);
    const url = absoluteUrl(anchor.attr("href"), source.url);

    if (!url || seen.has(url)) return;

    const parsedUrl = new URL(url);

    if (
      parsedUrl.hostname !== source.domain &&
      parsedUrl.hostname !== `www.${source.domain}`
    ) return;

    const title = clean(anchor.text());

    if (title.length < 15 || title === "Read More") return;

    // Find the closest article container containing a date.
    let container = anchor.parent();

    for (let i = 0; i < 5; i++) {
      const text = clean(container.text());

      if (parseDate(text)) break;

      if (!container.parent().length) break;

      container = container.parent();
    }

    const containerText = clean(container.text());
    const publishedAt = parseDate(containerText);

    // Remove the headline and date to form an excerpt.
    const description = clean(
      containerText
        .replace(title, "")
        .replace(
          /\b20\d{2}-\d{2}-\d{2}\s*,?\s*\d{2}:\d{2}(?::\d{2})?\b/,
          ""
        )
        .replace(/Read More/gi, "")
    ).slice(0, 360);

    const imageElement = container.find("img").first();

    const image = absoluteUrl(
      imageElement.attr("data-src") ||
      imageElement.attr("src"),
      source.url
    );

    seen.add(url);

    articles.push({
      id: url,
      title,
      description:
        description.length >= 25 ? description : "",
      source: source.name,
      publishedAt,
      image,
      url,
    });
  });

  return articles;
}

export async function handleNewsRequest(req, res) {
  const send = (status, payload) => {
    res.writeHead(status, {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });

    res.end(JSON.stringify(payload));
  };

  try {
    const results = await Promise.allSettled(
      SOURCES.map(fetchGovernmentNews)
    );

    const articles = [];
    const failedSources = [];

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        articles.push(...result.value);
      } else {
        console.error(
          "News source failed:",
          SOURCES[index].name,
          result.reason.message
        );

        failedSources.push(SOURCES[index].name);
      }
    });

    const unique = [...new Map(
      articles.map(article => [article.url, article])
    ).values()];

    unique.sort((a, b) => {
      return (
        new Date(b.publishedAt || 0).getTime() -
        new Date(a.publishedAt || 0).getTime()
      );
    });

    if (!unique.length && failedSources.length === SOURCES.length) {
      return send(502, {
        error: "Government news sources are currently unavailable. Please try again.",
      });
    }

    return send(200, {
      articles: unique.slice(0, 24),
      fetchedAt: new Date().toISOString(),
      failedSources,
    });

  } catch (error) {
    console.error("News API error:", error);

    return send(500, {
      error: "Unable to retrieve government news.",
    });
  }
}
