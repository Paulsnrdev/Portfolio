// Single source of truth for project content, rendered into both
// index.html (#featured-projects) and projects.html (#all-projects)
// by script.js. Add an `image` field later to show real screenshots
// without touching the render logic. Add a `caseStudy` object later
// to support a dedicated case-study page per project.

const PROJECTS = [
  {
    slug: "storehike",
    name: "StoreHike",
    tagline: "Storefront and checkout platform for Instagram & WhatsApp sellers",
    problem: "Sellers running a business entirely through DMs have no real storefront, checkout flow, or order system.",
    role: "Sole developer (architecture, backend, and frontend)",
    stack: ["Next.js 15", "React 19", "TypeScript", "Prisma", "PostgreSQL", "NextAuth", "Paystack", "Cloudinary", "Upstash Redis"],
    features: [
      "Hosted storefronts with product catalog and cart",
      "Paystack checkout and order management",
      "Rate-limited auth backed by Upstash Redis"
    ],
    live: "https://storehike.site",
    repo: "https://github.com/Paulsnrdev/Store-Builder",
    categories: ["Full-Stack", "SaaS", "E-commerce"],
    featured: true
  },
  {
    slug: "cronvend",
    name: "CronVend",
    tagline: "Automated email sequences that recover lost e-commerce revenue",
    problem: "E-commerce stores lose sales to abandoned carts with no automated way to follow up.",
    role: "Sole developer",
    stack: ["Node.js", "JavaScript", "Scheduled jobs", "Multi-tenant architecture"],
    features: [
      "Cart-recovery email sequences",
      "Post-delivery follow-up and upsell flows",
      "Multi-tenant, built to serve multiple stores"
    ],
    live: "https://cronvend.site",
    repo: "https://github.com/Paulsnrdev/CronVend",
    categories: ["Backend", "SaaS"],
    featured: true
  },
  {
    slug: "chunkz-cart",
    name: "CHUNKZ Cart Store",
    tagline: "The live commerce platform running my own clothing brand",
    problem: "CHUNKZ needed a fast, reliable storefront to sell directly instead of running exclusively through DMs.",
    role: "Founder and developer (built and run this myself)",
    stack: ["HTML5", "CSS3", "JavaScript"],
    features: [
      "Live product catalog and cart",
      "Performance-optimized for mobile shoppers",
      "Built and maintained for a real, operating brand"
    ],
    live: "https://chunkzthebrand.com",
    repo: "https://github.com/Paulsnrdev/CHUNKZ-CART-STORE",
    categories: ["Frontend", "E-commerce"],
    featured: true
  },
  {
    slug: "lumiere-studio",
    name: "Lumière Studio",
    tagline: "Award-winning photography studio website — bookings, gallery & portfolio",
    problem: "Independent photography studios need a fast, elegant online presence to showcase their portfolio and convert visitors into booked sessions, without the cost or overhead of a full CMS or backend.",
    role: "Frontend Developer",
    stack: ["HTML", "CSS", "JavaScript", "Formspree"],
    features: [
      "Responsive 6-page layout (Home, Gallery, Services, About, Contact, Booking)",
      "Auto-rotating hero slider with keyboard navigation",
      "Filterable masonry gallery with swipeable lightbox",
      "Scroll-reveal animations via IntersectionObserver",
      "Testimonials carousel",
      "Client-side validated contact & booking forms (Formspree)",
      "Clean, extensionless URLs via Vercel rewrites"
    ],
    live: "https://lumiere-photos.vercel.app",
    repo: "https://github.com/Paulsnrdev/Photographyweb",
    categories: ["Frontend", "Other"],
    featured: true
  },
  {
    slug: "imep",
    name: "IMEP",
    tagline: "Internship logbook, attendance, and grading platform",
    problem: "Manual internship logbooks and attendance tracking are slow and hard to grade fairly.",
    role: "Sole developer",
    stack: ["React", "Redux Toolkit", "Vite", "Node.js", "Express", "MongoDB", "BullMQ", "Redis", "JWT", "Firebase"],
    features: [
      "Digital logbook submission and attendance check-in",
      "Background job processing with BullMQ and Redis",
      "JWT auth with Firebase integration"
    ],
    live: "https://imep-project.vercel.app",
    repo: "https://github.com/Paulsnrdev/imep-project",
    categories: ["Full-Stack", "Backend"],
    featured: false
  },
  {
    slug: "dominic-pro-tools",
    name: "Dominic Pro Tools",
    tagline: "Product catalog for a power and hand tools retailer",
    problem: "A real tools retailer needed an online catalog with cart and admin management.",
    role: "Freelance developer",
    stack: ["HTML5", "CSS3", "JavaScript"],
    features: [
      "Categorized product catalog",
      "Cart functionality",
      "Admin panel for inventory"
    ],
    live: "https://dominicprotools.com",
    repo: "https://github.com/Paulsnrdev/Dominic-Pro-Tools",
    categories: ["Frontend", "E-commerce"],
    featured: false
  },
  {
    slug: "safeinea",
    name: "SAFEinEA Incorporated",
    tagline: "Website for a safety and health training company",
    problem: "A safety-training organization needed a professional, client-facing web presence.",
    role: "Freelance developer",
    stack: ["HTML5", "CSS3", "JavaScript"],
    features: [
      "Course and training information pages",
      "Responsive, client-facing design"
    ],
    live: "https://www.safeinea.ca/",
    repo: "https://github.com/Paulsnrdev/SAFEinEA_Incorporated",
    categories: ["Frontend", "Other"],
    featured: false
  },
  {
    slug: "forza-food-hub",
    name: "Forza Food Hub",
    tagline: "Ordering site for a cafeteria and food business",
    problem: "A food business needed a fast, mobile-friendly ordering experience.",
    role: "Developer",
    stack: ["HTML5", "CSS3", "JavaScript"],
    features: [
      "Menu browsing",
      "Performance-optimized, mobile-first layout"
    ],
    live: "https://forzafood.vercel.app",
    repo: "https://github.com/Paulsnrdev/forza-food-hub",
    categories: ["Frontend", "Other"],
    featured: false
  },
  {
    slug: "invoice-generator",
    name: "Invoice Generator",
    tagline: "Browser-only invoice tool with PDF export",
    problem: "Freelancers need to generate clean invoices without signing up for software.",
    role: "Sole developer",
    stack: ["React", "Vite", "Tailwind CSS"],
    features: [
      "No login or backend, runs entirely client-side",
      "Saves locally and exports to PDF"
    ],
    live: "https://invoice-generator-green-pi.vercel.app",
    repo: "https://github.com/Paulsnrdev/Invoice-Generator",
    categories: ["Frontend", "Other"],
    featured: false
  },
  {
    slug: "agentai",
    name: "AgentAI (Concept)",
    tagline: "Marketing site concept for a fictional AI consultancy",
    problem: "Design and build exercise: a marketing site for a hypothetical AI consultancy.",
    role: "Sole developer",
    stack: ["HTML5", "CSS3", "JavaScript"],
    features: [
      "Single-page marketing layout",
      "No build step, no dependencies"
    ],
    live: "https://agentai-gamma.vercel.app",
    repo: "https://github.com/Paulsnrdev/AgentAi",
    categories: ["Frontend", "Other"],
    featured: false
  },
  {
    slug: "summit-auto-group",
    name: "Summit Auto Group",
    tagline: "Dealership site for new & pre-owned vehicles in Houston, TX",
    problem: "A car dealership needed a fast, browsable site for inventory, financing, and trade-in requests instead of relying only on third-party listing sites.",
    role: "Freelance developer",
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS"],
    features: [
      "Vehicle inventory browsing by type with detail pages",
      "Financing pre-approval and trade-in request forms",
      "Service & parts and current specials pages"
    ],
    live: "https://automobile-summit.vercel.app/",
    repo: "https://github.com/Paulsnrdev/automobile-website",
    categories: ["Frontend", "Other"],
    featured: true
  },
  {
    slug: "flowpro-plumbing",
    name: "FlowPro Plumbing",
    tagline: "Marketing site for a plumbing repair business",
    problem: "A plumbing business needed a fast, trustworthy site that converts visitors into service calls.",
    role: "Freelance developer",
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS"],
    features: [
      "Services and past-projects showcase",
      "Clear calls to action for booking repairs",
      "Fast, mobile-first marketing pages"
    ],
    live: "https://flowpro-services.vercel.app/",
    repo: "https://github.com/Paulsnrdev/flowpro-plumbing",
    categories: ["Frontend", "Other"],
    featured: false
  },
  {
    slug: "simply-furniture",
    name: "Simply Furniture",
    tagline: "Marketing site for a furniture brand",
    problem: "A furniture brand needed a clean, browsable site to showcase collections and drive customer inquiries.",
    role: "Freelance developer",
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS"],
    features: [
      "Shop and collections pages for armchairs, chairs, and sofas",
      "FAQ, shipping, and returns info for customers",
      "Accessible UI with reduced-motion support"
    ],
    live: "https://simply-furniture.vercel.app",
    repo: "https://github.com/Paulsnrdev/simply-furniture",
    categories: ["Frontend", "Other"],
    featured: false
  },
  {
    slug: "security-scanner",
    name: "Security Scanner",
    tagline: "Paste a URL, get a full security audit in seconds. No signup required.",
    problem: "Checking a site's security posture (headers, TLS, DNS, WHOIS, hosting, performance) usually means stitching together several paid tools or manually running checks before every deploy. This gives you all of it from one URL, instantly, plus a gated load-testing feature for domains you have verified you own, safe enough to run publicly without becoming an open DoS tool.\n",
    role: "Solo Developer",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Upstash Redis", "Undici", "autocannon", "Vercel"],
    features: [
      "SSRF-safe URL scanner: security headers, TLS/SSL, DNS, WHOIS, hosting/CDN, performance",
      "Shareable scan results via permanent links",
      "Per-browser scan history, no account required",
      "Domain ownership verification via DNS TXT record or file upload",
      "Gated load testing, unlocked only for verified domains",
      "IP-pinned requests to close DNS-rebinding SSRF gaps",
      "Redis-backed persistence, no relational database",
      "Per-domain and per-IP rate limiting on public endpoints"
    ],
    live: "https://security-scanner-tester.vercel.app",
    repo: "https://github.com/Paulsnrdev/security-scanner-web",
    categories: ["Security", "Developer Tools", "Full Stack", "Next.js"],
    featured: true
  }
];

const PROJECT_CATEGORIES = ["All", "Frontend", "Full-Stack", "SaaS", "E-commerce", "Backend", "Other"];

// Also usable via require() from the Node server (seed script), while staying
// a plain global script for the browser.
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PROJECTS, PROJECT_CATEGORIES };
}
