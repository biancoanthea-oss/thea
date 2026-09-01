// Blog content lives here as typed data rather than raw HTML, so pages stay
// presentational and posts can later come from a CMS without touching the UI.

export type QuestionAndAnswer = {
  question: string;
  /** One string per paragraph of the answer. `**bold**` is supported. */
  answer: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  /** Short summary used on the index page and in social/meta tags. */
  excerpt: string;
  series?: string;
  /** ISO date (YYYY-MM-DD) the post was published. */
  publishedAt: string;
  author: {
    name: string;
    role: string;
    /** Initials shown in the byline avatar. */
    initials: string;
  };
  intro: string[];
  questions: QuestionAndAnswer[];
  callToAction: {
    heading: string;
    body: string[];
    linkLabel: string;
    href: string;
  };
};

const posts: BlogPost[] = [
  {
    slug: "meet-the-expert-lyndsey-mcfarland",
    title: "Meet the Expert: Lyndsey McFarland, Head of Sales – Workplace Solutions",
    excerpt:
      "Lyndsey McFarland on life as Head of Sales, the challenges businesses bring to her team and why the best workplace decisions are rarely the cheapest ones.",
    series: "Meet the Expert",
    publishedAt: "2026-09-01",
    author: {
      name: "Lyndsey McFarland",
      role: "Head of Sales, Stacked Workplace Solutions",
      initials: "LM",
    },
    intro: [
      "At Stacked Workplace Solutions, we know that no two workplaces operate in exactly the same way. From managing everyday essentials to creating better working environments, businesses increasingly need solutions that make their workplaces easier and more efficient to manage.",
      "In the latest edition of our **Meet the Expert** series, we speak with **Lyndsey McFarland, Head of Sales for Stacked Workplace Solutions**, about her role, the changing needs of modern workplaces and how the team supports organisations with much more than traditional office supplies.",
    ],
    questions: [
      {
        question:
          "Can you tell us about your role as Head of Sales for Workplace Solutions and what a typical day looks like?",
        answer: [
          "As Head of Sales for Workplace Solutions, my role is really about driving growth, supporting the sales team and making sure we are continually delivering for our customers.",
          "No two days are ever the same, which is something I love about the role. A big part of what I do is motivating the team, working closely with our customers and identifying opportunities for us to grow beyond the traditional workplace supplies model.",
        ],
      },
      {
        question:
          "How did you begin your career in workplace solutions and what attracted you to the industry?",
        answer: [
          "I started my career in sales and, over time, naturally progressed into the role I’m in today.",
          "People often think workplace supplies are simply about stationery and office products, but there is so much more to the industry. Every business operates differently and being able to understand a customer’s challenges and find solutions that genuinely make a difference is something I really enjoy.",
          "The industry is also constantly evolving, which means there is always something new to learn.",
        ],
      },
      {
        question:
          "What does Stacked Workplace Solutions offer and how do you support businesses beyond simply supplying workplace products?",
        answer: [
          "We offer much more than traditional workplace supplies. We support businesses across areas including **office supplies, furniture, print and promotional merchandise, workwear, facilities products and other workplace essentials**.",
          "The focus is on understanding what each organisation actually needs and helping make the day-to-day management of their workplace as straightforward as possible.",
        ],
      },
      {
        question:
          "What are some of the most common workplace challenges businesses come to you with?",
        answer: [
          "A lot of businesses are dealing with similar challenges – managing costs, having too many suppliers, inconsistent purchasing and simply not having enough time to manage everything that keeps a workplace running.",
          "We also see businesses adapting to changing workplace requirements. Teams are growing, offices are evolving and employers are placing greater focus on creating environments where people actually want to work.",
          "We help take some of that pressure away by providing practical solutions and consolidating different workplace requirements through one trusted partner.",
        ],
      },
      {
        question:
          "How do you help clients choose solutions that suit their teams, budgets and day-to-day requirements?",
        answer: [
          "It always starts with asking questions and properly understanding the business. There is no one-size-fits-all approach.",
          "Once we understand how the organisation operates, its priorities and its budget, we can recommend solutions that are practical and realistic rather than simply pushing the most expensive option.",
          "Ultimately, it is about finding the right solution for that particular customer.",
        ],
      },
      {
        question:
          "What workplace trends are businesses paying greater attention to at the moment?",
        answer: [
          "There is definitely more focus on creating workplaces that people genuinely want to spend time in.",
          "Businesses are becoming much more conscious of the impact the workplace environment can have on employee experience, wellbeing and productivity. It is no longer simply about providing desks and equipment – organisations are thinking much more carefully about the overall experience they create for their teams.",
        ],
      },
      {
        question:
          "How important are sustainability and responsible purchasing when businesses are selecting workplace products?",
        answer: [
          "Sustainability is becoming increasingly important. Businesses are much more conscious of where products come from, how they are manufactured and the impact their purchasing decisions can have on the environment.",
          "Our role is to help customers understand the options available to them and make more informed purchasing decisions while still considering quality, practicality and budget.",
        ],
      },
      {
        question:
          "Can you share a memorable client project or solution you have worked on and what made it successful?",
        answer: [
          "We recently worked on a merchandise fit-out project where we were able to support the customer from the initial conversation right through to sourcing and delivering the final solution.",
          "What made the project successful was taking the time to understand exactly what the client needed rather than jumping straight into products.",
          "Seeing everything come together at the end and knowing you have delivered something that works for the customer is incredibly rewarding.",
        ],
      },
      {
        question:
          "What are some of the biggest mistakes businesses make when planning or purchasing for their workplace?",
        answer: [
          "One of the biggest mistakes is focusing purely on price.",
          "Of course, budget is important, but the cheapest option isn’t always the best value in the long run. Quality, reliability, suitability and ongoing service all need to be considered.",
          "Taking a slightly broader view of value can often result in better purchasing decisions and a better outcome for the business.",
        ],
      },
      {
        question:
          "What advice would you give to an organisation looking to improve its workplace but unsure where to begin?",
        answer: [
          "Start by looking at how your workplace is currently functioning.",
          "Think about what is working, what isn’t and where your team is experiencing challenges. From there, speak to one of the many talented sales representatives at Stacked!",
          "Sometimes a conversation is all it takes to identify opportunities that you may not have previously considered.",
        ],
      },
      {
        question:
          "What makes Stacked Workplace Solutions different from other workplace suppliers?",
        answer: [
          "We don’t believe in a one-size-fits-all approach or simply selling products from a catalogue.",
          "Our team is proactive, approachable and knowledgeable about the solutions we provide. We take the time to understand our customers and build relationships with them so that we can support their requirements as their businesses evolve.",
        ],
      },
      {
        question:
          "What are you most looking forward to as Stacked Workplace Solutions enters its next chapter with the launch of the new website?",
        answer: [
          "The new website is a really exciting step for us because it reflects how much Stacked Workplace Solutions has evolved.",
          "We have grown far beyond being a traditional workplace supplies company and the new website gives us the opportunity to showcase the full range of solutions and expertise we can offer.",
          "I’m particularly excited about making it easier for both existing and new customers to explore what we do and discover areas of Workplace Solutions they may not have previously associated with Stacked.",
          "It feels like the beginning of an exciting new chapter and I’m looking forward to seeing how we continue to grow.",
        ],
      },
    ],
    callToAction: {
      heading: "Looking for a smarter approach to workplace solutions?",
      body: [
        "From everyday workplace essentials and furniture to workwear, facilities products, print and promotional merchandise, **Stacked Workplace Solutions helps businesses bring their workplace requirements together through one experienced partner.**",
        "Our team works closely with organisations to understand how their workplaces operate, identify opportunities to simplify purchasing and recommend solutions that work for their people, budgets and day-to-day requirements.",
      ],
      linkLabel: "Talk to the Workplace Solutions team",
      href: "mailto:hello@stacked.example?subject=Workplace%20Solutions%20enquiry",
    },
  },
];

/** Newest first. */
export function getAllPosts(): BlogPost[] {
  return [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function formatPublishedDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

const WORDS_PER_MINUTE = 220;

export function readingMinutes(post: BlogPost): number {
  const text = [
    post.title,
    ...post.intro,
    ...post.questions.flatMap((q) => [q.question, ...q.answer]),
    ...post.callToAction.body,
  ].join(" ");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
