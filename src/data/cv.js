export const cv = {
  identity: {
    name: 'Idraak Mohd Khan',
    handle: 'idraakk',
    role: 'Software Engineer · Backend, AWS & Agentic AI',
    tagline: 'I build Java backend services on AWS and AI tools that retrieve information and take action.',
    location: 'India',
    timezone: 'Asia/Kolkata',
    available: true,
    availabilityNote: 'Open to Software Engineer / SDE I opportunities',
    yearsExperience: 1,
    avatarInitials: 'IK',
  },

  about: [
    'At Amazon, I modernized a backend-for-frontend with AWS AppSync, rebuilt marketplace expansion APIs in Java, and built configuration workflows with Amazon Bedrock.',
    'At Code Gain Technologies, I built a lecture assistant with hybrid retrieval and streamed LLM responses. My Agentic Browser project brings natural-language automation to the browser.',
  ],

  currently: [
    'Exploring Software Engineer / SDE I opportunities.',
    'Competitive programming: Codeforces Expert.',
  ],

  stats: [
    { label: 'Amazon', value: 'SDE Intern' },
    { label: 'Codeforces', value: 'Expert · 1716' },
    { label: 'Graduation', value: '2026' },
  ],

  experience: [
    {
      title: 'Software Development Engineering Intern',
      company: 'Amazon',
      companyUrl: 'https://www.amazon.jobs/',
      period: 'Jan 2026 — Jun 2026',
      location: 'Bengaluru, India',
      type: 'Internship',
      summary: 'Modernized a production web application, rebuilt APIs for vendor expansion, and automated configuration changes across hundreds of locations.',
      stack: ['Java', 'GraphQL', 'AWS AppSync', 'DynamoDB', 'SQS FIFO', 'ECS Fargate', 'AWS CDK', 'Amazon Bedrock'],
      projects: {
        'Selection & Growth Hub': [
          'Replaced a Spring Boot backend-for-frontend with an AWS AppSync GraphQL gateway, designing the schemas, data sources, and resolvers.',
          'Moved configuration to offline artifacts for local browser reads, eliminating a three-hop runtime lookup. Rolled the new gateway out to 100% of production traffic and retired the legacy ECS-backed pipeline.',
        ],
        'Marketplace Expansion Service': [
          'Rebuilt the Java APIs for marketplace status and vendor expansion on native AWS. Replaced per-marketplace DynamoDB lookups with BatchGetItem and retries for unprocessed keys.',
          'Used batched SQS FIFO publishing, conditional writes, and idempotent request handling to prevent duplicate submissions and support per-marketplace retries.',
          'Provisioned API Gateway, VPC Link, NLB, and ECS Fargate via AWS CDK. Replaced seven legacy hosts with a three-task baseline and added CloudWatch monitoring, integration tests, and automated rollback safeguards.',
        ],
        'Agentic Configuration Management Platform': [
          'Built a ticket-triggered Amazon Bedrock agent that uses tool calling and business rules to identify and validate configuration changes and open code reviews.',
          'Built an onboarding platform that generates location-specific configurations and code reviews with merge-conflict resolution for a system managing 3,000+ attributes across hundreds of locations.',
        ],
      },
    },
    {
      title: 'AI Engineering Intern',
      company: 'Code Gain Technologies Pvt. Ltd.',
      companyUrl: null,
      period: 'Jul 2025 — Dec 2025',
      location: 'Remote',
      type: 'Internship',
      summary: 'Built an AI study assistant that turns YouTube videos and uploaded lectures into searchable material, summaries, and quizzes.',
      stack: ['Python', 'FastAPI', 'RAG', 'PostgreSQL', 'React', 'TypeScript'],
      projects: {
        'RAG-Based YouTube Lecture Assistant': [
          'Built question answering, summaries, and quiz generation for YouTube and uploaded lectures using FastAPI, React, TypeScript, and PostgreSQL.',
          'Combined lexical and embedding-based semantic search, ranking results with Jaccard and cosine similarity.',
          'Integrated configurable LLM providers with server-sent event streaming, fallback models, and retries for rate limits and transient failures.',
        ],
      },
    },
  ],

  education: [
    {
      degree: 'B.Tech.',
      university: 'Jaypee Institute of Information Technology, Noida',
      year: '2022 — 2026',
      field: 'Electronics and Communication Engineering',
    },
    {
      degree: 'BS Foundation Program',
      university: 'Indian Institute of Technology, Madras',
      year: '2023 — 2024',
      field: 'Data Science and Programming',
    },
  ],

  certifications: [],

  skills: {
    languages: ['Java', 'Python', 'JavaScript'],
    coreCS: ['Data Structures and Algorithms', 'Object-Oriented Programming', 'SOLID Principles', 'DBMS', 'Distributed Systems'],
    backend: ['Spring Boot', 'FastAPI', 'REST APIs', 'GraphQL', 'Microservices'],
    frontend: ['React', 'TypeScript'],
    databases: ['PostgreSQL', 'DynamoDB', 'SQL'],
    ai: ['LLMs', 'RAG', 'LangChain', 'LangGraph', 'Model Context Protocol (MCP)', 'AI Agents', 'Tool Calling', 'Hybrid Retrieval'],
    infrastructure: ['AWS AppSync', 'API Gateway', 'VPC', 'Network Load Balancer (NLB)', 'ECS Fargate', 'SQS', 'IAM', 'AWS CDK', 'CloudWatch', 'Infrastructure as Code'],
    testingAndTools: ['JUnit', 'Integration Testing', 'End-to-End Testing', 'Git', 'GitHub', 'CI/CD Pipelines'],
  },

  collection: {
    name: 'Idraak’s Collection',
    url: 'https://idraakk.github.io/Idraak-Collection/',
    repo: 'https://github.com/idraakk/Idraak-Collection',
    description: 'I build and publish independent software. Explore the collection to see what I’ve shipped and try it yourself.',
  },

  products: [
    {
      name: 'MicroGram',
      platform: 'Android',
      status: 'Available now',
      tagline: 'Turn long videos into short learning sessions.',
      description: 'MicroGram turns YouTube videos and playlists into swipeable learning reels. Choose a reel length, save frames with your own notes, and pick up where you left off.',
      url: 'https://idraakk.github.io/Idraak-Collection/microgram/index.html',
      previewUrl: 'https://idraakk.github.io/Microgram_Preview_Web/',
      screenshots: [
        { src: 'microgram-lecture-profile.webp', alt: 'MicroGram lecture overview showing progress and a grid of short reels' },
        { src: 'microgram-library.webp', alt: 'MicroGram Library showing imported videos and playlists' },
        { src: 'microgram-reel.webp', alt: 'MicroGram full-screen reel player showing a lecture' },
      ],
    },
  ],

  projects: [
    {
      name: 'Agentic Browser',
      cover: {
        src: 'agentic-browser.webp',
        alt: 'Illustrative Agentic Browser demo. The extension reads a trail guide and finds the shortest trail.',
        width: 1774,
        height: 887,
      },
      tagline: 'An AI-powered browser extension that turns natural-language requests into browser actions.',
      description: 'Uses DOM snapshots and page screenshots to plan and execute nine browser action types with step limits and execution feedback. LangGraph coordinates ReAct and multi-agent workflows with live SSE updates. The FastAPI backend supports six LLM providers, PostgreSQL-backed memory with vector retrieval, and an MCP server for external coding agents.',
      url: 'https://github.com/idraakk/Agentic_Browser',
      stack: ['Python', 'FastAPI', 'LangGraph', 'React', 'TypeScript', 'PostgreSQL', 'MCP'],
      period: 'Jul 2026 — Sep 2026',
      status: 'source available',
    },
  ],

  contact: {
    email: 'idraakmk@gmail.com',
    phone: '+91 89542 24341',
    calendar: null,
    location: 'India',
  },

  social: [
    { label: 'GitHub', handle: '@idraakk', url: 'https://github.com/idraakk' },
    { label: 'LinkedIn', handle: 'Idraak Mohd Khan', url: 'https://www.linkedin.com/in/idraak' },
    { label: 'Codeforces', handle: 'Expert · 1716', url: 'https://codeforces.com/profile/Zaxas' },
    { label: 'LeetCode', handle: 'aaron1april', url: 'https://leetcode.com/u/aaron1april/' },
  ],

  meta: {
    lastUpdated: '2026-11-18',
    version: '1.0.0',
    license: 'MIT',
    repo: 'github.com/idraakk/Portfolio_Website',
  },
};

export const FILES = [
  { id: 'about', name: 'about.md', path: 'src/about.md', language: 'markdown', icon: 'md' },
  { id: 'experience', name: 'experience.json', path: 'src/experience.json', language: 'json', icon: 'json' },
  { id: 'education', name: 'education.yml', path: 'src/education.yml', language: 'yaml', icon: 'yml' },
  { id: 'skills', name: 'skills.ts', path: 'src/skills.ts', language: 'typescript', icon: 'ts' },
  { id: 'projects', name: 'projects.tsx', path: 'src/projects.tsx', language: 'tsx', icon: 'tsx' },
  { id: 'products', name: 'products.md', path: 'src/products.md', language: 'markdown', icon: 'md' },
  { id: 'contact', name: 'contact.sh', path: 'src/contact.sh', language: 'shell', icon: 'sh' },
];
