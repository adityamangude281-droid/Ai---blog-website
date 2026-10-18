import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Bookmark, Check, ChevronDown, Clock3, Command,
  Instagram, Linkedin, Menu, Moon, Search, Share2, Sun, X,
} from "lucide-react";
import { categories, getStory, stories, type Story } from "./data";

type NewsResponse = {
  mode: "demo" | "live";
  articles: Array<{ title: string; description: string; url: string; image: string; publishedAt: string; source: string }>;
  error?: string;
};
type Theme = "light" | "dark";

function storageRead<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function adaptLiveStories(news: NewsResponse): Story[] {
  return news.articles.map((item) => ({
    slug: slugify(item.title),
    title: item.title,
    excerpt: item.description || `Read the latest report from ${item.source}.`,
    category: "Latest News",
    author: item.source,
    date: item.publishedAt ? new Date(item.publishedAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" }) : "Recently published",
    readTime: "From the source",
    image: item.image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Illustrative technology image",
    externalUrl: item.url,
    source: item.source,
    body: [item.description || "Open the original source article to read the full report."],
  }));
}

function App() {
  const [bookmarks, setBookmarks] = useState<string[]>(() => storageRead("signal-bookmarks", []));
  const [theme, setTheme] = useState<Theme>(() => storageRead("signal-theme", "light"));
  const [newsletterEmail, setNewsletterEmail] = useState<string | null>(() => storageRead("signal-newsletter", null));
  const [news, setNews] = useState<Story[]>(stories);
  const [sourceMode, setSourceMode] = useState<"demo" | "live">("demo");
  const [newsError, setNewsError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("signal-theme", JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    let active = true;
    fetch("/api/news")
      .then(async (response) => {
        const payload = await response.json() as NewsResponse;
        if (!response.ok) throw new Error(payload.error || "Could not load headlines.");
        if (!active) return;
        if (payload.mode === "live" && payload.articles.length) {
          setNews(adaptLiveStories(payload));
          setSourceMode("live");
        } else if (payload.mode === "live") {
          setNewsError("The news provider returned no headlines.");
        }
      })
      .catch((error: unknown) => {
        if (active) setNewsError(error instanceof Error ? error.message : "Could not load headlines.");
      });
    return () => { active = false; };
  }, []);

  useEffect(() => setMobileMenuOpen(false), [location.pathname]);

  useEffect(() => {
    function onShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        navigate("/search");
      }
    }
    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, [navigate]);

  function toggleBookmark(slug: string) {
    setBookmarks((current) => {
      const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
      localStorage.setItem("signal-bookmarks", JSON.stringify(next));
      return next;
    });
  }

  const content = useMemo(() => {
    return sourceMode === "live" ? news : stories;
  }, [news, sourceMode]);

  return (
    <div className="app-shell">
      <div className="topline"><span>INDEPENDENT PERSPECTIVES ON WHAT'S NEXT</span><span className="topline-right"><span className="live-dot" /> A more thoughtful take on tech</span></div>
      <header className="site-header">
        <Link className="wordmark" to="/" aria-label="Signal home"><span className="wordmark-icon">s<span>.</span></span><span>signal<span className="wordmark-tag">JOURNAL</span></span></Link>
        <nav className={`main-nav ${mobileMenuOpen ? "is-open" : ""}`} aria-label="Main navigation">
          <NavLink to="/latest">Latest</NavLink>
          <NavLink to="/trending">Trending</NavLink>
          <NavLink to="/categories">Topics <ChevronDown size={13} /></NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
        <div className="header-actions">
          <Link className="icon-button saved-shortcut" to="/saved" aria-label="Saved stories"><Bookmark size={18} /><span className="saved-count">{bookmarks.length}</span></Link>
          <Link className="search-shortcut" to="/search"><Search size={16} /><span>Search</span><kbd><Command size={10} /> K</kbd></Link>
          <button className="icon-button theme-toggle" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>{theme === "light" ? <Moon size={18} /> : <Sun size={18} />}</button>
          <button className="icon-button menu-toggle" onClick={() => setMobileMenuOpen((open) => !open)} aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}>{mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </header>
      <AnimatePresence mode="wait">
        <motion.main key={location.pathname + location.search} className="page-main" initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2, ease: "easeOut" }}>
          <Routes>
            <Route path="/" element={<HomePage stories={news} sourceMode={sourceMode} newsError={newsError} bookmarks={bookmarks} onBookmark={toggleBookmark} />} />
            <Route path="/latest" element={<ListingPage title="The latest" eyebrow="FRESH PERSPECTIVES" description="New ideas, research, and stories from across the world of AI and technology." articles={news} sourceMode={sourceMode} newsError={newsError} bookmarks={bookmarks} onBookmark={toggleBookmark} />} />
            <Route path="/trending" element={<ListingPage title={sourceMode === "live" ? "Live source headlines" : "Worth your attention"} eyebrow={sourceMode === "live" ? "RECENT HEADLINES · NOT RANKED" : "SIGNAL PICKS · SAMPLE EDITION"} description={sourceMode === "live" ? "Recent stories returned by our news provider. These headlines are not ranked by reader activity." : "A selection of sample stories for a thoughtful look at the ideas shaping technology."} articles={sourceMode === "live" ? news : stories.filter((story) => story.trending)} sourceMode={sourceMode} newsError={newsError} bookmarks={bookmarks} onBookmark={toggleBookmark} />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/category/:slug" element={<CategoryPage articles={content} sourceMode={sourceMode} newsError={newsError} bookmarks={bookmarks} onBookmark={toggleBookmark} />} />
            <Route path="/article/:slug" element={<ArticlePage articles={content} bookmarks={bookmarks} onBookmark={toggleBookmark} />} />
            <Route path="/search" element={<SearchPage articles={content} bookmarks={bookmarks} onBookmark={toggleBookmark} />} />
            <Route path="/saved" element={<SavedPage articles={content} bookmarks={bookmarks} onBookmark={toggleBookmark} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <Footer email={newsletterEmail} setEmail={setNewsletterEmail} />
    </div>
  );
}

