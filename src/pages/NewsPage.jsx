
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  RefreshCw,
  CalendarDays,
  Building2,
  ExternalLink,
  Newspaper,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";

import { fetchAINews } from "../services/newsServices";

// Format publication date in Pakistan time
function formatDate(value) {
  if (!value) return "Date not provided";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date not provided";
  }

  return new Intl.DateTimeFormat("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Karachi",
  }).format(date);
}

// Text-only news card — no images
function NewsCard({ article }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-950/20">

      {/* Source and article link icon */}
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-xs font-medium text-blue-400">
          <Building2 size={14} />
          <span>
            {article.source || "Government Source"}
          </span>
        </div>

        <ArrowUpRight
          size={20}
          className="shrink-0 text-slate-500 transition-colors group-hover:text-blue-400"
        />
      </div>

      {/* Headline */}
      <h2 className="mb-4 text-xl font-bold leading-snug tracking-tight text-white transition-colors group-hover:text-blue-300">
        {article.title}
      </h2>

      {/* Description */}
      <p className="mb-6 flex-1 text-sm leading-7 text-slate-400">
        {article.description ||
          "Read the full official government announcement for more information."}
      </p>

      {/* Publication date */}
      <div className="mb-5 flex items-center gap-2 border-t border-slate-800 pt-5 text-xs text-slate-400">
        <CalendarDays size={15} />

        <time dateTime={article.publishedAt || undefined}>
          {formatDate(article.publishedAt)}
        </time>
      </div>

      {/* Article link */}
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-between gap-3 rounded-xl bg-slate-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-600"
      >
        Read Full Article
        <ExternalLink size={16} />
      </a>
    </article>
  );
}

// Loading skeleton — no image placeholder
function NewsSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900 p-6"
    >
      <div className="mb-6 h-7 w-2/5 rounded-full bg-slate-800" />

      <div className="mb-3 h-6 w-full rounded bg-slate-800" />
      <div className="mb-6 h-6 w-3/4 rounded bg-slate-800" />

      <div className="mb-3 h-4 w-full rounded bg-slate-800" />
      <div className="mb-3 h-4 w-full rounded bg-slate-800" />
      <div className="mb-8 h-4 w-2/3 rounded bg-slate-800" />

      <div className="mb-5 h-4 w-2/5 rounded bg-slate-800" />
      <div className="h-11 rounded-xl bg-slate-800" />
    </div>
  );
}

export default function NewsPage() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const mounted = useRef(false);
  const requestNumber = useRef(0);
  const initialLoad = useRef(false);

  // Fetch fresh news on every click
  const generateNews = useCallback(async () => {
    const currentRequest = ++requestNumber.current;

    setLoading(true);
    setError("");
    setNotice("");

    try {
      const articles = await fetchAINews();

      if (
        !mounted.current ||
        currentRequest !== requestNumber.current
      ) {
        return;
      }

      if (!Array.isArray(articles)) {
        throw new Error("Invalid news response.");
      }

      if (articles.length === 0) {
        setNewsList([]);
        setNotice(
          "No government news articles were found. Please try again later."
        );
      } else {
        setNewsList(articles);
        setLastUpdated(new Date());

        setNotice(
          `${articles.length} official articles retrieved successfully.`
        );
      }
    } catch (err) {
      if (
        !mounted.current ||
        currentRequest !== requestNumber.current
      ) {
        return;
      }

      setError(
        err.message ||
          "Unable to retrieve news. Please try again."
      );
    } finally {
      if (
        mounted.current &&
        currentRequest === requestNumber.current
      ) {
        setLoading(false);
      }
    }
  }, []);

  // Automatically fetch news when page opens
  useEffect(() => {
    mounted.current = true;

    if (!initialLoad.current) {
      initialLoad.current = true;
      generateNews();
    }

    return () => {
      mounted.current = false;
    };
  }, [generateNews]);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-10 sm:px-6 lg:py-14">

      {/* Page Header */}
      <header className="mb-10 flex flex-col justify-between gap-6 border-b border-slate-800 pb-8 md:flex-row md:items-center">

        <div>
          <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-400">
            <Newspaper size={17} />
            Official Government News
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            News & Public Announcements
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            Stay informed with the latest available news,
            announcements and official updates from Pakistani
            government sources.
          </p>

          {lastUpdated && (
            <p className="mt-3 text-xs text-slate-500">
              Last checked:{" "}
              {formatDate(lastUpdated.toISOString())}
            </p>
          )}
        </div>

        {/* Generate News Button */}
        <button
          type="button"
          disabled={loading}
          onClick={generateNews}
          className="inline-flex shrink-0 items-center justify-center gap-3 self-start rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={18}
            className={loading ? "animate-spin" : ""}
          />

          {loading ? "Fetching News..." : "Generate News"}
        </button>
      </header>

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          className="mb-7 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
        >
          <AlertCircle size={20} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success / Empty Notice */}
      {notice && !loading && (
        <div
          role="status"
          className="mb-7 rounded-xl border border-slate-800 bg-slate-900 px-5 py-4 text-sm text-slate-300"
        >
          {notice}
        </div>
      )}

      {/* News Grid */}
      {loading ? (
        <div
          role="status"
          aria-live="polite"
          aria-label="Loading government news"
          className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {Array.from({ length: 6 }, (_, index) => (
            <NewsSkeleton key={index} />
          ))}
        </div>
      ) : newsList.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {newsList.map((article) => (
            <NewsCard
              key={article.id || article.url}
              article={article}
            />
          ))}
        </div>
      ) : !error ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 px-6 py-20 text-center">
          <Newspaper
            size={42}
            className="mx-auto mb-4 text-slate-500"
          />

          <h2 className="mb-2 text-xl font-semibold text-white">
            No news available
          </h2>

          <p className="text-sm text-slate-400">
            Click Generate News to retrieve the latest
            government announcements.
          </p>
        </div>
      ) : null}
    </main>
  );
}
