import * as cheerio from "cheerio";

// Primary official sources
const PID_SOURCE = {
  name: "Press Information Department (PID)",
  url: "https://www.pid.gov.pk/press",
  domain: "pid.gov.pk",
};

const APP_SOURCE = {
  name: "Associated Press of Pakistan (APP)",
  url: "https://www.app.com.pk/feed/",
};

// Curated official fallback announcements in case of network outages or upstream source downtime
const CURATED_FALLBACK_ARTICLES = [
  {
    id: "fallback-nadra-pakid",
    title: "NADRA Pak-ID: Online CNIC and NICOP Renewal Services Available 24/7",
    description:
      "Citizens in Pakistan and overseas can apply for CNIC renewal, modification, and identity documentation online via the official Pak-ID portal and mobile application.",
    source: "NADRA Pakistan",
    publishedAt: new Date().toISOString(),
    url: "https://id.nadra.gov.pk/",
  },
  {
    id: "fallback-dgip-passport",
    title: "Directorate General of Immigration & Passports — E-Passport & Online Renewal",
    description:
      "Official public advisory regarding passport renewal, online fee payment through the Asaan Passport app, and delivery tracking across regional passport offices.",
    source: "Passport Office (DGIP)",
    publishedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    url: "https://dgip.gov.pk/",
  },
  {
    id: "fallback-fbr-tax",
    title: "FBR Active Taxpayers List (ATL) & IRIS Tax Filing Portal Guidelines",
    description:
      "Federal Board of Revenue reminder for individual taxpayers and business filers regarding income tax statements, active taxpayer verification, and digital challan creation.",
    source: "Federal Board of Revenue (FBR)",
    publishedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    url: "https://iris.fbr.gov.pk/",
  },
  {
    id: "fallback-citizen-portal",
    title: "Pakistan Citizen's Portal: Integrated Grievance Redressal System",
    description:
      "Public announcement on lodging, tracking, and resolving civic complaints and service delivery queries directly with relevant federal and provincial departments.",
    source: "Prime Minister's Performance Delivery Unit",
    publishedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    url: "https://web.citizenportal.gov.pk/",
  },
  {
    id: "fallback-secp-services",
    title: "SECP eServices Portal for Company Incorporation & Regulatory Compliance",
    description:
      "Securities and Exchange Commission of Pakistan guidelines for digital company registration, LLP formation, and statutory filing for entrepreneurs and business entities.",
    source: "SECP",
    publishedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    url: "https://www.secp.gov.pk/",
  },
  {
    id: "fallback-hec-attestation",
    title: "HEC Degree Attestation & Equivalence Online Service Information",
    description:
      "Higher Education Commission advisory for students and professionals regarding online degree verification, attestation appointments, and foreign equivalence certificates.",
    source: "Higher Education Commission (HEC)",
    publishedAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    url: "https://www.hec.gov.pk/",
  },
];

// In-memory cache for fast responses & resilience against upstream timeouts
let newsCache = {
  time: 0,
  articles: [],
};
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function clean(text = "") {
  return String(text).replace(/\s+/g, " ").trim();
}

function absoluteUrl(value, base) {
  try {
    if (!value) return null;
    const url = new URL(value, base);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.href;
  } catch {
    return null;
  }
}

