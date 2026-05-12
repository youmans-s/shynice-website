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
    year: 'April 2026',
    url: 'https://www.credly.com/badges/0b326e99-5426-4605-81af-7e4e6f24ad91/public_url',
  },
  {
    name: 'AWS Certified Solutions Architect – Associate',
    issuer: 'Amazon Web Services • In Progress',
    year: 'Expected June 2026',
    url: '',
  },
] as const

export const PROFILE = {
  firstName: 'Shynice',
  lastName: 'Youmans',
  title: 'Software Engineer',
  profileImage: '/profile.jpg',
  email: 'youmansshynice@gmail.com',
  location: 'Philadelphia, PA',
  resumeUrl: '/Shynice_Youmans_Resume.pdf',

  socials: {
    github: 'https://github.com/youmans-s',
    linkedin: 'https://www.linkedin.com/in/sjyoumans',
  },
}

export const WHAT_I_DO = [
  {
    title: 'Full‑Stack Development',
    desc: 'Building clean, responsive web apps with Next.js, React, TypeScript, and Spring Boot on the backend.',
    style: 'image',
  },
  {
    title: 'Privacy & Security Engineering',
    desc: 'PII/PHI de-identification, secure data handling, and applying privacy threat modeling to cloud systems.',
    style: 'image',
  },
  {
    title: 'Cloud & AWS',
    desc: 'AWS Lambda, IAM, S3, CodePipeline. AWS Cloud Practitioner certified; studying for Solutions Architect Associate.',
    style: 'text',
  },
  {
    title: 'APIs & Data',
    desc: 'REST API design, PostgreSQL, request validation, and writing the tests that keep them honest.',
    style: 'text',
  },
] as const

export const RESUME = {
  education: [
    {
      time: '2019 – Sept. 2025',
      title: 'B.S. Software Engineering',
      org: 'Drexel University',
      bullets: [
        'Minor in Biology',
        'Liberty Scholarship — Full-Tuition Merit Award',
      ],
    },
  ],
  experience: [
    {
      time: 'April 2024 – Sept. 2024',
      title: 'Privacy & Data Protection Engineer – Co-op',
      org: 'Comcast (Cybersecurity Division)',
      bullets: [
        'Contributed to an enterprise de-identification risk engine for PII/PHI exposure',
        'Expanded automated test coverage on AWS Lambda functions supporting the engine',
        'Deployed Lambda tools that automated PII/PHI scanning within data pipelines',
        'Participated in monthly compliance reviews and tracked remediation in Jira',
      ],
    },
    {
      time: 'April 2023 – Sept. 2023',
      title: 'System Administrator – Co-op',
      org: 'NBME (National Board of Medical Examiners)',
      bullets: [
        'Integrated Jira Cloud with AWS CodePipeline/CodeBuild for unified audit trails',
        'Built custom Jira workflows with JMWE and Nunjucks for automated logging and access rules',
        'Authored Bash scripts for audit workflows across AWS and Jira',
      ],
    },
  ],
  workSkills: [
    'Java',
    'Python',
    'TypeScript',
    'JavaScript',
    'Spring Boot',
    'React',
    'Next.js',
    'AWS Lambda',
    'REST APIs',
    'PostgreSQL',
    'Bash',
    'Git',
    'CI/CD',
  ],
  softSkills: ['Communication', 'Ownership', 'Teamwork', 'Cross-functional Collaboration', 'Time Management'],
}

export const PROJECTS: PortfolioProject[] = [
  {
    id: 'profit-quest',
    title: 'Profit Quest',
    category: 'Full‑Stack • Team Project',
    summary:
      'A full-stack investment competition platform with real-time portfolio tracking, live market data, and REST APIs. Built with a Drexel team for senior capstone.',
    role: 'Backend / API Developer — REST endpoints, validation, and testing',
    details:
      'Java + Spring Boot backend serving REST APIs to a React/TypeScript frontend, with live market data integration for real-time gameplay. Designed and implemented endpoints with input validation, error handling, and unit testing. Featured publicly on both the live app and the team showcase page.',
    techStack: ['Java', 'Spring Boot', 'React', 'TypeScript', 'PostgreSQL', 'REST APIs'],
    skills: ['REST API design', 'Backend testing', 'Team collaboration', 'Agile delivery'],
    highlights: [
      'Real-time portfolio + leaderboard data via REST APIs',
      'Live market data integration with type-safe React frontend',
      'Endpoint design with validation, error handling, and unit tests',
      'Featured on team / business showcase page',
    ],
    links: {
      site: 'https://www.profitquest.app/',
      demo: 'https://ghill.com/profitquest/',
    },
  },
  {
    id: 'admin-dashboard',
    title: 'Private Admin Dashboard',
    category: 'Full‑Stack • Personal',
    summary:
      'A secure, private dashboard I built for myself to handle real personal-workflow data — wishlists, outfits, apartments, debt tracking.',
    role: 'Full‑Stack Developer — designed + built end-to-end',
    details:
      'Built with authentication, row-level security, signed image upload URLs, and an editable interface for grouped lists with running totals. Focused on privacy patterns, usability, and maintainable component architecture.',
    techStack: ['Next.js', 'TypeScript', 'Supabase Auth', 'PostgreSQL', 'Supabase Storage', 'RLS', 'Tailwind'],
    skills: ['Authentication', 'Row-level security', 'Database design', 'File uploads', 'UI systems'],
    highlights: [
      'Secure login + protected routes via Supabase Auth',
      'Image uploads with signed URLs',
      'Editable lists with grouped categories + running totals',
      'PostgreSQL schema designed with row-level security policies',
    ],
  },
  {
    id: 'personal-site',
    title: 'shynice.com — This Site',
    category: 'Full‑Stack • Personal',
    summary:
      'The portfolio you\'re currently viewing. Designed and built from scratch with Next.js, deployed on Vercel.',
    role: 'Designer + Developer — full design and implementation',
    details:
      'Designed and built my own portfolio with a focus on clean typography, responsive layout, and a layered gradient/glassmorphic card UI. Deployed on Vercel with continuous deployment from main.',
    techStack: ['Next.js', 'TypeScript', 'React', 'Tailwind CSS', 'Vercel'],
    skills: ['UI design', 'Component architecture', 'Responsive layout', 'Continuous deployment'],
    highlights: [
      'Custom layout with gradient frame and glassmorphic cards',
      'Reusable PortfolioShell component for consistent sidebar across pages',
      'Auto-deployed on Vercel from main branch',
    ],
    links: {
      site: 'https://shynice.com',
    },
  },
]