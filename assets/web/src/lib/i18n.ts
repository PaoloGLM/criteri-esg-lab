export type Language = "ca" | "es";

export type TranslationKey = keyof typeof translations;

export const translations = {
  "brand.name": { ca: "Criteri ESG", es: "Criteri ESG" },

  "nav.informes": { ca: "Informes", es: "Informes" },
  "nav.certificacions": { ca: "Certificacions", es: "Certificaciones" },
  "nav.quisom": { ca: "Qui som", es: "Quiénes somos" },
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

  // ============ Preus ============
  "preus.eyebrow": {
    ca: "Preus · Setembre 2026",
    es: "Precios · Septiembre 2026",
  },
  "preus.title": {
    ca: "Tria com vols avançar.",
    es: "Elige cómo quieres avanzar.",
  },
  "preus.subtitle": {
    ca: "Comencem amb 2 mesos gratuïts per a tothom (setembre i octubre 2026). A partir de novembre, tries el teu pla. Sense permanència, cancel·la quan vulguis.",
    es: "Empezamos con 2 meses gratuitos para todos (septiembre y octubre 2026). A partir de noviembre, eliges tu plan. Sin permanencia, cancela cuando quieras.",
  },
  "preus.period.forever": { ca: "sempre", es: "siempre" },
  "preus.period.month": { ca: "mes", es: "mes" },

  "preus.free.name": { ca: "Free", es: "Free" },
  "preus.free.description": {
    ca: "Per començar a entendre l'ecosistema ESG europeu.",
    es: "Para empezar a entender el ecosistema ESG europeo.",
  },
  "preus.free.f1": { ca: "Newsletter bimensual", es: "Newsletter bimensual" },
  "preus.free.f2": { ca: "3 informes oberts al mes", es: "3 informes abiertos al mes" },
  "preus.free.f3": { ca: "Informes amb més de 6 mesos (arxiu)", es: "Informes con más de 6 meses (archivo)" },
  "preus.free.f4": { ca: "Accés a la biblioteca pública", es: "Acceso a la biblioteca pública" },
  "preus.free.cta": { ca: "Comença gratis", es: "Empieza gratis" },

  "preus.premium.name": { ca: "Premium", es: "Premium" },
  "preus.premium.badge": {
    ca: "Early bird · 50 primers",
    es: "Early bird · 50 primeros",
  },
  "preus.premium.description": {
    ca: "Per al professional que ha de decidir cada setmana.",
    es: "Para el profesional que debe decidir cada semana.",
  },
  "preus.premium.f1": { ca: "Tot el que té Free", es: "Todo lo que tiene Free" },
  "preus.premium.f2": { ca: "Arxiu complet i cerca avançada", es: "Archivo completo y búsqueda avanzada" },
  "preus.premium.f3": { ca: "Tots els informes recents (< 6 mesos)", es: "Todos los informes recientes (< 6 meses)" },
  "preus.premium.f4": { ca: "Cross-reference amb EcoVadis, B Corp, MSCI, GRI", es: "Cross-reference con EcoVadis, B Corp, MSCI, GRI" },
  "preus.premium.f5": { ca: "Alertes personalitzades per temes", es: "Alertas personalizadas por temas" },
  "preus.premium.cta": { ca: "Prova 7 dies gratis", es: "Prueba 7 días gratis" },

  "preus.ultra.name": { ca: "Ultra", es: "Ultra" },
  "preus.ultra.badge": {
    ca: "Disponible abril 2027",
    es: "Disponible abril 2027",
  },
  "preus.ultra.description": {
    ca: "Per a l'equip que necessita sintetitzar per a la junta.",
    es: "Para el equipo que necesita sintetizar para la junta.",
  },
  "preus.ultra.f1": { ca: "Tot el que té Premium", es: "Todo lo que tiene Premium" },
  "preus.ultra.f2": { ca: "Podcast d'àudio de cada informe (5 min)", es: "Podcast de audio de cada informe (5 min)" },
  "preus.ultra.f3": { ca: "Diapositives PowerPoint editables", es: "Diapositivas PowerPoint editables" },
  "preus.ultra.f4": { ca: "Dossier mensual temàtic + 1 connexió personalitzada/mes", es: "Dossier mensual temático + 1 conexión personalizada/mes" },
  "preus.ultra.cta": { ca: "M'avisa quan obri", es: "Avísame cuando abra" },

  "preus.earlybird.title": {
    ca: "Early bird — 50 primers subscriptors",
    es: "Early bird — 50 primeros suscriptores",
  },
  "preus.earlybird.body": {
    ca: "Els primers 50 subscriptors Premium tenen preu de 29€/mes (en lloc de 39€) de per vida. Llançament setembre 2026. Una vegada assignedes les 50 places, el preu torna a 39€.",
    es: "Los primeros 50 suscriptores Premium tienen precio de 29€/mes (en lugar de 39€) de por vida. Lanzamiento septiembre 2026. Una vez asignadas las 50 plazas, el precio vuelve a 39€.",
  },

  "preus.note.title": { ca: "Regla dels 6 mesos:", es: "Regla de los 6 meses:" },
  "preus.note.body": {
    ca: "Tots els informes amb més de 6 mesos d'antiguitat són gratuïts per sempre. Només els informes recents requereixen Premium. Així garantim accés universal al coneixement ESG acumulat.",
    es: "Todos los informes con más de 6 meses de antigüedad son gratuitos para siempre. Solo los informes recientes requieren Premium. Así garantizamos acceso universal al conocimiento ESG acumulado.",
  },

  // ============ Qui som ============
  "quisom.eyebrow": {
    ca: "Qui som · Criteri ESG",
    es: "Quiénes somos · Criteri ESG",
  },
  "quisom.title": {
    ca: "Tecnologia al servei del criteri humà.",
    es: "Tecnología al servicio del criterio humano.",
  },
  "quisom.subtitle": {
    ca: "Una empresa petita amb una missió clara: ajudar les organitzacions a ser més ètiques, sostenibles i transformadores.",
    es: "Una empresa pequeña con una misión clara: ayudar a las organizaciones a ser más éticas, sostenibles y transformadoras.",
  },

  "quisom.manifest.title": {
    ca: "El nostre manifest",
    es: "Nuestro manifiesto",
  },
  "quisom.manifest.body": {
    ca: "La sensibilitat i la preocupació pel món que ens envolta és el motor que ens fa moure. Volem ajudar i facilitar que les empreses, com a agents ciutadans que construeixen societat, siguin les més eficients, exemplars i transformadores possibles.",
    es: "La sensibilidad y la preocupación por el mundo que nos rodea es el motor que nos hace mover. Queremos ayudar y facilitar que las empresas, como agentes ciudadanos que construyen sociedad, sean las más eficientes, ejemplares y transformadoras posibles.",
  },

  "quisom.paragraph1": {
    ca: "En un món on tot va tan de pressa, podem aprofitar les eines disponibles per facilitar-nos la vida, optimitzar el temps i destinar-lo a la feina important. Criteri ESG neix d'aquesta convicció: aplicar la tecnologia per alliberar temps dels professionals perquè puguin fer allò que les màquines no poden — pensar, decidir, liderar.",
    es: "En un mundo donde todo va tan deprisa, podemos aprovechar las herramientas disponibles para facilitarnos la vida, optimizar el tiempo y destinarlo al trabajo importante. Criteri ESG nace de esta convicción: aplicar la tecnología para liberar tiempo de los profesionales para que puedan hacer aquello que las máquinas no pueden — pensar, decidir, liderar.",
  },

  "quisom.paragraph2": {
    ca: "Per això hem construït un sistema que combina el millor de la intel·ligència artificial amb la mirada ètica de persones que coneixen el sector ESG. La IA fa la feina pesada — recerca, síntesi, classificació. Les persones aportem criteri, context i judici.",
    es: "Por eso hemos construido un sistema que combina lo mejor de la inteligencia artificial con la mirada ética de personas que conocen el sector ESG. La IA hace el trabajo pesado — investigación, síntesis, clasificación. Las personas aportamos criterio, contexto y juicio.",
  },

  "quisom.pilar1.title": {
    ca: "Sensibilitat",
    es: "Sensibilidad",
  },
  "quisom.pilar1.body": {
    ca: "Ens mou la preocupació real pel món, no l'oportunitat de mercat. L'ESG no és un negoci; és una responsabilitat.",
    es: "Nos mueve la preocupación real por el mundo, no la oportunidad de mercado. ESG no es un negocio; es una responsabilidad.",
  },
  "quisom.pilar2.title": {
    ca: "Tecnologia",
    es: "Tecnología",
  },
  "quisom.pilar2.body": {
    ca: "Aprofitem les eines disponibles —IA, automatització, bases de dades— per optimitzar el temps i destinar-lo al que importa.",
    es: "Aprovechamos las herramientas disponibles —IA, automatización, bases de datos— para optimizar el tiempo y destinarlo a lo que importa.",
  },
  "quisom.pilar3.title": {
    ca: "Criteri",
    es: "Criterio",
  },
  "quisom.pilar3.body": {
    ca: "La tecnologia mai substitueix el judici humà. La IA proposa; les persones revisen, decideixen i assumeixen responsabilitat.",
    es: "La tecnología nunca sustituye el juicio humano. La IA propone; las personas revisan, deciden y asumen responsabilidad.",
  },

  "quisom.ai.title": {
    ca: "Com treballem",
    es: "Cómo trabajamos",
  },
  "quisom.ai.body": {
    ca: "Criteri ESG compta amb un sistema integrat alimentat per un agent d'IA preconfigurat com a expert en recerca i generació d'informes ESG. L'agent monitoritza fonts institucionals (UE, WEF, OECD, IPCC, Banc d'Espanya, Forética…), detecta nous informes, en sintetitza el contingut seguint els 8 blocs del nostre format —Semàfor Metodològic + 7 blocs narratius— i passa un corrector ortogràfic automàtic abans de qualsevol publicació.",
    es: "Criteri ESG cuenta con un sistema integrado alimentado por un agente de IA preconfigurado como experto en investigación y generación de informes ESG. El agente monitoriza fuentes institucionales (UE, WEF, OECD, IPCC, Banco de España, Forética…), detecta nuevos informes, sintetiza su contenido siguiendo los 8 bloques de nuestro formato —Semáforo Metodológico + 7 bloques narrativos— y pasa un corrector ortográfico automático antes de cualquier publicación.",
  },
  "quisom.ai.supervision.title": {
    ca: "Supervisió humana sempre:",
    es: "Supervisión humana siempre:",
  },
  "quisom.ai.supervision.body": {
    ca: "Cap informe es publica sense revisió prèvia de l'equip. L'agent sintetitza; les persones validen, corregeixen i aproven. La responsabilitat editorial és nostra, mai de la IA.",
    es: "Ningún informe se publica sin revisión previa del equipo. El agente sintetiza; las personas validan, corrigen y aprueban. La responsabilidad editorial es nuestra, nunca de la IA.",
  },

  "quisom.closing": {
    ca: "Si creus que les empreses poden ser agents de canvi —i que la tecnologia ha d'estar al servei del criteri humà—, som dels teus.",
    es: "Si crees que las empresas pueden ser agentes de cambio —y que la tecnología debe estar al servicio del criterio humano—, somos de los tuyos.",
  },
} as const;
