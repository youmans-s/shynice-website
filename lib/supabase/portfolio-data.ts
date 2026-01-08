export type PortfolioProject = {
  id: string
  title: string
  category: string
  summary: string

  // detailed expansion
  role?: string
  details?: string
  techStack?: string[]
  skills?: string[]
  highlights?: string[]

  // media
  image?: string // cover image
  gallery?: { src: string; alt?: string }[]
  demo?: { type: 'youtube'; embedUrl: string } | { type: 'video'; src: string }

  // links
  links?: {
    github?: string
    demo?: string
    site?: string
    linkedin?: string
  }
}

export const CERTIFICATIONS = [
  {
    name: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    year: '2026', // optional
    url: 'https://www.credly.com/', // optional (replace when you have your badge link)
  },
  {
    name: 'AWS Certified Solutions Architect – Associate',
    issuer: 'Amazon Web Services',
    year: '2026',
    url: 'https://www.credly.com/', // optional
  },
] as const


export const PROFILE = {
  firstName: 'Shynice',
  lastName: 'Youmans',
  title: 'Full‑Stack Developer',
  profileImage: '/profile.jpg', // put profile.jpg in /public
  email: 'youmansshynice@gmail.com',
  location: 'Philadelphia, PA',
  resumeUrl: '/resume.pdf',

  socials: {
    github: 'https://github.com/YOUR_GITHUB',
    linkedin: 'https://www.linkedin.com/in/YOUR_LINKEDIN',
    x: 'https://x.com/YOUR_X',
    discord: 'https://discord.com/users/YOUR_ID',
  },
}

export const WHAT_I_DO = [
  {
    title: 'Web Development',
    desc: 'Building fast, clean, responsive web apps with Next.js, React, and TypeScript.',
    style: 'image',
  },
  {
    title: 'Full‑Stack Systems',
    desc: 'APIs, auth, databases, storage — and secure data access with RLS policies.',
    style: 'image',
  },
  {
    title: 'UI / UX Thinking',
    desc: 'Minimal, readable UI with great spacing, interaction design, and accessibility.',
    style: 'text',
  },
  {
    title: 'Cloud & Tools',
    desc: 'Comfortable shipping with modern tooling: CI, deployment, and cloud services.',
    style: 'text',
  },
] as const

export const RESUME = {
  education: [
    {
      time: '2019 – 2024',
      title: 'B.S. Software Engineering',
      org: 'Drexel University',
      meta: 'Minor in Biology • Full‑ride academic scholarship • Liberty Scholarship',
    },
  ],
  experience: [
    {
      time: 'Co‑op',
      title: 'Software Engineering Co‑op',
      org: 'Comcast',
      meta: 'Full‑stack features • UI + APIs • shipped production code',
    },
    {
      time: 'Co‑op',
      title: 'Software Engineering Co‑op',
      org: 'NBME',
      meta: 'Engineering improvements • feature delivery • collaboration',
    },
  ],
  workSkills: ['Next.js', 'React', 'TypeScript', 'Supabase', 'Postgres', 'REST APIs', 'Git', 'Tailwind'],
  softSkills: ['Communication', 'Ownership', 'Teamwork', 'Time Management', 'Mentorship'],
}

export const PROJECTS: PortfolioProject[] = [
  {
    id: 'admin-dashboard',
    title: 'Private Admin Dashboard',
    category: 'Full‑Stack',
    summary: 'A secure admin area for wishlist, outfits, apartments, and debt tracking.',
    role: 'Full‑Stack Developer — designed + built end-to-end features',
    details:
      'Built a private dashboard with authentication, database-driven CRUD, image uploads, and clean UI patterns. Focused on privacy, usability, and real workflow needs.',
    techStack: ['Next.js', 'TypeScript', 'Supabase Auth', 'Postgres', 'Storage', 'RLS', 'Tailwind'],
    skills: ['Auth', 'CRUD', 'Database design', 'Security/RLS', 'UI systems', 'File uploads'],
    highlights: [
      'Secure login + protected routes',
      'Image upload with signed URLs',
      'Editable lists + grouped wishlist categories + totals',
      'Clean dashboard UI and maintainable components',
    ],
    image: '/drexel.jpg',
    links: {
      github: 'https://github.com/YOUR_GITHUB/your-repo',
      demo: 'https://shynice.com/admin', // optional
      site: 'https://shynice.com',
    },
    // Optional gallery (only keep these if you actually have these files)
    // Put images here: public/projects/admin/1.png etc
    gallery: [
      { src: '/projects/admin/1.png', alt: 'Admin dashboard' },
      { src: '/projects/admin/2.png', alt: 'Wishlist view' },
    ],
  },

  {
    id: 'aws-api-demo',
    title: 'AWS + API Demo Project',
    category: 'Cloud / Backend',
    summary: 'A project showcasing AWS skills, APIs, and deployment.',
    role: 'Backend / Cloud Developer — API design + deployment',
    details:
      'Designed and implemented an API-backed workflow with cloud deployment, monitoring, and secure access patterns. Includes documentation and demo artifacts.',
    techStack: ['AWS', 'API Gateway', 'Lambda', 'DynamoDB', 'CloudWatch', 'TypeScript'],
    skills: ['API design', 'Cloud deployment', 'Security', 'Observability', 'System thinking'],
    highlights: [
      'Designed API endpoints + validation',
      'Deployed and monitored cloud functions',
      'Documented system and usage clearly',
    ],
    image: '/comcast.png',
    links: {
      github: 'https://github.com/YOUR_GITHUB/aws-api-demo',
      demo: 'https://your-demo-link.com',
    },
    // Optional demo video:
    // Use an EMBED url (not the normal watch?v= url)
    demo: { type: 'youtube', embedUrl: 'https://www.youtube.com/embed/VIDEO_ID' },
  },

  {
    id: 'linkedin-recognition',
    title: 'Contract Project Spotlight (Repo Private)',
    category: 'Professional Experience',
    summary:
      'Selected work from a contract role. Repository is private due to contract terms, but recognition is public.',
    role: 'Full‑Stack Developer — feature delivery + collaboration',
    details:
      'Delivered features and improvements in a contract environment. Coordinated with stakeholders, shipped work on timelines, and received recognition for impact.',
    techStack: ['React', 'TypeScript', 'APIs', 'SQL', 'Agile delivery'],
    skills: ['Delivery', 'Collaboration', 'Product thinking', 'Communication'],
    highlights: [
      'Shipped features under real constraints',
      'Worked cross-functionally with stakeholders',
      'Recognized publicly for impact',
    ],
    image: '/nbme.png',
    links: {
      linkedin: 'https://www.linkedin.com/in/YOUR_LINKEDIN/posts/POST_ID',
      site: 'https://public-site-link.com',
    },
  },
]
