import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = Number(process.env.PORT) || 3001;
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDir, "..");

app.get("/api/news", async (request, response) => {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    response.json({ mode: "demo", articles: [] });
    return;
  }

  const searchQuery = typeof request.query.q === "string" ? request.query.q.trim() : "";
  const endpoint = new URL("https://gnews.io/api/v4/top-headlines");
  endpoint.searchParams.set("lang", "en");
  endpoint.searchParams.set("max", "10");
  endpoint.searchParams.set("apikey", apiKey);
  if (searchQuery) endpoint.searchParams.set("q", searchQuery.slice(0, 100));

  try {
    const upstream = await fetch(endpoint, { signal: AbortSignal.timeout(10_000) });
    if (!upstream.ok) {
      response.status(502).json({ error: "The news provider could not return headlines. Check your API key or try again later." });
      return;
    }

    const payload: unknown = await upstream.json();
    if (!payload || typeof payload !== "object" || !("articles" in payload) || !Array.isArray(payload.articles)) {
      response.status(502).json({ error: "The news provider returned an unexpected response." });
      return;
    }

    const articles = payload.articles.flatMap((item: unknown) => {
      if (!item || typeof item !== "object") return [];
      const story = item as Record<string, unknown>;
      if (typeof story.title !== "string" || typeof story.url !== "string") return [];
      const source = story.source && typeof story.source === "object" ? story.source as Record<string, unknown> : {};
      return [{
        title: story.title,
        description: typeof story.description === "string" ? story.description : "",
        url: story.url,
        image: typeof story.image === "string" ? story.image : "",
        publishedAt: typeof story.publishedAt === "string" ? story.publishedAt : "",
        source: typeof source.name === "string" ? source.name : "News source",
      }];
    });

    response.json({ mode: "live", articles });
  } catch (error) {
    console.error("News provider request failed:", error);
    response.status(502).json({ error: "Could not reach the news provider. Please try again later." });
  }
});

if (process.env.NODE_ENV === "production") {
  const buildDirectory = path.join(projectRoot, "dist");
  app.use(express.static(buildDirectory));
  app.get("*", (_request, response) => response.sendFile(path.join(buildDirectory, "index.html")));
}

app.listen(port, () => {
  console.log(`Signal API listening on http://localhost:${port}`);
});
