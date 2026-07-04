// Spanish (es-CL) locale. Shares non-translatable data (contact, skills,
// certifications, social links) with resume.en.js via spread; the experience
// overrides are index-coupled to the EN array order.
import { resumeData as en } from './resume.en';

const experienceEs = [
  {
    period: 'Mar 2026 - Presente',
    company: 'Grupo Falabella',
    workType: 'Híbrido',
    responsibilities: [
      'Lidero Kairos, la AI Developer Platform (plataforma agéntica) del Grupo Falabella: multi-tenant, donde los equipos crean, despliegan y operan aplicaciones y agentes de IA generativa en autoservicio, con acceso gobernado a modelos, permisos granulares, trazabilidad de uso y control de costos.',
      'Habilito capacidades de IA para los equipos de la compañía, coordinando un equipo multidisciplinario (ingenieros de plataforma IA, arquitectos de agentes, DevSecOps) y recursos internos y externos.',
      'Asesoro iniciativas de IA de distintas áreas en conjunto con arquitectos GenAI: definimos estándares técnicos comunes y ajustamos el roadmap de la plataforma para que se apliquen a través de ella.',
      'Impulso la estandarización de agentes e integraciones vía MCP en la plataforma, definiendo una vía gobernada para su adopción en casos de uso de retail y financieros.',
      'Promuevo el desarrollo de capacidades de IA en toda la organización mediante la iniciativa InnerSource de Kairos, fomentando una cultura de decisiones basadas en datos e impulsando a la compañía a ser AI-driven.',
    ],
  },
  {
    period: 'May 2024 - Feb 2026',
    duration: '1 año 10 meses',
    workType: 'Híbrido',
    responsibilities: [
      'Líder de la iniciativa GenOps: diseño de la arquitectura fundacional de una plataforma unificada de IA para Falabella Financiero - simplificando el acceso a diversos modelos y reforzando la seguridad, privacidad y gestión de costos del consumo de datos e IA.',
      'Expositor en Google Cloud Summit Chile 2025 ("Reimaginando la experiencia del cliente con IA conversacional: el caso de Banco Falabella"): soluciones conversacionales sobre Kairos, escaladas de forma segura en el canal WhatsApp del banco para flujos críticos de atención.',
    ],
  },
  {
    duration: '1 año 6 meses',
    responsibilities: [
      'Liderazgo de los equipos de Developer Experience y estándares de arquitectura de plataforma, con foco en eficiencia operacional.',
      'Rediseño y automatización de procesos de despliegue, eliminando tareas manuales e ineficiencias y capturando eficiencias anuales.',
      'Producto de IA generativa que extrae conocimiento de incidentes pasados, reduciendo tiempos de resolución y fortaleciendo la base de conocimiento.',
      'Evolución y gestión del portafolio de herramientas internas, optimizando el consumo de recursos y presupuesto.',
    ],
  },
  {
    duration: '3 años',
    responsibilities: [
      'Liderazgo del equipo que promueve la adopción de la filosofía DevOps y la mejora continua de procesos en beneficio de la organización.',
      'Sinergias entre áreas facilitando la colaboración con 5 equipos de plataforma, estandarizando procesos y eliminando esfuerzos duplicados.',
      'Implementación y estandarización de Backstage (portal interno de desarrolladores), habilitando el autoservicio y mejorando la experiencia de acceso a la información.',
      'Definición del uso de Kubernetes para todos los equipos de plataforma de Falabella Financiero, en coordinación con proveedores tecnológicos.',
    ],
  },
  {
    duration: '1 año 4 meses',
    responsibilities: [
      'Liderazgo del equipo que mejora y propone nuevas tecnologías para que los componentes que implementan DevOps cumplan los últimos estándares de la industria.',
      'Implementación de monitoreo y alertas avanzadas con Prometheus, mejorando la confiabilidad de los sistemas.',
      'Impulso del uso de Kubernetes.',
    ],
  },
  {
    duration: '1 año 9 meses',
    responsibilities: [
      'Automatización avanzada de infraestructura con Terraform (aumento de 8x en velocidad de entrega).',
      'Implementación segura y automatizada de la gestión de secretos.',
    ],
  },
  {
    duration: '2 años 2 meses',
    responsibilities: [
      'Organización de equipos, mejora de la visibilidad de procesos y guía técnica en buenas prácticas para el equipo DevOps.',
    ],
  },
  {
    duration: '1 año 5 meses',
    responsibilities: [
      'Soporte a equipos de desarrollo en infraestructura, CI/CD y herramientas transversales.',
      'Administración de servidores y entrega de múltiples ambientes a desarrolladores.',
      'Automatización de procedimientos manuales, por ejemplo: mantención de bases de datos y CMS.',
      'Administración de base de datos MySQL en alta disponibilidad.',
    ],
  },
  {
    duration: '3 años 7 meses',
    responsibilities: [
      'Administración de Linux y AIX, soporte de IBM Virtual I/O y almacenamiento.',
      'Desarrollo de scripts en Bash y Python, soporte de Nagios.',
    ],
  },
];

export const resumeData = {
  ...en,
  profile: {
    text: `Profesional con <strong>más de 15 años</strong> liderando plataformas tecnológicas y equipos de alto desempeño. Hoy estoy a cargo de Kairos, la <strong>AI Developer Platform</strong> del Grupo Falabella, con la que los equipos adoptan <strong>inteligencia artificial</strong> de forma autogestionada, segura y <strong>gobernada</strong>, automatizando procesos con IA generativa y agentes. Combino un Magíster en Inteligencia Artificial con una base sólida en DevOps y <strong>Platform Engineering</strong> para transformar necesidades de negocio en soluciones escalables y medibles.

  Mi foco está en la <strong>captura de valor</strong>: eficiencia operacional, control de costos, modelos operativos claros y desarrollo de capacidades organizacionales. Fomento la colaboración entre áreas, la mejora continua y las decisiones basadas en datos.`,
  },
  education: [
    {
      degree: 'Magíster en Inteligencia Artificial',
      institution: 'Pontificia Universidad Católica de Chile',
      period: '2021 - 2022',
      location: 'Santiago, Chile',
    },
    {
      degree: 'Diplomado en Gestión y Evaluación de Proyectos Informáticos',
      institution: 'Universidad de Chile',
      period: '06/2013 - 12/2013',
      location: 'Santiago, Chile',
    },
    {
      degree: 'Ingeniería Civil en Computación mención Informática',
      institution: 'Universidad Tecnológica Metropolitana',
      period: '2005 - 2010',
      location: 'Santiago, Chile',
      details: ['Titulado con distinción'],
    },
  ],
  experience: en.experience.map((exp, i) => ({ ...exp, ...experienceEs[i] })),
  skills: {
    'Change Maker': [
      'Estrategia de IA',
      'Gobierno de datos e IA',
      'Automatización de procesos',
      'Excelencia operacional',
      'Gestión de proveedores',
      'Liderazgo de equipos',
      'InnerSource',
      'Agile / DevOps',
    ],
    IT: [
      'IA Generativa',
      'LLMs · RAG',
      'Agentes IA · MCP',
      'Plataformas de datos e IA',
      'CI/CD',
      'Infraestructura como código',
      'Kubernetes',
      'GCP · AWS · Azure',
      'Python',
      'Terraform',
      'FinOps / control de costos',
    ],
  },
  languages: [
    { name: 'Inglés', level: 'Avanzado' },
    { name: 'Español', level: 'Nativo' },
  ],
  interests: [
    'Aprendizaje',
    'Tecnología',
    'Música - Bajo',
    'Videojuegos',
    'Inteligencia Artificial',
  ],
};
