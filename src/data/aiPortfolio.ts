// AI portfolio — products and agents built by the AI Innovation Pods.
// Edit this file to add, reorder or reword entries; the section renders from it.
export type Category = "ops" | "eng" | "sec" | "fin" | "quality";
export type Status = "production" | "pilot" | "poc";

export interface AIProduct {
    key: string;
    name: string;
    icon: string; // Material Symbols name
    category: Category;
    status: Status;
    accent: "amber" | "indigo" | "blue" | "purple" | "green";
    stack: string[];
    en: { tagline: string; desc: string; outcomes: string[] };
    es: { tagline: string; desc: string; outcomes: string[] };
}

export const categories: { key: Category | "all"; en: string; es: string }[] = [
    { key: "all", en: "All", es: "Todos" },
    { key: "ops", en: "Operations", es: "Operaciones" },
    { key: "eng", en: "Engineering", es: "Ingeniería" },
    { key: "sec", en: "Security", es: "Seguridad" },
    { key: "fin", en: "Finance", es: "Finanzas" },
    { key: "quality", en: "Quality", es: "Calidad" },
];

export const statusLabel: Record<Status, { en: string; es: string }> = {
    production: { en: "In production", es: "En producción" },
    pilot: { en: "Pilot", es: "Piloto" },
    poc: { en: "15-day POC", es: "POC de 15 días" },
};