function SourceNote({ mode, error }: { mode: "demo" | "live"; error?: string }) {
  if (error) return <div className="source-note source-error" role="status"><span className="source-marker" />{error} Showing clearly labeled sample stories instead.</div>;
  return mode === "live"
    ? <div className="source-note"><span className="live-dot" /> Live headlines from GNews. Select a story to visit its publisher.</div>
    : <div className="source-note"><span className="source-marker" /> SAMPLE EDITORIAL · Illustrative stories, not live news reporting.</div>;
}

function HeaderLabel({ children, action, to }: { children: ReactNode; action?: string; to?: string }) {
  return <div className="section-heading"><div className="section-kicker"><span className="kicker-line" />{children}</div>{action && to && <Link className="text-link" to={to}>{action}<ArrowRight size={15} /></Link>}</div>;
}

function StoryLink({ story, className, children, ariaLabel }: { story: Story; className?: string; children: ReactNode; ariaLabel?: string }) {
  if (story.externalUrl) return <a className={className} href={story.externalUrl} target="_blank" rel="noreferrer" aria-label={ariaLabel}>{children}</a>;
  return <Link className={className} to={`/article/${story.slug}`} aria-label={ariaLabel}>{children}</Link>;
}

function StoryCard({ story, saved, onBookmark, variant = "standard" }: { story: Story; saved: boolean; onBookmark: (slug: string) => void; variant?: "standard" | "compact" }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <motion.article className={`story-card ${variant === "compact" ? "compact-card" : ""}`} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <div className="card-image-wrap">
        <StoryLink story={story} className="card-image-link" ariaLabel={story.title}>
          {!imageLoaded && <span className="image-skeleton" aria-hidden="true" />}
          <img className={imageLoaded ? "image-loaded" : ""} src={story.image} alt={story.imageAlt} loading="lazy" onLoad={() => setImageLoaded(true)} onError={() => setImageLoaded(true)} />
        </StoryLink>
        <span className="image-category">{story.category}</span>
        <button className={`bookmark-button ${saved ? "is-saved" : ""}`} onClick={() => onBookmark(story.slug)} aria-label={saved ? `Remove ${story.title} from saved stories` : `Save ${story.title}`} aria-pressed={saved}><Bookmark size={16} fill={saved ? "currentColor" : "none"} /></button>
      </div>
      <div className="card-copy">
        <StoryLink story={story} className="card-title">{story.title}{story.externalUrl && <ArrowUpRight className="external-mark" size={15} />}</StoryLink>
        {variant !== "compact" && <p>{story.excerpt}</p>}
        <div className="card-meta"><span>{story.author}</span><span className="meta-separator" /><span>{story.readTime}</span></div>
      </div>
    </motion.article>
  );
}

