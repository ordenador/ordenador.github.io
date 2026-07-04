// Variante "ia-aplicada": CV en español orientado a liderazgo de IA aplicada,
// gobierno de datos y eficiencia operacional. Basado en resume.es.js; solo
// reescribe perfil, foco de bullets y skills. Sin contenido inventado.
import { resumeData as es } from '../resume.es';

const experienceOverrides = {
  0: {
    responsibilities: [
      'Lidero la plataforma interna de IA del Grupo Falabella (Internal Developer Platform) — equipo, roadmap y arquitectura — que entrega capacidades de IA generativa y agentes autogestionadas por los equipos de desarrollo, con gobernanza, observabilidad y control de acceso y consumo integrados.',
      'Diseño y desarrollo el equipo de la plataforma: defino los perfiles, lidero la selección de roles especializados (ingeniería de plataforma IA, arquitectura de agentes, DevSecOps) y gestiono capacidades internas y externas según la demanda.',
      'Apoyo y asesoro iniciativas de IA de distintas áreas en conjunto con arquitectos GenAI, promoviendo estándares técnicos y buenas prácticas para soluciones seguras, gobernadas y escalables.',
      'Lidero la habilitación de agentes e integraciones (incluyendo MCP) y técnicas de uso de contexto (RAG) para casos de uso de retail y financieros, acelerando el time-to-value.',
      'Promuevo el desarrollo de capacidades de IA en toda la organización mediante la iniciativa InnerSource de Kairos, fomentando una cultura de decisiones basadas en datos e impulsando a la compañía a ser AI-driven.',
    ],
  },
  1: {
    responsibilities: [
      'Líder de la iniciativa GenOps: diseño de la arquitectura fundacional de una plataforma unificada de IA para Falabella Financiero — simplificando el acceso a diversos modelos y reforzando la seguridad, privacidad y gestión de costos del consumo de datos e IA.',
    ],
  },
  2: {
    responsibilities: [
      'Liderazgo de los equipos de Developer Experience y estándares de arquitectura de plataforma, con foco en eficiencia operacional.',
      'Rediseño y automatización de procesos de despliegue, eliminando tareas manuales e ineficiencias y capturando eficiencias anuales.',
      'Producto de IA generativa que extrae conocimiento de incidentes pasados, reduciendo tiempos de resolución y fortaleciendo la base de conocimiento.',
      'Evolución y gestión del portafolio de herramientas internas, optimizando el consumo de recursos y presupuesto.',
    ],
  },
  3: {
    responsibilities: [
      'Liderazgo del equipo que promueve la adopción de la filosofía DevOps y la mejora continua de procesos en beneficio de la organización.',
      'Sinergias entre áreas facilitando la colaboración con 5 equipos de plataforma, estandarizando procesos y eliminando esfuerzos duplicados.',
      'Implementación y estandarización de Backstage (portal interno de desarrolladores), habilitando el autoservicio y mejorando la experiencia de acceso a la información.',
      'Definición del uso de Kubernetes para todos los equipos de plataforma de Falabella Financiero, en coordinación con proveedores tecnológicos.',
    ],
  },
};

export const resumeData = {
  ...es,
  profile: {
    text: `Profesional con <strong>más de 15 años</strong> liderando plataformas tecnológicas y equipos de alto desempeño. Hoy lidero la plataforma interna de IA del Grupo Falabella, que habilita la adopción de <strong>inteligencia artificial aplicada</strong> con capacidades autogestionadas por los equipos: <strong>gobierno y seguridad</strong> de datos y modelos, y automatización de procesos con IA generativa y agentes. Combino un Magíster en Inteligencia Artificial con una base sólida en DevOps y <strong>Platform Engineering</strong>, transformando necesidades de negocio en capacidades escalables, medibles y gobernadas.

  Mi foco está en la captura de valor: eficiencia operacional, control de costos, modelos operativos claros y desarrollo de capacidades organizacionales. Fomento la colaboración entre áreas, la mejora continua y la toma de decisiones basada en datos.`,
  },
  experience: es.experience.map((exp, i) => ({ ...exp, ...experienceOverrides[i] })),
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
};