export const products: AIProduct[] = [
    {
        key: "inventory",
        name: "AI Inventory",
        icon: "inventory_2",
        category: "ops",
        status: "production",
        accent: "amber",
        stack: ["Agents", "Forecasting", "ERP integration"],
        en: {
            tagline: "Stock that thinks ahead.",
            desc: "An agent that reads sales, suppliers and lead times to forecast demand, flag stock-outs before they happen and draft purchase orders for approval.",
            outcomes: ["Demand forecast per SKU and location", "Replenishment suggestions with supplier context", "Replaces a SaaS inventory tool"],
        },
        es: {
            tagline: "Stock que se anticipa.",
            desc: "Un agente que lee ventas, proveedores y plazos de entrega para proyectar demanda, avisar quiebres de stock antes de que ocurran y preparar órdenes de compra para aprobar.",
            outcomes: ["Proyección de demanda por SKU y ubicación", "Sugerencias de reposición con contexto de proveedor", "Reemplaza un SaaS de inventario"],
        },
    },
    {
        key: "sre",
        name: "AI SRE Agent",
        icon: "monitor_heart",
        category: "ops",
        status: "production",
        accent: "blue",
        stack: ["Observability", "Runbooks", "Kubernetes"],
        en: {
            tagline: "First responder for your platform.",
            desc: "Correlates alerts, logs and traces, proposes a root cause and runs approved runbooks, so on-call engineers start from a diagnosis, not a page.",
            outcomes: ["Alert triage with root-cause hypothesis", "Safe, approved remediations", "Post-incident report drafted automatically"],
        },
        es: {
            tagline: "Primer respondedor de tu plataforma.",
            desc: "Correlaciona alertas, logs y trazas, propone la causa raíz y ejecuta runbooks aprobados, para que el on-call arranque desde un diagnóstico y no desde un aviso.",
            outcomes: ["Triage de alertas con hipótesis de causa raíz", "Remediaciones seguras y aprobadas", "Informe post-incidente generado solo"],
        },
    },
    {
        key: "devops",
        name: "AI DevOps",
        icon: "deployed_code",
        category: "eng",
        status: "production",
        accent: "indigo",
        stack: ["CI/CD", "IaC", "GitOps"],
        en: {
            tagline: "Pipelines that fix themselves.",
            desc: "Agents that write and review infrastructure as code, diagnose failed builds and deployments, and open the pull request with the fix.",
            outcomes: ["Failed pipeline → diagnosis and fix PR", "IaC generation and drift review", "Release notes and change summaries"],
        },
        es: {
            tagline: "Pipelines que se arreglan solos.",
            desc: "Agentes que escriben y revisan infraestructura como código, diagnostican builds y deploys fallidos y abren el pull request con el arreglo.",
            outcomes: ["Pipeline fallido → diagnóstico y PR con el fix", "Generación de IaC y revisión de drift", "Release notes y resúmenes de cambios"],
        },
    },
    {
        key: "secops",
        name: "AI SecOps",
        icon: "security",
        category: "sec",
        status: "production",
        accent: "purple",
        stack: ["SIEM", "Threat intel", "Playbooks"],
        en: {
            tagline: "Continuous, autonomous defense.",
            desc: "Enriches and prioritises security events, investigates suspicious activity across sources and executes containment playbooks with human approval.",
            outcomes: ["Event enrichment and prioritisation", "Investigation timelines in minutes", "Compliance-ready evidence trail"],
        },
        es: {
            tagline: "Defensa continua y autónoma.",
            desc: "Enriquece y prioriza eventos de seguridad, investiga actividad sospechosa entre fuentes y ejecuta playbooks de contención con aprobación humana.",
            outcomes: ["Enriquecimiento y priorización de eventos", "Líneas de tiempo de investigación en minutos", "Evidencia lista para auditoría"],
        },
    },
    {
        key: "finops",
        name: "AI FinOps",
        icon: "payments",
        category: "fin",
        status: "pilot",
        accent: "green",
        stack: ["AWS", "Azure", "Cost allocation"],
        en: {
            tagline: "Cloud spend, explained and reduced.",
            desc: "Reads billing data across clouds, attributes cost to teams and products, spots anomalies and recommends rightsizing and commitment changes.",
            outcomes: ["Cost per team, product and environment", "Anomaly alerts with the likely cause", "Savings plan with projected impact"],
        },
        es: {
            tagline: "Gasto cloud explicado y reducido.",
            desc: "Lee la facturación de varias nubes, atribuye costos a equipos y productos, detecta anomalías y recomienda rightsizing y cambios de compromisos.",
            outcomes: ["Costo por equipo, producto y ambiente", "Alertas de anomalías con la causa probable", "Plan de ahorro con impacto proyectado"],
        },
    },
    {
        key: "devpod",
        name: "AI Developer Pod",
        icon: "group_work",
        category: "eng",
        status: "production",
        accent: "amber",
        stack: ["Coding agents", "Code review", "Test generation"],
        en: {
            tagline: "A squad that ships every week.",
            desc: "Senior engineers paired with coding agents: specification, implementation, review and tests in one loop. The engine behind 20+ products in the last year.",
            outcomes: ["First working app in 15 days", "Agent-written tests and reviews on every PR", "You own the code, no lock-in"],
        },
        es: {
            tagline: "Un squad que entrega todas las semanas.",
            desc: "Ingenieros senior en pareja con agentes de código: especificación, implementación, revisión y tests en un solo ciclo. El motor detrás de más de 20 productos en el último año.",
            outcomes: ["Primera app funcionando en 15 días", "Tests y revisiones de agentes en cada PR", "El código es tuyo, sin lock-in"],
        },
    },
    {
        key: "qa",
        name: "AI QA",
        icon: "bug_report",
        category: "quality",
        status: "production",
        accent: "blue",
        stack: ["E2E testing", "Playwright", "Regression"],
        en: {
            tagline: "Tests that write and maintain themselves.",
            desc: "Agents that turn user stories into end-to-end tests, keep them green as the UI changes and report regressions with a reproduction, not a screenshot.",
            outcomes: ["Story → automated E2E suite", "Self-healing selectors and flows", "Regression reports with repro steps"],
        },
        es: {
            tagline: "Tests que se escriben y mantienen solos.",
            desc: "Agentes que convierten historias de usuario en tests end-to-end, los mantienen en verde cuando cambia la UI y reportan regresiones con reproducción, no con una captura.",
            outcomes: ["Historia → suite E2E automatizada", "Selectores y flujos que se auto-reparan", "Reportes de regresión con pasos para reproducir"],
        },
    },
    {
        key: "itagent",
        name: "AI IT Agent",
        icon: "support_agent",
        category: "ops",
        status: "pilot",
        accent: "indigo",
        stack: ["Service desk", "Identity", "Knowledge base"],
        en: {
            tagline: "Level-1 support, resolved not routed.",
            desc: "Handles access requests, onboarding and common incidents end to end, with approvals where policy requires them, and escalates with full context.",
            outcomes: ["Access and onboarding requests automated", "Answers grounded in your own documentation", "Escalations arrive with the work already done"],
        },
        es: {
            tagline: "Soporte nivel 1 resuelto, no derivado.",
            desc: "Resuelve pedidos de acceso, onboarding e incidentes comunes de punta a punta, con aprobaciones donde la política lo exige, y escala con todo el contexto.",
            outcomes: ["Pedidos de acceso y onboarding automatizados", "Respuestas basadas en tu propia documentación", "Las escalaciones llegan con el trabajo hecho"],
        },
    },
];