function HomePage({ stories: articles, sourceMode, newsError, bookmarks, onBookmark }: { stories: Story[]; sourceMode: "demo" | "live"; newsError: string; bookmarks: string[]; onBookmark: (slug: string) => void }) {
  const featured = articles[0] || stories[0];
  const others = articles.filter((story) => story.slug !== featured.slug);
  const latest = (others.length ? others : stories.slice(1)).slice(0, 3);
  return (
    <>
      <section className="hero container">
        <div className="hero-topline"><span className="eyebrow"><span className="live-dot" /> IDEAS FOR AN INTELLIGENT AGE</span><span className="issue-number">VOL. 04 &nbsp;—&nbsp; NO. 18</span></div>
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-mini">TECHNOLOGY, WITH A HUMAN PERSPECTIVE</span>
            <h1>The future,<br />in <span className="serif-accent">focus.</span></h1>
            <p>Thoughtful reporting on AI and the ideas changing how we live, work, and imagine what's next.</p>
            <Link to="/latest" className="button button-dark">Explore the latest <ArrowRight size={16} /></Link>
          </div>
          <div className="hero-feature">
            <StoryLink story={featured} className="feature-visual">
              <img src={featured.image} alt={featured.imageAlt} />
              <span className="feature-image-label">SIGNAL / 001</span>
              <span className="feature-image-icon"><ArrowUpRight size={20} /></span>
            </StoryLink>
            <div className="feature-caption"><div><span className="feature-overline">{featured.category} <span>·</span> {featured.readTime}</span><StoryLink story={featured} className="feature-title">{featured.title}</StoryLink></div><span className="feature-index">01 / 06</span></div>
          </div>
        </div>
        <div className="hero-bottom"><SourceNote mode={sourceMode} error={newsError} /><a className="scroll-cue" href="#latest-stories">SCROLL TO EXPLORE <ArrowDown size={13} /></a></div>
      </section>

      <section id="latest-stories" className="container section-block">
        <HeaderLabel action="View all stories" to="/latest">LATEST SIGNALS</HeaderLabel>
        <div className="story-grid">{latest.map((story) => <StoryCard key={story.slug} story={story} saved={bookmarks.includes(story.slug)} onBookmark={onBookmark} />)}</div>
      </section>
      <section className="topic-ribbon"><div className="container ribbon-inner"><div><span className="ribbon-kicker">FOLLOW YOUR CURIOSITY</span><h2>Big questions.<br /><span>Clear perspectives.</span></h2></div><div className="ribbon-topics">{categories.slice(0, 4).map((category, i) => <Link to={`/category/${category.slug}`} key={category.slug}><span>0{i + 1}</span>{category.name}<ArrowUpRight size={15} /></Link>)}</div></div></section>
      <section className="container section-block trending-block">
        <HeaderLabel action="All the trending stories" to="/trending">IN THE CONVERSATION</HeaderLabel>
        <div className="trending-layout"><div className="trending-feature"><span className="trending-label"><span className="live-dot" />{sourceMode === "live" ? "RECENT SOURCE HEADLINES" : "SIGNAL PICKS · SAMPLE"}</span><h2>Not just what's new.<br /><span>What it means.</span></h2><p>Technology moves fast. Context helps us move forward with it.</p><Link className="text-link" to="/trending">Explore trending stories <ArrowRight size={15} /></Link></div><div className="trending-list">{(sourceMode === "live" ? articles : contentFrom(articles).filter((story) => story.trending)).slice(0, 3).map((story, index) => <StoryLink story={story} className="trending-item" key={story.slug}><span className="trending-num">0{index + 1}</span><span className="trending-item-copy"><span>{story.category}</span><strong>{story.title}</strong><small>{story.author} <i>·</i> {story.readTime}</small></span><ArrowUpRight size={17} /></StoryLink>)}</div></div>
      </section>
      <section className="container quote-band"><span className="quote-mark">“</span><blockquote>Technology is most interesting when we ask not only what it can do, but what we want it to do.</blockquote><span className="quote-credit">THE SIGNAL POINT OF VIEW</span></section>
    </>
  );
}

