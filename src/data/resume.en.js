export const resumeData = {
  personalInfo: {
    name: 'Mario Faúndez',
    title: 'AI Platform & GenOps Lead',
    contact: {
      phone: '+56 984-255-714',
      email: 'mariofaundezvidal@gmail.com',
      location: 'Santiago, Chile',
    },
  },
  profile: {
    text: `Professional with <strong>15+ years</strong> leading technology platforms and high-performing teams. Today I am in charge of Kairos, Falabella Group's <strong>AI Developer Platform</strong>, through which teams adopt <strong>artificial intelligence</strong> in a self-service, secure, and <strong>governed</strong> way, automating processes with generative AI and agents. I combine a Master's in Artificial Intelligence with a solid background in DevOps and <strong>Platform Engineering</strong> to turn business needs into scalable, measurable solutions.

  My focus is on <strong>value capture</strong>: operational efficiency, cost control, clear operating models, and the development of organizational capabilities. I foster cross-team collaboration, continuous improvement, and data-driven decisions.`,
  },

  socialLinks: [
    {
      platform: 'linkedin',
      url: 'https://www.linkedin.com/in/mariofaundez',
      display: 'linkedin.com/in/mariofaundez',
    },
    {
      platform: 'github',
      url: 'https://www.github.com/ordenador',
      display: 'github.com/ordenador',
    },
  ],
  education: [
    {
      degree: "Master's Degree in Artificial Intelligence",
      institution: 'Pontificia Universidad Católica de Chile',
      period: '2021 - 2022',
      location: 'Santiago, Chile',
    },
    {
      degree: 'Diploma, Management and Evaluation of Computing Projects and Projects Management',
      institution: 'Universidad de Chile',
      period: '06/2013 - 12/2013',
      location: 'Santiago, Chile',
    },
    {
      degree: 'Civil Computer Engineering',
      institution: 'Universidad Tecnológica Metropolitana',
      period: '2005 - 2010',
      location: 'Santiago, Chile',
      details: ['Titled with distinction'],
    },
  ],
  experience: [
    {
      title: 'AI Platform Lead (GenOps Lead)',
      company: 'Falabella Group',
      period: 'Mar 2026 - Present',
      duration: '',
      location: 'Santiago, Chile',
      workType: 'Hybrid',
      responsibilities: [
        "I lead Kairos, Falabella Group's AI Developer Platform (agentic platform): multi-tenant, where teams create, deploy, and operate generative AI applications and agents in self-service, with governed access to models, fine-grained permissions, usage traceability, and cost control.",
        'I enable AI capabilities for teams across the company, coordinating a multidisciplinary team (AI platform engineers, agent architects, DevSecOps) and internal and external resources.',
        'I advise AI initiatives from different areas together with GenAI architects: we define shared technical standards and adjust the platform roadmap so they are applied through it.',
        'I drive the standardization of agents and integrations via MCP on the platform, defining a governed path for their adoption across retail and financial use cases.',
        'I promote the development of AI capabilities across the organization through the Kairos InnerSource initiative, fostering a data-driven culture and pushing the company to become AI-driven.',
      ],
    },
    {
      title: 'AI Platform Lead (GenOps Lead)',
      company: 'Falabella Financiero',
      period: 'May 2024 - Feb 2026',
      duration: '1 yr 10 mos',
      location: 'Santiago, Chile',
      workType: 'Hybrid',
      responsibilities: [
        'Leader of the GenOps Initiative: designed the foundational architecture of a unified AI platform for Falabella Financiero - simplifying access to diverse models and strengthening the security, privacy, and cost management of data and AI consumption.',
        'Speaker at Google Cloud Summit Chile 2025 ("Reimagining customer experience with conversational AI: the Banco Falabella case"): conversational solutions on Kairos, securely scaled on the bank\'s WhatsApp channel for critical service flows.',
      ],
    },
    {
      title: 'DevOps Lead - R&D, Developer Experience Team',
      company: 'Falabella Financiero',
      period: '11/2023 - 04/2025',
      duration: '1 yr 6 mos',
      location: 'Santiago, Chile',
      responsibilities: [
        'Led the Developer Experience teams and platform architecture standards, focused on operational efficiency.',
        'Redesigned and automated deployment processes, removing manual tasks and inefficiencies and capturing yearly efficiencies.',
        'Generative AI product that mines knowledge from past incidents, reducing resolution times and strengthening the knowledge base.',
        'Evolved and managed the internal tooling portfolio, optimizing resource and budget consumption.',
      ],
    },
    {
      title: 'DevOps Lead - R&D Team in Architecture',
      company: 'Falabella Financiero',
      period: '11/2020 - 10/2023',
      duration: '3 yrs',
      location: 'Santiago, Chile',
      responsibilities: [
        'Led the team promoting DevOps adoption and continuous process improvement for the benefit of the organization.',
        'Cross-area synergies facilitating collaboration with 5 platform teams, standardizing processes and eliminating duplicated efforts.',
        'Implemented and standardized Backstage (internal developer portal), enabling self-service and improving access to information.',
        'Defined Kubernetes usage across all Falabella Financiero platform teams, in coordination with technology vendors.',
      ],
    },
    {
      title: 'DevOps Lead - New Technologies Team',
      company: 'Falabella Financiero',
      period: '07/2019 - 10/2020',
      duration: '1 yr 4 mos',
      location: 'Santiago, Chile',
      responsibilities: [
        'Leading team that improves and proposes new technologies so the components implementing DevOps accomplished the latest industry standards.',
        'Implemented advanced monitoring and alerts using Prometheus, enhancing system reliability.',
        'Encourage the use of Kubernetes.',
      ],
    },
    {
      title: 'DevOps Engineer',
      company: 'Falabella Financiero',
      period: '10/2017 - 06/2019',
      duration: '1 yr 9 mos',
      location: 'Santiago, Chile',
      responsibilities: [
        'Advanced infrastructure automation using Terraform (8x speed increase).',
        'Secure and automated secrets management implementation.',
      ],
    },
    {
      title: 'DevOps Consultant',
      company: 'Finalis',
      period: '06/2020 - 07/2022',
      duration: '2 yrs 2 mos',
      location: 'Santiago, Chile',
      responsibilities: [
        'Organized teams, enhanced process visibility, and provided technical guidance for best practices in DevOps Team.',
      ],
    },
    {
      title: 'Sysadmin Engineer',
      company: 'LATAM Airlines Group',
      period: '06/2016 - 10/2017',
      duration: '1 yr 5 mos',
      location: 'Santiago, Chile',
      responsibilities: [
        'Support to developer teams in: infrastructure, CI/CD, all transversal tools.',
        'Manage Servers, delivery multiples environments to developers.',
        'Automation of manual procedures, for example: database maintaining, CMS maintaining.',
        'Administration of database MySQL in HA.',
      ],
    },
    {
      title: 'Sysadmin Engineer',
      company: 'Adessa Falabella',
      period: '06/2012 - 12/2015',
      duration: '3 yrs 7 mos',
      location: 'Santiago, Chile',
      responsibilities: [
        'Linux and AIX administration, IBM Virtual I/O and storage support.',
        'Developed Bash and Python scripts, Nagios support.',
      ],
    },
  ],
  skills: {
    'Change Maker': [
      'AI Strategy',
      'Data & AI Governance',
      'Process Automation',
      'Operational Excellence',
      'Vendor Management',
      'Team Leadership',
      'InnerSource',
      'Agile / DevOps',
    ],
    IT: [
      'Generative AI',
      'LLMs · RAG',
      'AI Agents · MCP',
      'Data & AI Platforms',
      'CI/CD',
      'Infrastructure as Code',
      'Kubernetes',
      'GCP · AWS · Azure',
      'Python',
      'Terraform',
      'FinOps / cost control',
    ],
  },
  languages: [
    { name: 'English', level: 'Advanced' },
    { name: 'Spanish', level: 'Native' },
  ],
  certifications: {
    Coursera: [
      {
        name: 'Elastic Cloud Infrastructure: Scaling and Automation',
        url: 'https://www.coursera.org/learn/gcp-infrastructure-scaling-automation',
      },
      {
        name: 'App Deployment, Debugging, and Performance',
        url: 'https://www.coursera.org/learn/app-deployment-debugging-performance',
      },
      {
        name: 'Architecting with Google Kubernetes Engine',
        url: 'https://www.coursera.org/learn/architecting-with-google-kubernetes-engine',
      },
      {
        name: 'Essential Cloud Infrastructure: Core Services',
        url: 'https://www.coursera.org/learn/gcp-infrastructure-core-services',
      },
      {
        name: 'Getting Started with Google Kubernetes Engine',
        url: 'https://www.coursera.org/learn/google-kubernetes-engine',
      },
      {
        name: 'Google Cloud Platform Fundamentals: Core Infrastructure',
        url: 'https://www.coursera.org/learn/gcp-fundamentals',
      },
    ],
    Qwiklabs: [
      {
        name: 'Kubernetes Solutions',
        url: 'https://www.cloudskillsboost.google/quests/29',
      },
      {
        name: 'Managing Cloud Infrastructure with Terraform',
        url: 'https://www.cloudskillsboost.google/quests/44',
      },
      {
        name: 'Networking in the Google Cloud',
        url: 'https://www.cloudskillsboost.google/quests/31',
      },
      {
        name: 'BigQuery for Machine Learning',
        url: 'https://www.cloudskillsboost.google/quests/55',
      },
      {
        name: 'Data Engineering',
        url: 'https://www.cloudskillsboost.google/quests/25',
      },
    ],
  },
  interests: ['Learning', 'Technology', 'Music - Bass guitar', 'Games', 'Artificial Intelligence'],
};