function parsePidDate(text) {
  const match = text.match(
    /\b(20\d{2}-\d{2}-\d{2})\s*,?\s*(\d{2}:\d{2}(?::\d{2})?)\b/
  );
  if (!match) return null;

  const time = match[2].length === 5 ? `${match[2]}:00` : match[2];
  const iso = `${match[1]}T${time}+05:00`;
  const date = new Date(iso);

  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

// Scrape Press Information Department (PID)
async function fetchPidNews() {
  const response = await fetch(PID_SOURCE.url, {
    cache: "no-store",
    redirect: "follow",
    signal: AbortSignal.timeout(8000),
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "Cache-Control": "no-cache",
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 AskPakistan/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`PID returned HTTP ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  const articles = [];
  const seen = new Set();

  $('a[href*="press_detail"]').each((_, element) => {
    const anchor = $(element);
    const url = absoluteUrl(anchor.attr("href"), PID_SOURCE.url);
    if (!url || seen.has(url)) return;

    try {
      const parsedUrl = new URL(url);
      if (
        parsedUrl.hostname !== PID_SOURCE.domain &&
        parsedUrl.hostname !== `www.${PID_SOURCE.domain}`
      )
        return;
    } catch {
      return;
    }

    const title = clean(anchor.text());
    if (title.length < 15 || title === "Read More") return;

    let container = anchor.parent();
    for (let i = 0; i < 5; i++) {
      const text = clean(container.text());
      if (parsePidDate(text)) break;
      if (!container.parent().length) break;
      container = container.parent();
    }

    const containerText = clean(container.text());
    const publishedAt = parsePidDate(containerText);

    const description = clean(
      containerText
        .replace(title, "")
        .replace(/\b20\d{2}-\d{2}-\d{2}\s*,?\s*\d{2}:\d{2}(?::\d{2})?\b/, "")
        .replace(/Read More/gi, "")
    ).slice(0, 360);

    const imageElement = container.find("img").first();
    const image = absoluteUrl(
      imageElement.attr("data-src") || imageElement.attr("src"),
      PID_SOURCE.url
    );

    seen.add(url);
    articles.push({
      id: url,
      title,
      description: description.length >= 25 ? description : "",
      source: PID_SOURCE.name,
      publishedAt,
      image,
      url,
    });
  });

  return articles;
}

// Fetch Associated Press of Pakistan (APP) official state wire
async function fetchAppNews() {
  const response = await fetch(APP_SOURCE.url, {
    cache: "no-store",
    redirect: "follow",
    signal: AbortSignal.timeout(8000),
    headers: {
      Accept: "application/rss+xml,application/xml,text/xml",
      "Cache-Control": "no-cache",
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) AskPakistan/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`APP returned HTTP ${response.status}`);
  }

  const xmlText = await response.text();
  const $ = cheerio.load(xmlText, { xml: true });
  const articles = [];

  $("item").each((_, el) => {
    const item = $(el);
    const title = clean(
      item
        .find("title")
        .first()
        .text()
        .replace(/&#8217;/g, "'")
        .replace(/&#8216;/g, "'")
        .replace(/&#038;/g, "&")
    );
    const link = item.find("link").first().text().trim();
    const pubDate = item.find("pubDate").first().text().trim();
    const rawDesc = item.find("description").first().text().trim();

    if (!title || !link || title.length < 10) return;

    let description = "";
    if (rawDesc) {
      try {
        const $desc = cheerio.load(rawDesc);
        const paragraphs = $desc("p")
          .map((_, p) => clean($desc(p).text()))
          .get();
        const meaningfulP = paragraphs.find(
          (p) =>
            !p.startsWith("Associated Press") &&
            !p.includes("first appeared on") &&
            p.length > 20
        );
        description = meaningfulP || paragraphs[0] || "";
      } catch {
        description = clean(rawDesc.replace(/<[^>]+>/g, ""));
      }
    }

    let publishedAt = null;
    if (pubDate) {
      const parsedDate = new Date(pubDate);
      if (!Number.isNaN(parsedDate.getTime())) {
        publishedAt = parsedDate.toISOString();
      }
    }

    articles.push({
      id: link,
      title,
      description: description.slice(0, 360),
      source: APP_SOURCE.name,
      publishedAt,
      url: link,
    });
  });

  return articles;
}

// Core news aggregation with caching & fallback guarantees
export async function getNewsArticles(forceRefresh = false) {
  const now = Date.now();
  if (
    !forceRefresh &&
    newsCache.articles.length > 0 &&
    now - newsCache.time < CACHE_TTL_MS
  ) {
    return {
      articles: newsCache.articles,
      fetchedAt: new Date(newsCache.time).toISOString(),
      fromCache: true,
    };
  }

  const results = await Promise.allSettled([
    fetchPidNews(),
    fetchAppNews(),
  ]);

  const articles = [];
  const failedSources = [];

  results.forEach((result, idx) => {
    const sourceName = idx === 0 ? PID_SOURCE.name : APP_SOURCE.name;
    if (result.status === "fulfilled" && Array.isArray(result.value)) {
      articles.push(...result.value);
    } else {
      const reason = result.reason?.message || "Unknown error";
      console.warn(`[News API] ${sourceName} failed: ${reason}`);
      failedSources.push(sourceName);
    }
  });

  const unique = [
    ...new Map(articles.map((article) => [article.url, article])).values(),
  ];

  unique.sort((a, b) => {
    return (
      new Date(b.publishedAt || 0).getTime() -
      new Date(a.publishedAt || 0).getTime()
    );
  });

  // If live scraping gathered articles, update cache
  if (unique.length > 0) {
    const finalArticles = unique.slice(0, 30);
    newsCache = {
      time: now,
      articles: finalArticles,
    };
    return {
      articles: finalArticles,
      fetchedAt: new Date(now).toISOString(),
      failedSources,
      fromCache: false,
    };
  }

  // If live scraping failed completely, check if we have older cached articles
  if (newsCache.articles.length > 0) {
    console.warn("[News API] Serving stale cache as fallback.");
    return {
      articles: newsCache.articles,
      fetchedAt: new Date(newsCache.time).toISOString(),
      failedSources,
      isStale: true,
    };
  }

  // If even cache is empty, serve curated official government announcements
  console.warn("[News API] Serving curated fallback articles.");
  return {
    articles: CURATED_FALLBACK_ARTICLES,
    fetchedAt: new Date(now).toISOString(),
    failedSources,
    isFallback: true,
  };
}

// Handler for Node HTTP server (used by scripts/dev.js and src/server/index.js)
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
    const url = new URL(req.url, "http://localhost");
    const forceRefresh = url.searchParams.has("force") || url.searchParams.has("refresh");
    const result = await getNewsArticles(forceRefresh);
    return send(200, result);
  } catch (error) {
    console.error("News API error:", error);
    return send(500, {
      error: "Unable to retrieve government news.",
      articles: CURATED_FALLBACK_ARTICLES,
    });
  }
}
