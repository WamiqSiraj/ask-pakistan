import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Ensures <link rel="stylesheet"> is emitted in <head> BEFORE <script> tags
// to avoid "Layout was forced before the page was fully loaded / FOUC" browser warnings
function cssBeforeScriptPlugin() {
  return {
    name: "css-before-script",
    enforce: "post",
    transformIndexHtml(html) {
      const linkMatches = [
        ...html.matchAll(/<link\s+[^>]*rel="stylesheet"[^>]*>/g),
      ].map((m) => m[0]);
      if (!linkMatches.length) return html;

      // Remove existing stylesheet links
      const cleaned = html.replace(
        /<link\s+[^>]*rel="stylesheet"[^>]*>(\r?\n\s*)?/g,
        ""
      );

      // Insert stylesheet links before the first script tag
      const scriptIndex = cleaned.indexOf("<script");
      if (scriptIndex !== -1) {
        return (
          cleaned.slice(0, scriptIndex) +
          linkMatches.join("\n    ") +
          "\n    " +
          cleaned.slice(scriptIndex)
        );
      }
      return cleaned.replace("</head>", `  ${linkMatches.join("\n  ")}\n</head>`);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), cssBeforeScriptPlugin()],

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
