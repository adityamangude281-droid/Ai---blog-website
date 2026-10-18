export type Story = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  imageAlt: string;
  featured?: boolean;
  trending?: boolean;
  externalUrl?: string;
  source?: string;
  body: string[];
};

export const categories = [
  { name: "Artificial Intelligence", slug: "ai", short: "AI", description: "The models, minds, and machines reshaping how we live and work." },
  { name: "The Future of Work", slug: "future-of-work", short: "Work", description: "New tools and ideas changing how work gets done." },
  { name: "Robotics", slug: "robotics", short: "Robotics", description: "When intelligent software meets the physical world." },
  { name: "Responsible Tech", slug: "responsible-tech", short: "Ethics", description: "The human questions behind technological progress." },
  { name: "Science & Research", slug: "science", short: "Science", description: "A closer look at the breakthroughs moving research forward." },
  { name: "Culture", slug: "culture", short: "Culture", description: "How emerging technology is changing culture and creativity." },
];

export const stories: Story[] = [
  {
    slug: "small-models-big-ideas",
    title: "The small-model revolution is already here",
    excerpt: "A new generation of compact AI is proving that bigger isn't always better. The real breakthrough may be what happens when intelligence moves closer to us.",
    category: "Artificial Intelligence",
    author: "Maya Chen",
    date: "October 16, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Abstract luminous geometric shapes in a deep blue space",
    featured: true,
    trending: true,
    body: [
      "For years, the story of artificial intelligence has been told in ever-larger numbers: more parameters, more compute, more data. But a quieter shift is changing that story. Capable models are getting smaller, faster, and far more useful in the places people actually work.",
      "That shift matters because intelligence is most useful when it is available at the right moment. A model that can run privately on a laptop or respond instantly at the edge can unlock entirely different experiences from one that depends on a distant data center.",
      "The question is no longer simply how powerful a model can become. It is how much of that capability can be delivered responsibly, reliably, and where it is needed. Smaller models are making that a practical question rather than a theoretical one.",
      "There are still trade-offs. Smaller systems need careful evaluation, clear limits, and thoughtful product design. Yet their rise suggests the next phase of AI may be defined less by spectacle and more by quiet usefulness.",
    ],
  },
  {
    slug: "designing-for-ai-agents",
    title: "Who designs the workplace when AI joins the team?",
    excerpt: "As software agents move from demos to daily work, teams are rethinking what collaboration, accountability, and good design really mean.",
    category: "The Future of Work",
    author: "Jordan Lee",
    date: "October 14, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1100&q=85",
    imageAlt: "Sunlit collaborative workspace with a long shared desk",
    trending: true,
    body: [
      "The most useful AI at work may not look like a chatbot at all. It may be the quiet teammate that handles a handoff, finds the missing context, or makes the next step easier to see.",
      "That possibility asks something new of workplace design. Teams need to decide which tasks can be delegated, what a human still needs to review, and how to make the work visible to everyone involved.",
      "The organizations making progress are beginning with specific friction points instead of sweeping promises. They map a workflow, invite the people who use it to shape the tool, and measure whether the experience actually improves.",
    ],
  },
  {
    slug: "robots-learn-to-lend-a-hand",
    title: "The next generation of robots is learning to lend a hand",
    excerpt: "Better perception and more adaptable software are helping robots move beyond carefully scripted tasks and into more unpredictable spaces.",
    category: "Robotics",
    author: "Alex Rivera",
    date: "October 12, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1100&q=85",
    imageAlt: "Friendly white humanoid robot in a softly lit studio",
    trending: true,
    body: [
      "A robot in a research lab can be impressive. A robot that can recover gracefully when the world does something unexpected is more interesting—and much harder to build.",
      "Recent advances in perception and learning are helping machines adapt to objects and environments they were not explicitly programmed to handle. The result is not magic, but a gradual shift toward more flexible systems.",
      "For people who work alongside these machines, reliability matters more than novelty. The most promising designs make their intentions legible and keep a human in control when the situation calls for judgment.",
    ],
  },
  {
    slug: "making-ai-accountable",
    title: "The case for making AI easier to question",
    excerpt: "Trustworthy systems should make room for uncertainty, challenge, and a clear path to human judgment.",
    category: "Responsible Tech",
    author: "Priya Okafor",
    date: "October 10, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1100&q=85",
    imageAlt: "Team collaborating around a laptop in a bright room",
    body: [
      "An answer that sounds certain is not always an answer that deserves trust. As automated systems influence more decisions, the ability to ask why—and to disagree—becomes a practical design requirement.",
      "That means showing people what a system can and cannot do, offering a route to human review, and treating feedback as part of the product rather than an afterthought.",
      "Accountability is not a single interface element or disclosure. It is a set of choices that make a system understandable to the people affected by it.",
    ],
  },
  {
    slug: "inside-the-new-science-stack",
    title: "A new science stack is helping researchers ask better questions",
    excerpt: "From literature review to experimental planning, AI tools are finding a place in the research process—with scientists firmly in the loop.",
    category: "Science & Research",
    author: "Samira Patel",
    date: "October 08, 2026",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1100&q=85",
    imageAlt: "Close-up of colorful laboratory glassware",
    body: [
      "Research has always involved a conversation between evidence and imagination. New AI tools are beginning to support that conversation by helping scientists navigate large bodies of literature and explore possible next steps.",
      "The promise is not an automated scientist. It is more time for researchers to evaluate evidence, design careful experiments, and collaborate across disciplines.",
      "Scientific judgment remains essential. A promising suggestion still needs a test, a reproducible method, and a community willing to scrutinize the result.",
    ],
  },
  {
    slug: "creativity-after-the-prompt",
    title: "Creativity after the prompt",
    excerpt: "Artists are building a new visual language around generative tools, and it looks less like automation than conversation.",
    category: "Culture",
    author: "Noah Williams",
    date: "October 06, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1100&q=85",
    imageAlt: "Vibrant abstract art with expressive colors and texture",
    trending: true,
    body: [
      "The first wave of conversation about generative art was framed as a contest between people and machines. Many artists are now asking a more interesting question: what kinds of work become possible when a new tool enters the studio?",
      "The answers are varied. Some artists use generative systems to create surprising raw material; others treat them as collaborators to be directed, edited, and sometimes rejected.",
      "A tool does not settle questions of authorship, credit, or consent. But the creative work happening around these systems is already giving those questions a richer and more human context.",
    ],
  },
];

export const getStory = (slug: string) => stories.find((story) => story.slug === slug);
