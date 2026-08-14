// Seed values pulled from the current hardcoded site copy (index.html / projects-data.js),
// so the dashboard opens pre-populated instead of blank.

const { PROJECTS } = require('../../projects-data.js');

const INITIAL_CONTENT = {
  navbar: {
    logoText: 'Paul Oluwasegun',
    hireLink: 'paulstackweb@gmail.com'
  },
  hero: {
    badge: 'Open to internships, freelance & collaborations',
    titleLine1: 'Ajibade Paul',
    titleAccent: 'Oluwasegun',
    subtitle: 'Full-Stack Developer · Founder, CHUNKZ',
    description:
      "I build full-stack web apps, SaaS products, and e-commerce platforms. Then I run my own clothing brand on top of the tools I build. Idea to deployed product, end to end.",
    terminalLines: [
      'Ajibade Paul Oluwasegun',
      'Next.js · React · Node.js · PostgreSQL',
      'Building StoreHike, PageBuilder, CronVend\nFounder @ CHUNKZ'
    ]
  },
  expertise: {
    categories: [
      { name: 'Frontend', skills: ['React', 'Next.js', 'TypeScript', 'JavaScript ES6+', 'Tailwind CSS', 'HTML5 / CSS3'] },
      { name: 'Backend', skills: ['Node.js', 'Express', 'REST APIs', 'Authentication', 'Background Jobs'] },
      { name: 'Database', skills: ['MongoDB', 'PostgreSQL', 'Prisma', 'Firebase'] },
      { name: 'Tools & Deployment', skills: ['Git', 'GitHub', 'Vercel', 'Cloudinary', 'Paystack'] }
    ]
  },
  projects: PROJECTS,
  testimonials: [],
  faq: [],
  footer: {
    logoText: 'Ajibade Paul Oluwasegun',
    roleText: 'Full-Stack Developer & Founder, CHUNKZ',
    links: [
      { label: 'Home', href: '#home' },
      { label: 'About', href: '#about' },
      { label: 'Projects', href: 'projects.html' },
      { label: 'Contact', href: '#contact' }
    ],
    copyright: '© 2026 Ajibade Paul Oluwasegun.'
  },
  about: {
    paragraphs: [
      "I'm a Computer Science student at Bowen University who builds full-stack web applications, from database schema to deployed UI. My focus is SaaS products, e-commerce platforms, and the backend systems that keep them running.",
      "As the founder of CHUNKZ, I don't just design software for other businesses. I run one. I built and maintain the storefront that sells CHUNKZ products, which means I feel the same problems my clients hire me to solve.",
      "I care about clean architecture, honest scope, and shipping things that actually work in production, not just in a demo. Currently open to internships, freelance projects, and collaborative builds."
    ],
    stats: [
      { label: 'Full-Stack', value: 'Frontend + Backend' },
      { label: 'SaaS', value: 'Product Development' },
      { label: 'E-commerce', value: 'Storefronts + Payments' },
      { label: 'Automation', value: 'Background Jobs + Email' }
    ],
    highlights: [
      { title: 'Freelance Developer', subtitle: 'Real clients, deployed sites' },
      { title: 'Student Teacher', subtitle: 'HTML & CSS instructor' }
    ],
    education: {
      school: 'Bowen University',
      degree: 'B.Sc. Computer Science',
      period: '2022 to Present',
      coursework: ['Data Management', 'Operating Systems', 'Computer Architecture', 'Compiler Construction', 'Computer Networks']
    }
  }
};

module.exports = INITIAL_CONTENT;