function contentFrom(articles: Story[]) {
  return [...articles, ...stories.filter((story) => !articles.some((item) => item.slug === story.slug))];
}

function ListingPage({ title, eyebrow, description, articles, sourceMode, newsError, bookmarks, onBookmark }: { title: string; eyebrow: string; description: string; articles: Story[]; sourceMode: "demo" | "live"; newsError: string; bookmarks: string[]; onBookmark: (slug: string) => void }) {
  const [page, setPage] = useState(1);
  const pageSize = 3;
  const pageCount = Math.max(1, Math.ceil(articles.length / pageSize));
  const visible = articles.slice((page - 1) * pageSize, page * pageSize);
  return (
    <section className="container listing-page">
      <SourceNote mode={sourceMode} error={newsError} />
      <div className="page-intro"><span className="eyebrow"><span className="kicker-line" />{eyebrow}</span><h1>{title}<span className="serif-accent">.</span></h1><p>{description}</p></div>
      {articles.length ? <div className="story-grid">{visible.map((story) => <StoryCard key={story.slug} story={story} saved={bookmarks.includes(story.slug)} onBookmark={onBookmark} />)}</div> : <EmptyState title="No stories to show just yet" body="Check back soon for new perspectives." />}
      {pageCount > 1 && <Pagination page={page} pages={pageCount} setPage={setPage} />}
    </section>
  );
}

function CategoriesPage() {
  return <section className="container listing-page"><div className="page-intro"><span className="eyebrow"><span className="kicker-line" />EXPLORE THE JOURNAL</span><h1>Find your <span className="serif-accent">signal.</span></h1><p>Follow the questions you're curious about. Start with a topic.</p></div><div className="category-grid">{categories.map((category, index) => <Link to={`/category/${category.slug}`} className="category-tile" key={category.slug}><span className="category-index">0{index + 1} / TOPIC</span><span className="category-code">{category.short}</span><span className="category-title">{category.name}</span><p>{category.description}</p><span className="category-arrow"><ArrowUpRight size={19} /></span></Link>)}</div></section>;
}

function CategoryPage({ articles, sourceMode, newsError, bookmarks, onBookmark }: { articles: Story[]; sourceMode: "demo" | "live"; newsError: string; bookmarks: string[]; onBookmark: (slug: string) => void }) {
  const { slug = "" } = useParams();
  const category = categories.find((item) => item.slug === slug);
  const matches = articles.filter((story) => story.category === category?.name);
  if (!category) return <NotFoundPage />;
  return <section className="container listing-page"><SourceNote mode={sourceMode} error={newsError} /><div className="page-intro"><Link className="back-link" to="/categories"><ArrowLeft size={14} /> ALL TOPICS</Link><span className="eyebrow"><span className="kicker-line" />TOPIC / {category.short.toUpperCase()}</span><h1>{category.name}<span className="serif-accent">.</span></h1><p>{category.description}</p></div>{matches.length ? <div className="story-grid">{matches.map((story) => <StoryCard key={story.slug} story={story} saved={bookmarks.includes(story.slug)} onBookmark={onBookmark} />)}</div> : <EmptyState title={sourceMode === "live" ? "No live headlines in this topic" : "More stories are on the way"} body={sourceMode === "live" ? "The live news feed is not currently mapped into Signal's editorial topics. Try Latest for current publisher headlines." : "We don't have a story in this topic yet. Browse all topics to discover something new."} action={<Link className="button button-dark" to={sourceMode === "live" ? "/latest" : "/categories"}>{sourceMode === "live" ? "See latest headlines" : "Browse topics"} <ArrowRight size={15} /></Link>} />}</section>;
}

