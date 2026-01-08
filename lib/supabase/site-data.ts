export const PROFILE = {
  name: 'Shynice Joyce Youmans',
  title: 'Software Engineer',
  headshot: '/me.jpg',

  bio: [
    "I’m a software engineer focused on building clean, user-centered applications with strong engineering fundamentals.",
    'I enjoy full‑stack development, shipping polished UI, and building tools that make life easier.',
  ],

  stats: [
    { value: '3', label: 'Years in software engineering' },
    { value: '2', label: 'Co-ops completed' },
    { value: 'B.S.', label: 'Software Engineering' },
  ],

  experience: [
    {
      company: 'Comcast',
      logo: '/comcast.png',
      role: 'Software Engineer Co-op',
      dates: '202X',
      bullets: [
        'Built ______ feature and improved ______.',
        'Worked with ______ and shipped ______.',
      ],
    },
    {
      company: 'National Board Medical Examiners',
      logo: '/nbme.png',
      role: 'Software Engineer Co-op',
      dates: '202X',
      bullets: [
        'Implemented ______ and reduced ______ by __%.',
        'Collaborated with ______ to deliver ______.',
      ],
    },
  ],

  education: {
    school: 'Drexel University',
    logo: '/drexel.jpg',
    degree: 'B.S. Software Engineering',
    minor: 'Biology',
    scholarships: ['Full Ride Academic Scholarship- Liberty Scholarship'],
  },

  links: {
    github: 'YOUR_GITHUB_LINK',
    linkedin: 'YOUR_LINKEDIN_LINK',
    email: 'YOUR_EMAIL',
  },
}

export type Project = {
  slug: string
  title: string
  description: string
  skills: string[]
  stack: string[]
  image?: string // local image in /public
  demo?: {
    type: 'youtube' | 'mp4'
    src: string // youtube embed URL or /public mp4 path
  }
  highlights: string[]
  links?: { label: string; href: string }[]
}

export const PROJECTS: Project[] = [
  {
    slug: 'aws-serverless-api',
    title: 'AWS Serverless API Platform',
    description:
      'Designed and built a serverless REST API with secure auth, scalable endpoints, and automated deployments. Demonstrates AWS fundamentals + real API engineering.',
    skills: ['AWS', 'API Design', 'Security', 'CI/CD', 'System Design'],
    stack: ['API Gateway', 'Lambda', 'DynamoDB', 'CloudWatch', 'GitHub Actions'],
    image: '/aws-api.png',
    demo: {
      type: 'youtube',
      // Replace this with your embed URL: https://www.youtube.com/embed/<VIDEO_ID>
      src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    highlights: [
      'Designed REST routes + request validation',
      'Implemented auth + secure access patterns',
      'Automated deployments with CI/CD',
    ],
    links: [
      { label: 'GitHub', href: 'YOUR_GITHUB_PROJECT_LINK' },
      { label: 'Live Demo', href: 'YOUR_DEMO_LINK' },
    ],
  },
  {
    slug: 'apartment-dashboard',
    title: 'Private Apartment Dashboard',
    description:
      'A secure admin-only dashboard to track apartment options with photos, ratings, notes, and detail pages.',
    skills: ['Full‑Stack', 'Auth', 'Database Design', 'UX/UI'],
    stack: ['Next.js', 'TypeScript', 'Supabase Auth', 'Postgres', 'RLS'],
    image: '/projects/apartments.jpg',
    highlights: ['Admin-only access', 'Image uploads', 'List + detail flows'],
    links: [{ label: 'GitHub', href: 'YOUR_GITHUB_PROJECT_LINK' }],
  },
  {
    slug: 'api-integration-app',
    title: 'API Integration App',
    description:
      'An app that integrates multiple third-party APIs, normalizes responses, and presents data in a clean UI with error handling and caching.',
    skills: ['APIs', 'Async Patterns', 'Error Handling', 'Frontend UX'],
    stack: ['React', 'TypeScript', 'Node.js', 'REST', 'Caching'],
    image: '/projects/apis.jpg',
    highlights: ['Robust error handling', 'Clean UI states', 'API normalization layer'],
    links: [{ label: 'GitHub', href: 'YOUR_GITHUB_PROJECT_LINK' }],
  },
]
