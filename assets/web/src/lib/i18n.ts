export type Language = "ca" | "es";

export type TranslationKey = keyof typeof translations;

export const translations = {
  "brand.name": { ca: "Criteri ESG", es: "Criteri ESG" },

  "nav.informes": { ca: "Informes", es: "Informes" },
  "nav.certificacions": { ca: "Certificacions", es: "Certificaciones" },
  "nav.autodiagnostic": { ca: "Autodiagnòstic", es: "Autodiagnóstico" },
  "nav.preus": { ca: "Preus", es: "Precios" },
  "nav.login": { ca: "Inicia sessió", es: "Inicia sesión" },
  "nav.cerca": { ca: "Cerca informes…", es: "Buscar informes…" },
  "nav.cerca.btn": { ca: "Cercar", es: "Buscar" },

  "hero.eyebrow": {
    ca: "Intel·ligència ESG · Des de 2026",
    es: "Inteligencia ESG · Desde 2026",
  },
  "hero.title": {
    ca: "El teu criteri per decidir bé.",
    es: "Tu criterio para decidir bien.",
  },
  "hero.subtitle": {
    ca: "Criteri ESG converteix els informes institucionals, els frameworks i les certificacions europees en accions concretes. Cada document, sintetitzat en 5 minuts — per a directors de sostenibilitat, compliance officers i consultories que volen ser més ètiques, més sostenibles i millor reputades.",
    es: "Criteri ESG convierte los informes institucionales, los frameworks y las certificaciones europeas en acciones concretas. Cada documento, sintetizado en 5 minutos — para directores de sostenibilidad, compliance officers y consultorías que quieren ser más éticas, más sostenibles y mejor reputadas.",
  },
  "hero.cta.trial": { ca: "Prova 7 dies gratis", es: "Prueba 7 días gratis" },
  "hero.cta.newsletter": { ca: "Rep la newsletter", es: "Recibe la newsletter" },
  "hero.note": {
    ca: "Sense targeta de crèdit. Cancel·la quan vulguis.",
    es: "Sin tarjeta de crédito. Cancela cuando quieras.",
  },

  "sections.title": {
    ca: "Què trobaràs a Criteri ESG",
    es: "Qué encontrarás en Criteri ESG",
  },
  "sections.subtitle": {
    ca: "Quatre portes per entrar al mateix objectiu: decidir amb criteri.",
    es: "Cuatro puertas para entrar al mismo objetivo: decidir con criterio.",
  },
  "sections.informes.title": { ca: "Biblioteca d'informes", es: "Biblioteca de informes" },
  "sections.informes.desc": {
    ca: "Cada informe rellevant de la UE, sintetitzat en 7 blocs accionables amb cross-reference a EcoVadis, B Corp i MSCI.",
    es: "Cada informe relevante de la UE, sintetizado en 7 bloques accionables con cross-reference a EcoVadis, B Corp y MSCI.",
  },
  "sections.certif.title": { ca: "Guies de certificació", es: "Guías de certificación" },
  "sections.certif.desc": {
    ca: "Dossiers pas a pas per pujar EcoVadis, obtenir B Corp, passar CSRD o millorar MSCI rating.",
    es: "Dossiers paso a paso para subir EcoVadis, obtener B Corp, pasar CSRD o mejorar MSCI rating.",
  },
  "sections.autodiag.title": { ca: "Autodiagnòstic", es: "Autodiagnóstico" },
  "sections.autodiag.desc": {
    ca: "Posa't a prova: respon 15 preguntes i rep un informe amb punts forts, febles i projecció futura segons lleis en marxa.",
    es: "Ponte a prueba: responde 15 preguntas y recibe un informe con puntos fuertes, débiles y proyección futura según leyes en marcha.",
  },
  "sections.newsletter.title": { ca: "Newsletter bimensual", es: "Newsletter bimensual" },
  "sections.newsletter.desc": {
    ca: "3 informes destacats + 1 connexió entre ells, cada dues setmanes. gratuït, cancel·la quan vulguis.",
    es: "3 informes destacados + 1 conexión entre ellos, cada dos semanas. Gratuito, cancela cuando quieras.",
  },

  "latest.eyebrow": {
    ca: "Últim informe publicat · 6 maig 2026",
    es: "Último informe publicado · 6 mayo 2026",
  },
  "latest.title": {
    ca: "Comissió Europea publica la revisió dels ESRS",
    es: "Comisión Europea publica la revisión de los ESRS",
  },
  "latest.summary": {
    ca: "La Comissió Europea ha publicat l'esborrany revisat dels European Sustainability Reporting Standards que redueix un 61% els datapoints obligatoris del CSRD. Estalvi acumulat estimat de 3.700M€ en 5 anys. Aplicació prevista per a exercicis 2027.",
    es: "La Comisión Europea ha publicado el borrador revisado de los European Sustainability Reporting Standards que reduce un 61% los datapoints obligatorios del CSRD. Ahorro acumulado estimado de 3.700M€ en 5 años. Aplicación prevista para ejercicios 2027.",
  },
  "latest.cta": { ca: "Veure exemple complet", es: "Ver ejemplo completo" },
  "latest.cta.trial": {
    ca: "Llegeix l'informe complet amb registre gratuït",
    es: "Lee el informe completo con registro gratuito",
  },

  "cta.newsletter.eyebrow": { ca: "Newsletter gratuïta", es: "Newsletter gratuita" },
  "cta.newsletter.title": {
    ca: "Cada dues setmanes, 3 informes que has de conèixer.",
    es: "Cada dos semanas, 3 informes que debes conocer.",
  },
  "cta.newsletter.body": {
    ca: "Resums executius de 200 paraules + una connexió entre ells. 5 minuts de lectura que et posen al dia. Cancel·la quan vulguis.",
    es: "Resúmenes ejecutivos de 200 palabras + una conexión entre ellos. 5 minutos de lectura que te pon al día. Cancela cuando quieras.",
  },
  "cta.premium.eyebrow": { ca: "Prova Premium", es: "Prueba Premium" },
  "cta.premium.title": { ca: "7 dies gratis. Sense targeta.", es: "7 días gratis. Sin tarjeta." },
  "cta.premium.body": {
    ca: "Accés complet a la biblioteca, cerca semàntica, alertes personalitzades, cross-reference amb certificacions i dossiers temàtics. Si no t'agrada, no pagues res.",
    es: "Acceso completo a la biblioteca, búsqueda semántica, alertas personalizadas, cross-reference con certificaciones y dossiers temáticos. Si no te gusta, no pagas nada.",
  },

  "form.title": { ca: "Registre gratuït", es: "Registro gratuito" },
  "form.subtitle": {
    ca: "Accedeix a 3 informes oberts al mes i a la newsletter bimensual. Sense cost, sense targeta.",
    es: "Accede a 3 informes abiertos al mes y a la newsletter bimensual. Sin coste, sin tarjeta.",
  },
  "form.name": { ca: "Nom i cognoms", es: "Nombre y apellidos" },
  "form.name.placeholder": { ca: "Ex: Maria Puig", es: "Ej: María Puig" },
  "form.company": { ca: "Empresa o organització (opcional)", es: "Empresa u organización (opcional)" },
  "form.email": { ca: "Correu electrònic", es: "Correo electrónico" },
  "form.sector": { ca: "Sector professional", es: "Sector profesional" },
  "form.sector.consultant": { ca: "Consultoria ESG", es: "Consultoría ESG" },
  "form.sector.director": { ca: "Director de sostenibilitat", es: "Director de sostenibilidad" },
  "form.sector.compliance": { ca: "Compliance officer", es: "Compliance officer" },
  "form.sector.investor": { ca: "Investor relations", es: "Investor relations" },
  "form.sector.ngo": { ca: "ONG / Tercer sector", es: "ONG / Tercer sector" },
  "form.sector.public": { ca: "Sector públic", es: "Sector público" },
  "form.sector.other": { ca: "Altres", es: "Otros" },
  "form.interests": {
    ca: "Interessos principals (seleccioneu tots els que apliquin)",
    es: "Intereses principales (selecciona todos los que apliquen)",
  },
  "form.interest.csrd": { ca: "CSRD / ESRS", es: "CSRD / ESRS" },
  "form.interest.ecovadis": { ca: "EcoVadis", es: "EcoVadis" },
  "form.interest.bcorp": { ca: "B Corp", es: "B Corp" },
  "form.interest.msci": { ca: "MSCI ESG", es: "MSCI ESG" },
  "form.interest.taxonomy": { ca: "Taxonomia UE", es: "Taxonomía UE" },
  "form.interest.csddd": { ca: "CSDDD", es: "CSDDD" },
  "form.interest.humanrights": { ca: "Drets humans / Due diligence", es: "Derechos humanos / Due diligence" },
  "form.interest.climate": { ca: "Risc climàtic / TCFD", es: "Riesgo climático / TCFD" },
  "form.submit": { ca: "Registra'm gratis", es: "Regístrame gratis" },
  "form.privacy": {
    ca: "En registrar-te acceptes rebre comunicacions de Criteri ESG. Pots donar-te de baixa en qualsevol moment. Mai compartirem les teves dades.",
    es: "Al registrarte aceptas recibir comunicaciones de Criteri ESG. Puedes darte de baja en cualquier momento. Nunca compartiremos tus datos.",
  },
  "form.success": {
    ca: "✓ Registre completat! Comprova el teu correu per confirmar.",
    es: "✓ Registro completado. Revisa tu correo para confirmar.",
  },

  "footer.tagline": {
    ca: "Intel·ligència ESG per a decisions ètiques.",
    es: "Inteligencia ESG para decisiones éticas.",
  },
  "footer.product": { ca: "Producte", es: "Producto" },
  "footer.company": { ca: "Empresa", es: "Empresa" },
  "footer.legal": { ca: "Legal", es: "Legal" },
  "footer.rights": {
    ca: "© 2026 Criteri ESG. Tots els drets reservats.",
    es: "© 2026 Criteri ESG. Todos los derechos reservados.",
  },
  "footer.privacy": { ca: "Privadesa", es: "Privacidad" },
  "footer.terms": { ca: "Termes", es: "Términos" },
  "footer.cookies": { ca: "Cookies", es: "Cookies" },
} as const;
