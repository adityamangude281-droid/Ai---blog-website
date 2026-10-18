# Signal — AI & Technology Journal

A responsive editorial website about AI and emerging technology, built with React, TypeScript, Vite, Express, and Framer Motion.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The API runs on port `3001` and the Vite server proxies `/api` requests to it.

## News API

The site starts with clearly labeled **sample editorial** stories. They are illustrative content and are not presented as real-time news.

To enable current headlines, copy `.env.example` to `.env` and set a [GNews API](https://gnews.io/) key:

```env
NEWS_API_KEY=your_gnews_api_key
PORT=3001
```

Restart the development server after changing `.env`. The key stays on the server and is never sent to the browser. Live headlines link to their original publishers; Signal does not generate article details from a headline. If the provider is unavailable or the key is invalid, the UI reports the issue and keeps the sample stories clearly labeled.

## Features

- Home, latest, trending, topics/categories, topic details, article details, search, saved stories, About, and Contact routes.
- Responsive navigation, reduced-motion support, light/dark theme, page transitions, hover states, and image loading skeletons.
- Search, category browsing, pagination, bookmarks, share/copy links, and newsletter/contact demo forms.
- Bookmarks, theme, and demo newsletter signup persist in browser local storage. The newsletter and contact forms do not send data to a server.
- SEO title and description, Open Graph tags, keyboard focus states, accessible labels, and empty/error states.

## Production

```bash
npm run build
npm start
```

The Express server serves the production build and the news API. Configure `NEWS_API_KEY` in the server environment for live headlines.
