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
      'Lidero el desarrollo y la dirección técnica de la AI Developer Platform del Grupo Falabella, enfocada en escalar IA generativa y capacidades agénticas en toda la organización.',
      'Impulso la arquitectura de plataforma, los estándares técnicos y el delivery para ayudar a los equipos a construir, integrar y operar soluciones de IA seguras, gobernadas, escalables y listas para producción.',
      'Mejoro la experiencia de desarrollo, estandarizo integraciones de IA y acelero la adopción de IA generativa, asistentes y soluciones basadas en agentes en casos de uso de retail y financieros.',
      'Lidero la iniciativa InnerSource de Kairos, creando un roadmap colaborativo y construyendo puentes entre equipos para escalar la plataforma de IA y agentes en la organización.',
    ],
  },
  {
    period: 'May 2024 - Feb 2026',
    duration: '1 año 10 meses',
    workType: 'Híbrido',
    responsibilities: [
      'Líder de la iniciativa GenOps, responsable de diseñar la arquitectura fundacional de una plataforma unificada para desarrolladores de IA en Falabella Financiero — habilitando a los equipos de aplicaciones para aprovechar IA generativa, simplificando el acceso a diversos modelos y mejorando la seguridad y la gestión de costos.',
    ],
  },
  {
    duration: '1 año 6 meses',
    responsibilities: [
      'Liderazgo de los equipos responsables de Developer Experience, estándares de arquitectura de plataforma y la evolución de las plataformas de herramientas internas.',
      'Optimización y estandarización de los flujos de despliegue.',
      'Evolución y gestión de herramientas internas.',
      'Producto de IA generativa para extraer información de incidentes pasados y potenciar la base de conocimiento.',
    ],
  },
  {
    duration: '3 años',
    responsibilities: [
      'Liderazgo del equipo que promueve la adopción de la filosofía DevOps, fomenta la inteligencia colectiva y empodera a los equipos para innovar y mejorar continuamente en beneficio de la organización.',
      'Sinergias entre áreas facilitando la colaboración con 5 equipos de plataforma, mejorando el trabajo conjunto y eliminando esfuerzos duplicados.',
      'Implementación y estandarización de Backstage (portal interno para desarrolladores).',
      'Definición del uso de Kubernetes para todos los equipos de plataforma de Falabella Financiero.',
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
    text: `Profesional con <strong>más de 15 años</strong> diseñando y operando plataformas escalables. Hoy lidero el desarrollo y la dirección técnica de la <strong>AI Developer Platform</strong> del Grupo Falabella, escalando IA generativa y <strong>capacidades agénticas</strong> en toda la organización, reforzando la gobernanza y mejorando la experiencia de desarrollo. Con una base sólida en DevOps y <strong>Platform Engineering</strong>, lidero equipos enfocados en IA que traducen necesidades de negocio en capacidades tecnológicas simples, seguras y reutilizables.

  Mi foco está en habilitar equipos: alineo visiones, defino marcos de trabajo claros y creo espacios de colaboración y aprendizaje continuo. Promuevo la contribución open source y la mejora continua. Busco constantemente herramientas y prácticas que reduzcan el time-to-value, optimicen costos y aseguren la <strong>calidad y confiabilidad</strong> de las soluciones basadas en IA.`,
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