function ArticlePage({ articles, bookmarks, onBookmark }: { articles: Story[]; bookmarks: string[]; onBookmark: (slug: string) => void }) {
  const { slug = "" } = useParams();
  const article = articles.find((story) => story.slug === slug) || getStory(slug);
  const [shared, setShared] = useState(false);
  const [shareError, setShareError] = useState("");
  if (!article) return <NotFoundPage />;
  const currentArticle = article;
  const categorySlug = categories.find((category) => category.name === article.category)?.slug || "categories";
  const related = articles.filter((story) => story.slug !== article.slug && (story.category === article.category || !article.externalUrl)).slice(0, 3);
  async function shareStory() {
    setShareError("");
    try {
      if (navigator.share) {
        await navigator.share({ title: currentArticle.title, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShared(true);
        window.setTimeout(() => setShared(false), 2200);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareError("Could not share this link. You can copy the URL from your browser.");
    }
  }
  return <article className="container article-page">
    <div className="article-top"><Link className="back-link" to={article.externalUrl ? "/latest" : `/category/${categorySlug}`}><ArrowLeft size={14} /> BACK TO {article.externalUrl ? "LATEST" : article.category.toUpperCase()}</Link><span className="article-top-label">SIGNAL JOURNAL <span>—</span> FIELD NOTES</span></div>
    <div className="article-head"><span className="eyebrow"><span className="kicker-line" />{article.category}</span><h1>{article.title}</h1><p className="article-deck">{article.excerpt}</p><div className="article-byline"><span className="author-avatar">{article.author.slice(0, 1)}</span><span>By <strong>{article.author}</strong><small>{article.date} <i>·</i> {article.readTime}</small></span><div className="article-tools"><button className={`icon-button ${bookmarks.includes(article.slug) ? "is-saved" : ""}`} onClick={() => onBookmark(article.slug)} aria-label={bookmarks.includes(article.slug) ? "Remove bookmark" : "Bookmark article"}><Bookmark size={18} fill={bookmarks.includes(article.slug) ? "currentColor" : "none"} /></button><button className="icon-button" onClick={shareStory} aria-label="Share article"><Share2 size={17} /></button>{shared && <span className="copied-note" role="status">Link copied</span>}</div></div>{shareError && <p className="form-note" role="status">{shareError}</p>}</div>
    <figure className="article-cover"><img src={article.image} alt={article.imageAlt} /><figcaption>{article.externalUrl ? `Image via ${article.source || "publisher"}` : "Signal illustration / editorial sample"}</figcaption></figure>
    <div className="article-body-layout"><aside className="article-aside"><span>IN THIS STORY</span><div className="aside-line" /><span><Clock3 size={13} /> {article.readTime}</span></aside><div className="article-body">{article.externalUrl && <div className="external-story-notice"><ArrowUpRight size={17} /><span>This is a live headline from <strong>{article.source}</strong>. Signal links to the publisher's original report and does not reproduce it.</span></div>}{article.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}{article.externalUrl && <a className="button button-dark source-button" href={article.externalUrl} target="_blank" rel="noreferrer">Continue at {article.source} <ArrowUpRight size={15} /></a>}{!article.externalUrl && <p className="demo-disclaimer">This illustrative editorial is sample content created for the Signal demo. It is not a report of real-time events.</p>}<div className="article-share-bottom"><span>PASS THE SIGNAL ON</span><button className="text-link" onClick={shareStory}>Share this story <Share2 size={15} /></button></div></div></div>
    {related.length > 0 && <section className="related-section"><HeaderLabel action="More stories" to="/latest">KEEP EXPLORING</HeaderLabel><div className="story-grid">{related.map((story) => <StoryCard key={story.slug} story={story} saved={bookmarks.includes(story.slug)} onBookmark={onBookmark} />)}</div></section>}
  </article>;
}

function SearchPage({ articles, bookmarks, onBookmark }: { articles: Story[]; bookmarks: string[]; onBookmark: (slug: string) => void }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initial = searchParams.get("q") || "";
  const [query, setQuery] = useState(initial);
  const [remoteResults, setRemoteResults] = useState<Story[]>([]);
  const [remoteError, setRemoteError] = useState("");
  useEffect(() => {
    if (!initial.trim()) {
      setRemoteResults([]);
      setRemoteError("");
      return;
    }
    setRemoteResults([]);
    setRemoteError("");
    let active = true;
    fetch(`/api/news?q=${encodeURIComponent(initial.trim())}`)
      .then(async (response) => {
        const payload = await response.json() as NewsResponse;
        if (!response.ok) throw new Error(payload.error || "Could not search live headlines.");
        if (active && payload.mode === "live") setRemoteResults(adaptLiveStories(payload));
      })
      .catch((error: unknown) => {
        if (active) setRemoteError(error instanceof Error ? error.message : "Could not search live headlines.");
      });
    return () => { active = false; };
  }, [initial]);
  const normalized = initial.trim().toLowerCase();
  const localResults = normalized ? articles.filter((story) => `${story.title} ${story.excerpt} ${story.category} ${story.author}`.toLowerCase().includes(normalized)) : [];
  const results = [...localResults, ...remoteResults.filter((remote) => !localResults.some((story) => story.title === remote.title))];
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSearchParams(query.trim() ? { q: query.trim() } : {}); }
  return <section className="container search-page"><div className="page-intro"><span className="eyebrow"><span className="kicker-line" />THE JOURNAL, SEARCHED</span><h1>Find your <span className="serif-accent">next read.</span></h1></div><form className="large-search" onSubmit={submit}><Search size={20} /><input autoFocus aria-label="Search stories" placeholder="Try “small models” or “robotics”" value={query} onChange={(event) => setQuery(event.target.value)} /><button type="submit">Search <ArrowRight size={15} /></button></form>{remoteError && <SourceNote mode="demo" error={remoteError} />}{initial ? <><div className="results-heading"><span>{results.length} {results.length === 1 ? "STORY" : "STORIES"} FOUND</span><strong>for “{initial}”</strong></div>{results.length ? <div className="story-grid">{results.map((story) => <StoryCard key={story.slug} story={story} saved={bookmarks.includes(story.slug)} onBookmark={onBookmark} />)}</div> : <EmptyState title="No stories found" body="Try a different search, or explore one of our topics." action={<Link to="/categories" className="text-link">Explore topics <ArrowRight size={15} /></Link>} />}</> : <div className="search-suggestions"><span>POPULAR TOPICS</span>{categories.slice(0, 4).map((category) => <Link key={category.slug} to={`/category/${category.slug}`}>{category.name}<ArrowUpRight size={13} /></Link>)}</div>}</section>;
}

function SavedPage({ articles, bookmarks, onBookmark }: { articles: Story[]; bookmarks: string[]; onBookmark: (slug: string) => void }) {
  const saved = articles.filter((story) => bookmarks.includes(story.slug));
  return <section className="container listing-page"><div className="page-intro"><span className="eyebrow"><span className="kicker-line" />YOUR PERSONAL READING LIST</span><h1>Saved for <span className="serif-accent">later.</span></h1><p>Your bookmarks are stored on this device, ready when you are.</p></div>{saved.length ? <div className="story-grid">{saved.map((story) => <StoryCard key={story.slug} story={story} saved onBookmark={onBookmark} />)}</div> : <EmptyState title="A little room for a good read" body="Save a story with the bookmark icon and it will be waiting here." action={<Link className="button button-dark" to="/latest">Explore stories <ArrowRight size={15} /></Link>} />}</section>;
}

function AboutPage() {
  return <section className="container about-page"><span className="eyebrow"><span className="kicker-line" />A JOURNAL FOR WHAT'S NEXT</span><h1>Less noise.<br /><span className="serif-accent">More signal.</span></h1><div className="about-grid"><p className="about-lead">Signal is an independent journal exploring artificial intelligence, emerging technology, and the human questions behind progress.</p><div className="about-copy"><p>We believe the most important technology stories aren't just about what changed. They're about what that change means—for our work, our communities, and the world we share.</p><p>Our aim is to make room for clear thinking: curious reporting, useful context, and perspectives that look beyond the next product cycle.</p><p className="about-note">Signal is a demo publication. Sample stories on this site are illustrative editorial content, not current reporting.</p><Link to="/latest" className="button button-dark">Read the journal <ArrowRight size={15} /></Link></div></div><div className="about-values"><div><span>01 / CURIOSITY</span><h3>Ask better questions.</h3></div><div><span>02 / CLARITY</span><h3>Make the complex legible.</h3></div><div><span>03 / HUMANITY</span><h3>Keep people in the picture.</h3></div></div></section>;
}

function ContactPage() {
  const [sent, setSent] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSent(true); }
  return <section className="container contact-page"><div className="page-intro"><span className="eyebrow"><span className="kicker-line" />WE'D LOVE TO HEAR FROM YOU</span><h1>Start a <span className="serif-accent">conversation.</span></h1><p>Ideas, questions, story tips—our inbox is open.</p></div><form className="contact-form" onSubmit={submit}><label>Your name<input name="name" autoComplete="name" required placeholder="How should we address you?" /></label><label>Email address<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label><label>Your message<textarea name="message" rows={5} required placeholder="What's on your mind?" /></label><button className="button button-dark" type="submit">{sent ? <><Check size={16} /> Message noted</> : <>Send your message <ArrowRight size={15} /></>}</button>{sent && <p className="form-note" role="status">Thanks for reaching out. This demo form doesn't send data to a server, but your message is ready to go.</p>}</form></section>;
}

function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return <div className="empty-state"><span className="empty-icon"><Search size={20} /></span><h2>{title}</h2><p>{body}</p>{action}</div>;
}

function Pagination({ page, pages, setPage }: { page: number; pages: number; setPage: (value: number) => void }) {
  return <nav className="pagination" aria-label="Pagination"><button className="icon-button" disabled={page <= 1} onClick={() => setPage(page - 1)} aria-label="Previous page"><ArrowLeft size={16} /></button>{Array.from({ length: pages }, (_, index) => <button key={index} className={`page-number ${page === index + 1 ? "active" : ""}`} onClick={() => setPage(index + 1)} aria-current={page === index + 1 ? "page" : undefined}>{index + 1}</button>)}<button className="icon-button" disabled={page >= pages} onClick={() => setPage(page + 1)} aria-label="Next page"><ArrowRight size={16} /></button></nav>;
}

function NotFoundPage() {
  return <section className="container not-found"><span className="eyebrow"><span className="kicker-line" />404 / OFF THE SIGNAL</span><h1>This page has<br /><span className="serif-accent">gone quiet.</span></h1><p>We can't find the page you're looking for.</p><Link to="/" className="button button-dark">Back to the journal <ArrowRight size={15} /></Link></section>;
}

function Footer({ email, setEmail }: { email: string | null; setEmail: (email: string | null) => void }) {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (email) { setMessage("You're already on this device's demo reading list."); return; }
    const normalized = input.trim();
    if (!normalized) return;
    localStorage.setItem("signal-newsletter", JSON.stringify(normalized));
    setEmail(normalized);
    setMessage("You're on the demo reading list. No email has been sent.");
  }
  return <footer className="site-footer"><div className="container footer-main"><div className="footer-brand"><Link className="wordmark footer-wordmark" to="/"><span className="wordmark-icon">s<span>.</span></span><span>signal<span className="wordmark-tag">JOURNAL</span></span></Link><p>Independent perspectives<br />on an intelligent age.</p><div className="social-links"><a aria-label="Signal on Instagram" href="https://www.instagram.com/" target="_blank" rel="noreferrer"><Instagram size={16} /></a><a aria-label="Signal on LinkedIn" href="https://www.linkedin.com/" target="_blank" rel="noreferrer"><Linkedin size={16} /></a></div></div><div className="footer-links"><span className="footer-heading">EXPLORE</span><Link to="/latest">Latest stories</Link><Link to="/trending">Trending</Link><Link to="/categories">All topics</Link><Link to="/saved">Reading list</Link></div><div className="footer-links"><span className="footer-heading">THE JOURNAL</span><Link to="/about">About Signal</Link><Link to="/contact">Contact</Link><a href="mailto:hello@signal.example">hello@signal.example</a></div><div className="newsletter"><span className="footer-heading">A LITTLE MORE SIGNAL</span><h3>Good ideas, occasionally.</h3><p>A thoughtful note on technology. No noise, ever.</p><form onSubmit={subscribe}><label className="visually-hidden" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" required placeholder="Your email address" value={input} onChange={(event) => setInput(event.target.value)} /><button aria-label="Subscribe to newsletter" type="submit"><ArrowRight size={17} /></button></form>{message ? <small className="newsletter-status" role="status">{message}</small> : <small>DEMO SIGNUP — stored on this device only.</small>}</div></div><div className="container footer-bottom"><span>© 2026 SIGNAL JOURNAL. MADE FOR THE CURIOUS.</span><span>ILLUSTRATIVE STORIES ARE CLEARLY LABELED. <a href="#root">BACK TO TOP ↑</a></span></div></footer>;
}

export default App;
