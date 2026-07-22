export type Language = "ca" | "es";

export type TranslationKey = keyof typeof translations;

export const translations = {
  "brand.name": { ca: "Criteri ESG", es: "Criteri ESG" },

  "nav.informes": { ca: "Biblioteca d'informes", es: "Biblioteca de informes" },
  "nav.quisom": { ca: "Qui som", es: "Quiénes somos" },
  "nav.quefem": { ca: "Què fem", es: "Qué hacemos" },
  "nav.estandares": { ca: "Estàndards ESG", es: "Estándares ESG" },
  "nav.preus": { ca: "Preus", es: "Precios" },
  "nav.login": { ca: "Inicia sessió", es: "Inicia sesión" },
  "nav.cuenta": { ca: "El meu compte", es: "Mi cuenta" },
  "nav.logout": { ca: "Tancar sessió", es: "Cerrar sesión" },
  "nav.menu": { ca: "Menú", es: "Menú" },
  "nav.user.default": { ca: "Usuari", es: "Usuario" },
  "nav.cerca": { ca: "Cerca informes…", es: "Buscar informes…" },
  "nav.cerca.btn": { ca: "Cercar", es: "Buscar" },

  "hero.eyebrow": {
    ca: "Intel·ligència ESG · Des de 2026",
    es: "Inteligencia ESG · Desde 2026",
  },
  "hero.title.line1": {
    ca: "Informes ESG",
    es: "Informes ESG",
  },
  "hero.title.line1b": {
    ca: "Coneixement.",
    es: "Conocimiento.",
  },
  "hero.title.line2": {
    ca: "En només 5 minuts.",
    es: "En sólo 5 minutos.",
  },
  "hero.bullet1": {
    ca: "Aplica les conclusions amb criteri",
    es: "Aplica las conclusiones con criterio",
  },
  "hero.bullet2": {
    ca: "Diferencia't actuant èticament",
    es: "Diferénciate actuando éticamente",
  },
  "hero.bullet3": {
    ca: "IA agèntica al servei de l'empresa",
    es: "IA agéntica al servicio de la empresa",
  },
  "hero.bloc0.name": { ca: "Semàfor Metodològic", es: "Semáforo Metodológico" },
  "hero.bloc0.desc": {
    ca: "5 indicadors per avaluar la qualitat de l'informe",
    es: "5 indicadores para evaluar la calidad del informe",
  },
  "hero.bloc6.name": { ca: "Accions recomanades", es: "Acciones recomendadas" },
  "hero.bloc6.desc": {
    ca: "3-5 accions concretes. El cor operatiu.",
    es: "3-5 acciones concretas. El corazón operativo.",
  },
  "hero.bloc7.name": { ca: "Cross-reference", es: "Cross-reference" },
  "hero.bloc7.desc": {
    ca: "Mapatge amb EcoVadis, B Corp, MSCI, GRI.",
    es: "Mapeo con EcoVadis, B Corp, MSCI, GRI.",
  },
  "hero.cta.trial": { ca: "Registra't gratis", es: "Regístrate gratis" },
  "hero.cta.newsletter": { ca: "Rep la newsletter", es: "Recibe la newsletter" },
  "hero.note": {
    ca: "Accés gratuït a informes >6 mesos. Sense targeta.",
    es: "Acceso gratis a informes >6 meses. Sin tarjeta.",
  },
  "hero.xref.badge": {
    ca: "⭐ EXCLUSIU · CAP COMPETIDOR HO FA",
    es: "⭐ EXCLUSIVO · NINGÚN COMPETIDOR LO HACE",
  },
  "hero.xref.title": {
    ca: "Cross-reference: Revisió ESRS ↔ les teves certificacions",
    es: "Cross-reference: Revisión ESRS ↔ tus certificaciones",
  },
  "hero.xref.subtitle": {
    ca: "Comissió Europea · DG FISMA · 6 de maig de 2026",
    es: "Comisión Europea · DG FISMA · 6 mayo 2026",
  },
  "hero.xref.col_cert": { ca: "Certificació", es: "Certificación" },
  "hero.xref.col_criterion": { ca: "Criteri afectat", es: "Criterio afectado" },
  "hero.xref.col_impact": { ca: "Impacte", es: "Impacto" },
  "hero.xref.impact.high": { ca: "Alt", es: "Alto" },
  "hero.xref.impact.med": { ca: "Mitjà", es: "Medio" },
  "hero.xref.impact.low": { ca: "Baix", es: "Bajo" },
  "hero.xref.note_title": { ca: "Per què importa:", es: "¿Por qué importa:" },
  "hero.xref.note_body": {
    ca: "sense aquest mapeig, no saps si un informe europeu t'afecta fins que és massa tard. Amb Criteri, ho saps en el moment de publicar-se.",
    es: "sin este mapeo, no sabes si un informe europeo te afecta hasta que es demasiado tarde. Con Criteri, lo sabes en el momento de publicarse.",
  },

  "sections.title": {
    ca: "Què trobaràs a Criteri ESG",
    es: "Qué encontrarás en Criteri ESG",
  },
  "sections.subtitle": {
    ca: "Sis portes per entrar al mateix objectiu: decidir amb criteri.",
    es: "Seis puertas para entrar al mismo objetivo: decidir con criterio.",
  },
  "sections.informes.title": { ca: "Biblioteca d'informes", es: "Biblioteca de informes" },
  "sections.informes.desc": {
    ca: "Cada informe rellevant de la UE, sintetitzat en 8 blocs accionables amb cross-reference a EcoVadis, B Corp i MSCI.",
    es: "Cada informe relevante de la UE, sintetizado en 8 bloques accionables con cross-reference a EcoVadis, B Corp y MSCI.",
  },
  "sections.certif.title": { ca: "Guies de certificació", es: "Guías de certificación" },
  "sections.certif.desc": {
    ca: "Dossiers pas a pas per pujar EcoVadis, obtenir B Corp, passar CSRD o millorar MSCI rating.",
    es: "Dossiers paso a paso para subir EcoVadis, obtener B Corp, pasar CSRD o mejorar MSCI rating.",
  },
  "sections.crossref.title": { ca: "Cross-reference amb frameworks", es: "Cross-reference con frameworks" },
  "sections.crossref.desc": {
    ca: "Cada informe es mapeja amb EcoVadis, B Corp, MSCI i GRI perquè sàpigues com t'afecta segons la teva certificació.",
    es: "Cada informe se mapea con EcoVadis, B Corp, MSCI y GRI para que sepas cómo te afecta según tu certificación.",
  },
  "sections.autodiag.title": { ca: "Autodiagnòstic", es: "Autodiagnóstico" },
  "sections.autodiag.desc": {
    ca: "Posa't a prova: respon 15 preguntes i rep un informe amb punts forts, febles i projecció futura segons lleis en marxa.",
    es: "Ponte a prueba: responde 15 preguntas y recibe un informe con puntos fuertes, débiles y proyección futura según leyes en marcha.",
  },
  "sections.newsletter.title": { ca: "Newsletter bimensual", es: "Newsletter bimensual" },
  "sections.newsletter.desc": {
    ca: "Informes recents, notícies i creuaments d'informació rellevants, cada dues setmanes. Gratuït, cancel·la quan vulguis.",
    es: "Informes recientes, noticias y cruces de información relevantes, cada dos semanas. Gratis, cancela cuando quieras.",
  },
  "sections.semafor.title": { ca: "Semàfor Metodològic", es: "Semáforo Metodológico" },
  "sections.semafor.desc": {
    ca: "Avalua la qualitat metodològica de cada informe en 10 segons. 5 indicadors + nota A-D. Cap competidor ho fa.",
    es: "Evalúa la calidad metodológica de cada informe en 10 segundos. 5 indicadores + nota A-D. Ningún competidor lo hace.",
  },
  "sections.editorial.title": { ca: "Més enllà del Checkbox", es: "Más allá del Checkbox" },
  "sections.editorial.desc": {
    ca: "Veu editorial crítica que qüestiona el marc ESG hegemònic: dignitat, justícia distributiva, arrelament territorial.",
    es: "Voz editorial crítica que cuestiona el marco ESG hegemónico: dignidad, justicia distributiva, arraigo territorial.",
  },
  "sections.cartadirector.title": { ca: "Carta del Director", es: "Carta del Director" },
  "sections.cartadirector.desc": {
    ca: "Cada mes, l'empremta ètica d'en Paolo. Mirada personal sobre els informes del període i el compromís de Criteri.",
    es: "Cada mes, la huella ética de Paolo. Mirada personal sobre los informes del período y el compromiso de Criteri.",
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
    es: "Lee el informe completo con registro gratis",
  },

  "cta.newsletter.eyebrow": { ca: "La newsletter gratuïta", es: "La newsletter gratis" },
  "cta.newsletter.title": {
    ca: "Cada dues setmanes, informes que has de conèixer.",
    es: "Cada dos semanas, informes que debes conocer.",
  },
  "cta.newsletter.body": {
    ca: "Resums executius de 300 paraules + una connexió entre ells. 5 minuts de lectura que et posen al dia. Cancel·la quan vulguis.",
    es: "Resúmenes ejecutivos de 300 palabras + una conexión entre ellos. 5 minutos de lectura que te pon al día. Cancela cuando quieras.",
  },
  "cta.premium.eyebrow": { ca: "Fes-te Premium", es: "Hazte Premium" },
  "cta.premium.title": { ca: "Early bird: 290 €/any", es: "Early bird: 290 €/año" },
  "cta.premium.body": {
    ca: "Accés complet a la biblioteca, cerca semàntica, alertes personalitzades, cross-reference amb certificacions i dossiers temàtics. Per als primers 50 subscriptors.",
    es: "Acceso completo a la biblioteca, búsqueda semántica, alertas personalizadas, cross-reference con certificaciones y dossiers temáticos. Para los primeros 50 suscriptores.",
  },

  // ============ Mid sections (Speed + Format) ============
  "mid.speed.eyebrow": { ca: "BIBLIOTECA D'INFORMES", es: "BIBLIOTECA DE INFORMES" },
  "mid.speed.title": {
    ca: "Estalvia temps, només 5 min.",
    es: "Ahorra tiempo, solo 5 min.",
  },
  "mid.speed.body": {
    ca: "Un director de sostenibilitat dedica de mitjana el 60% del seu temps a recopilar informació. Criteri ESG centralitza tota aquesta informació i la sintetitza en 8 blocs, perquè el temps d'anàlisi es converteixi en temps de decisió.",
    es: "Un director de sostenibilidad dedica de media el 60% de su tiempo a recopilar información. Criteri ESG centraliza toda esta información y la sintetiza en 8 bloques, para que el tiempo de análisis se convierta en tiempo de decisión.",
  },
  "mid.speed.stat1.value": { ca: "5 min", es: "5 min" },
  "mid.speed.stat1.label": {
    ca: "per entendre un informe",
    es: "para entender un informe",
  },
  "mid.speed.stat2.value": { ca: "180+", es: "180+" },
  "mid.speed.stat2.label": {
    ca: "fonts monitoritzades",
    es: "fuentes monitorizadas",
  },
  "mid.speed.stat3.value": { ca: "8", es: "8" },
  "mid.speed.stat3.label": {
    ca: "blocs per informe",
    es: "bloques por informe",
  },

  "mid.format.eyebrow": {
    ca: "COM REBRÀS LA INFORMACIÓ",
    es: "CÓMO RECIBIRÁS LA INFORMACIÓN",
  },
  "mid.format.title": {
    ca: "Vuit blocs. Un mateix patró per a 1.000 informes.",
    es: "Ocho bloques. Un mismo patrón para 1.000 informes.",
  },
  "mid.format.body": {
    ca: "La consistència et permet saber què esperar. Cada informe segueix el mateix esquema perquè puguis comparar, prioritzar i decidir.",
    es: "La consistencia te permite saber qué esperar. Cada informe sigue el mismo esquema para que puedas comparar, priorizar y decidir.",
  },

  "mid.format.bloc0.title": { ca: "0. Semàfor Metodològic", es: "0. Semáforo Metodológico" },
  "mid.format.bloc0.desc": {
    ca: "5 indicadors + nota A-D. Avalua la qualitat en 10 segons.",
    es: "5 indicadores + nota A-D. Evalúa la calidad en 10 segundos.",
  },
  "mid.format.bloc1.title": { ca: "1. Fitxa tècnica", es: "1. Ficha técnica" },
  "mid.format.bloc1.desc": {
    ca: "Institució, data, tipus, pàgines, URL. 50 paraules.",
    es: "Institución, fecha, tipo, páginas, URL. 50 palabras.",
  },
  "mid.format.bloc2.title": { ca: "2. 5 dades clau", es: "2. 5 datos clave" },
  "mid.format.bloc2.desc": {
    ca: "Punts quantitatius amb valor, context i pàgina citada.",
    es: "Puntos cuantitativos con valor, contexto y página citada.",
  },
  "mid.format.bloc3.title": { ca: "3. Resum executiu", es: "3. Resumen ejecutivo" },
  "mid.format.bloc3.desc": {
    ca: "Què diu en llenguatge planer. 300 paraules.",
    es: "Qué dice en lenguaje llano. 300 palabras.",
  },
  "mid.format.bloc4.title": { ca: "4. Implicacions", es: "4. Implicaciones" },
  "mid.format.bloc4.desc": {
    ca: "Empreses, reguladors, ciutadans. + Més enllà del Checkbox.",
    es: "Empresas, reguladores, ciudadanos. + Más allá del Checkbox.",
  },
  "mid.format.bloc5.title": { ca: "5. Connexions", es: "5. Conexiones" },
  "mid.format.bloc5.desc": {
    ca: "Relacions amb altres informes i actualitat.",
    es: "Relaciones con otros informes y actualidad.",
  },
  "mid.format.bloc6.title": { ca: "6. Accions recomanades", es: "6. Acciones recomendadas" },
  "mid.format.bloc6.desc": {
    ca: "3-5 accions concretes. El cor operatiu.",
    es: "3-5 acciones concretas. El corazón operativo.",
  },
  "mid.format.bloc7.title": { ca: "7. Cross-reference", es: "7. Cross-reference" },
  "mid.format.bloc7.desc": {
    ca: "Mapatge amb EcoVadis, B Corp, MSCI, GRI.",
    es: "Mapeo con EcoVadis, B Corp, MSCI, GRI.",
  },

  "form.title": { ca: "Registre gratuït", es: "Registro gratis" },
  "form.subtitle": {
    ca: "Accedeix als informes oberts (>6 mesos) i a la newsletter bimensual. Sense cost, sense targeta.",
    es: "Accede a los informes abiertos (>6 meses) y a la newsletter bimensual. Sin coste, sin tarjeta.",
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

  // ============ FAQ ============
  "faq.eyebrow": { ca: "PREGUNTES FREQÜENTS", es: "PREGUNTAS FRECUENTES" },
  "faq.title": {
    ca: "Tot el que et pots preguntar.",
    es: "Todo lo que te puedes preguntar.",
  },
  "faq.q1.q": {
    ca: "És una eina de compliance o estratègica?",
    es: "¿Es una herramienta de compliance o estratégica?",
  },
  "faq.q1.a": {
    ca: "Tots dos. Cobrim el que és obligatori (CSRD, CSDDD, SFDR) i el que és estratègic (EcoVadis, B Corp, MSCI rating). L'usuari tria el seu enfocament: pot prioritzar compliment normatiu o millorar reputació.",
    es: "Ambos. Cubrimos lo que es obligatorio (CSRD, CSDDD, SFDR) y lo que es estratégico (EcoVadis, B Corp, MSCI rating). El usuario elige su enfoque: puede priorizar cumplimiento normativo o mejorar reputación.",
  },
  "faq.q2.q": {
    ca: "Quins frameworks cobriu?",
    es: "¿Qué frameworks cubren?",
  },
  "faq.q2.a": {
    ca: "Els 7 més usats: CSRD/ESRS, Taxonomia UE, SFDR, CSDDD, GRI, SASB, TCFD/TNFD. A més de les certificacions EcoVadis, B Corp, MSCI ESG, Sustainalytics, ISS ESG i CDP.",
    es: "Los 7 más usados: CSRD/ESRS, Taxonomía UE, SFDR, CSDDD, GRI, SASB, TCFD/TNFD. Además de las certificaciones EcoVadis, B Corp, MSCI ESG, Sustainalytics, ISS ESG y CDP.",
  },
  "faq.q3.q": {
    ca: "Com es comparen els informes entre ells?",
    es: "¿Cómo se comparan los informes entre sí?",
  },
  "faq.q3.a": {
    ca: "Cada informe té cross-reference amb altres informes i amb els 5 frameworks principals. Pots veure evolucions, contradiccions i complementarietats.",
    es: "Cada informe tiene cross-reference con otros informes y con los 5 frameworks principales. Puedes ver evoluciones, contradicciones y complementariedades.",
  },
  "faq.q4.q": {
    ca: "Quan entra en vigor la subscripció?",
    es: "¿Cuándo entra en vigor la suscripción?",
  },
  "faq.q4.a": {
    ca: "La web obre al públic el setembre 2026. La newsletter bimensual ja està operativa. Els primers 50 subscriptors Premium tenen preu promocional de 290€/any (vs 440€ normal) de per vida.",
    es: "La web abre al público en septiembre 2026. La newsletter bimensual ya está operativa. Los primeros 50 suscriptores Premium tienen precio promocional de 290€/año (vs 440€ normal) de por vida.",
  },
  "faq.q5.q": {
    ca: "Puc provar-ho abans de pagar?",
    es: "¿Puedo probarlo antes de pagar?",
  },
  "faq.q5.a": {
    ca: "Sí. El registre és gratuït i et dóna accés a la newsletter bimensual i als informes amb més de 6 mesos. Per accedir als informes recents, necessites Premium (290 €/any early bird per als primers 50).",
    es: "Sí. El registro es gratis y te da acceso a la newsletter bimensual y a los informes con más de 6 meses. Para acceder a los informes recientes, necesitas Premium (290 €/año early bird para los primeros 50).",
  },

  // ============ Auth dialog (registre + login) ============
  "auth.title": { ca: "Criteri ESG", es: "Criteri ESG" },
  "auth.subtitle": {
    ca: "Accedeix o crea el teu compte per començar a llegir informes ESG sintetitzats.",
    es: "Accede o crea tu cuenta para empezar a leer informes ESG sintetizados.",
  },
  "auth.tab.register": { ca: "Registre", es: "Registro" },
  "auth.tab.login": { ca: "Iniciar sessió", es: "Iniciar sesión" },
  "auth.google": {
    ca: "Continuar amb Google",
    es: "Continuar con Google",
  },
  "auth.divider.register": {
    ca: "o registra't amb correu",
    es: "o regístrate con correo",
  },
  "auth.divider.login": {
    ca: "o inicia sessió amb correu",
    es: "o inicia sesión con correo",
  },
  "auth.divider.password": {
    ca: "o amb contrasenya",
    es: "o con contraseña",
  },
  "auth.name": { ca: "Nom i cognoms", es: "Nombre y apellidos" },
  "auth.email": { ca: "Correu electrònic", es: "Correo electrónico" },
  "auth.password": { ca: "Contrasenya", es: "Contraseña" },
  "auth.company": { ca: "Empresa o organització (opcional)", es: "Empresa u organización (opcional)" },
  "auth.sector": { ca: "Sector professional", es: "Sector profesional" },
  "auth.sector.placeholder": { ca: "— Selecciona —", es: "— Selecciona —" },
  "auth.interests": { ca: "Interessos principals", es: "Intereses principales" },
  "auth.plan": { ca: "Pla", es: "Plan" },
  "auth.plan.free": { ca: "Gratuït", es: "Gratis" },
  "auth.plan.free.desc": {
    ca: "Newsletter + accés a informes >6 mesos",
    es: "Newsletter + acceso a informes >6 meses",
  },
  "auth.plan.premium": { ca: "Premium", es: "Premium" },
  "auth.plan.premium.desc": {
    ca: "290 €/any · accés total + cross-reference",
    es: "290 €/año · acceso total + cross-reference",
  },
  "auth.newsletter.title": {
    ca: "Sí, vull rebre la newsletter bimensual gratuïta amb informes recents, notícies i creuaments d'informació rellevants.",
    es: "Sí, quiero recibir la newsletter bimensual gratis con informes recientes, noticias y cruces de información relevantes.",
  },
  "auth.newsletter.lang": {
    ca: "Idioma de la newsletter:",
    es: "Idioma de la newsletter:",
  },
  "auth.gdpr": {
    ca: "He llegit i accepto la política de privacitat i el tractament de les meves dades segons el RGPD.",
    es: "He leído y acepto la política de privacidad y el tratamiento de mis datos según el RGPD.",
  },
  "auth.gdpr.error": {
    ca: "Cal acceptar la política de privacitat per crear un compte.",
    es: "Debes aceptar la política de privacidad para crear una cuenta.",
  },
  "auth.submit.register.free": {
    ca: "Crear compte gratuït",
    es: "Crear cuenta gratis",
  },
  "auth.submit.register.premium": {
    ca: "Continuar a pagament Premium",
    es: "Continuar a pago Premium",
  },
  "auth.submit.login": { ca: "Iniciar sessió", es: "Iniciar sesión" },
  "auth.magic.send": {
    ca: "Enviar enllaç màgic",
    es: "Enviar enlace mágico",
  },
  "auth.magic.sent.title": {
    ca: "Comprova el teu correu",
    es: "Revisa tu correo",
  },
  "auth.magic.sent.body": {
    ca: "T'hem enviat un enllaç màgic. Fes-hi clic per iniciar sessió.",
    es: "Te hemos enviado un enlace mágico. Haz clic en él para iniciar sesión.",
  },
  "auth.magic.sent.different": {
    ca: "Enviar a un altre correu",
    es: "Enviar a otro correo",
  },
  "auth.forgot": {
    ca: "Has oblidat la contrasenya?",
    es: "¿Olvidaste tu contraseña?",
  },
  "auth.reset.sent": {
    ca: "Enllaç de recuperació enviat. Comprova el teu correu.",
    es: "Enlace de recuperación enviado. Revisa tu correo.",
  },
  "auth.terms": {
    ca: "En registrar-te acceptes els termes del servei.",
    es: "Al registrarte aceptas los términos del servicio.",
  },
  "auth.loading.register": { ca: "Creant compte…", es: "Creando cuenta…" },
  "auth.loading.login": { ca: "Iniciant…", es: "Iniciando…" },
  "auth.loading.magic": { ca: "Enviant…", es: "Enviando…" },
  "auth.success.register.title": {
    ca: "Comprova el teu correu",
    es: "Revisa tu correo",
  },
  "auth.success.register.body": {
    ca: "T'hem enviat un enllaç de confirmació. Fes-hi clic per activar el teu compte.",
    es: "Te hemos enviado un enlace de confirmación. Haz clic en él para activar tu cuenta.",
  },
  "auth.toast.welcome": {
    ca: "Benvingut a Criteri ESG",
    es: "Bienvenido a Criteri ESG",
  },
  "auth.toast.welcome.body": {
    ca: "El teu compte s'ha creat correctament.",
    es: "Tu cuenta se ha creado correctamente.",
  },
  "auth.toast.session": {
    ca: "Sessió iniciada",
    es: "Sesión iniciada",
  },
  "auth.toast.session.body": {
    ca: "Benvingut de nou a Criteri ESG.",
    es: "Bienvenido de nuevo a Criteri ESG.",
  },
  "auth.toast.magic.sent": {
    ca: "Enllaç enviat",
    es: "Enlace enviado",
  },
  "auth.toast.magic.sent.body": {
    ca: "Comprova el teu correu per iniciar sessió.",
    es: "Revisa tu correo para iniciar sesión.",
  },
  "auth.toast.reset.sent": {
    ca: "Enllaç de recuperació enviat",
    es: "Enlace de recuperación enviado",
  },
  "auth.toast.reset.sent.body": {
    ca: "Comprova el teu correu per restablir la contrasenya.",
    es: "Revisa tu correo para restablecer la contraseña.",
  },
  "auth.toast.error.register": {
    ca: "Error en el registre",
    es: "Error en el registro",
  },
  "auth.toast.error.login": {
    ca: "No s'ha pogut iniciar sessió",
    es: "No se ha podido iniciar sesión",
  },
  "auth.toast.error.magic": {
    ca: "No s'ha pogut enviar l'enllaç",
    es: "No se ha podido enviar el enlace",
  },
  "auth.close": { ca: "Tancar", es: "Cerrar" },
  "auth.supabase.notconfigured": {
    ca: "Supabase no està configurat. Demostració en mode lectura.",
    es: "Supabase no está configurado. Demostración en modo lectura.",
  },

  // ============ CTA condicionals segons estat d'usuari ============
  "cta.upgrade.title": { ca: "Fes-te Premium", es: "Hazte Premium" },
  "cta.upgrade.body": {
    ca: "Accedeix a la biblioteca completa, cross-references i informes >6 mesos.",
    es: "Accede a la biblioteca completa, cross-references e informes >6 meses.",
  },
  "cta.upgrade.button": { ca: "Fes-te Premium", es: "Hazte Premium" },
  "cta.premium.badge": { ca: "Ets Premium", es: "Eres Premium" },
  "cta.newsletter.manage": {
    ca: "Gestiona la newsletter",
    es: "Gestiona la newsletter",
  },
  "cta.newsletter.subscribed": {
    ca: "Ja estàs subscrit a la newsletter",
    es: "Ya estás suscrito a la newsletter",
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
  "footer.faq": { ca: "Preguntes freqüents", es: "Preguntas frecuentes" },

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
    ca: "Comencem amb 2 mesos gratuïts per a tothom (setembre i octubre 2026). A partir de novembre, tries el teu pla. La subscripció Premium es paga anualment. Sense permanència, cancel·la quan vulguis.",
    es: "Empezamos con 2 meses gratis para todos (septiembre y octubre 2026). A partir de noviembre, eliges tu plan. La suscripción Premium se paga anualmente. Sin permanencia, cancela cuando quieras.",
  },
  "preus.period.forever": { ca: "sempre", es: "siempre" },
  "preus.period.month": { ca: "mes", es: "mes" },
  "preus.period.year": { ca: "any", es: "año" },
  "preus.toggle.monthly": { ca: "Mensual", es: "Mensual" },
  "preus.toggle.annual": { ca: "Anual", es: "Anual" },
  "preus.toggle.annual.note": {
    ca: "Estalvia 28€/any pagant anualment",
    es: "Ahorra 28 €/año pagando anualmente",
  },

  "preus.free.name": { ca: "Gratuït", es: "Gratis" },
  "preus.free.description": {
    ca: "Per començar a entendre l'ecosistema ESG europeu.",
    es: "Para empezar a entender el ecosistema ESG europeo.",
  },
  "preus.free.f1": { ca: "Newsletter bimensual", es: "Newsletter bimensual" },
  "preus.free.f2": { ca: "Accés a informes >6 mesos", es: "Acceso a informes >6 meses" },
  "preus.free.f3": { ca: "Informes amb més de 6 mesos (arxiu)", es: "Informes con más de 6 meses (archivo)" },
  "preus.free.f4": { ca: "Accés a la biblioteca pública", es: "Acceso a la biblioteca pública" },
  "preus.free.cta": { ca: "Comença gratis", es: "Empieza gratis" },

  "preus.premium.name": { ca: "Premium", es: "Premium" },
  "preus.premium.badge": {
    ca: "Anual",
    es: "Anual",
  },
  "preus.premium.description": {
    ca: "Per al professional que ha de decidir cada setmana.",
    es: "Para el profesional que debe decidir cada semana.",
  },
  "preus.premium.f1": { ca: "Tot el que té el pla Gratuït", es: "Todo lo que tiene el plan Gratis" },
  "preus.premium.f2": { ca: "Arxiu complet i cerca avançada", es: "Archivo completo y búsqueda avanzada" },
  "preus.premium.f3": { ca: "Tots els informes recents (< 6 mesos)", es: "Todos los informes recientes (< 6 meses)" },
  "preus.premium.f4": { ca: "Cross-reference amb EcoVadis, B Corp, MSCI, GRI", es: "Cross-reference con EcoVadis, B Corp, MSCI, GRI" },
  "preus.premium.f5": { ca: "Alertes personalitzades per temes", es: "Alertas personalizadas por temas" },
  "preus.premium.f6": { ca: "Preguntes per millorar (reflexió ètica mensual)", es: "Preguntas para mejorar (reflexión ética mensual)" },
  "preus.premium.subprice": {
    ca: "Equival a 36,67€/mes · Impostos inclosos",
    es: "Equivale a 36,67 €/mes · Impuestos incluidos",
  },
  "preus.premium.subprice.monthly": {
    ca: "Impostos inclosos",
    es: "Impuestos incluidos",
  },
  "preus.premium.cta": { ca: "Subscriure'm anualment", es: "Suscribirme anualmente" },
  "preus.premium.cta.monthly": { ca: "Subscriure'm mensualment", es: "Suscribirme mensualmente" },

  "preus.earlybird.title": {
    ca: "Early bird — 50 places amb pagament anual",
    es: "Early bird — 50 plazas con pago anual",
  },
  "preus.earlybird.eyebrow": {
    ca: "Oferta de llançament · 50 places limitades",
    es: "Oferta de lanzamiento · 50 plazas limitadas",
  },
  "preus.earlybird.price": { ca: "290 €", es: "290 €" },
  "preus.earlybird.period": { ca: "any", es: "año" },
  "preus.earlybird.subprice": {
    ca: "Equival a 24,17€/mes · Impostos inclosos · Estalvi de 150€",
    es: "Equivale a 24,17 €/mes · Impuestos incluidos · Ahorro de 150 €",
  },
  "preus.earlybird.body": {
    ca: "Els primers 50 subscriptors Premium paguen 290€/any (impostos inclosos) en lloc dels 440€ habituals. Equival a 24,17€/mes — un descompte del 34%. Llançament setembre 2026. Una vegada assignades les 50 places, el preu torna a 440€/any.",
    es: "Los primeros 50 suscriptores Premium pagan 290 €/año (impuestos incluidos) en lugar de los 440 € habituales. Equivale a 24,17 €/mes — un descuento del 34%. Lanzamiento septiembre 2026. Una vez asignadas las 50 plazas, el precio vuelve a 440 €/año.",
  },
  "preus.earlybird.cta": { ca: "Reservar plaça early bird", es: "Reservar plaza early bird" },

  "preus.ultra.name": { ca: "Ultra", es: "Ultra" },
  "preus.ultra.badge": {
    ca: "Pròximament · abril 2027",
    es: "Próximamente · abril 2027",
  },
  "preus.ultra.description": {
    ca: "Per a l'equip que necessita sintetitzar per a la junta.",
    es: "Para el equipo que necesita sintetizar para la junta.",
  },
  "preus.ultra.f1": { ca: "Tot el que té Premium", es: "Todo lo que tiene Premium" },
  "preus.ultra.f2": { ca: "Podcast d'àudio de cada informe (5 min)", es: "Podcast de audio de cada informe (5 min)" },
  "preus.ultra.f3": { ca: "Diapositives PowerPoint editables", es: "Diapositivas PowerPoint editables" },
  "preus.ultra.f4": { ca: "Dossier mensual temàtic + 1 connexió personalitzada/mes", es: "Dossier mensual temático + 1 conexión personalizada/mes" },
  "preus.ultra.cta": { ca: "Aviseu-me quan obri", es: "Avisadme cuando abra" },

  "preus.note.title": { ca: "Regla dels 6 mesos:", es: "Regla de los 6 meses:" },
  "preus.note.body": {
    ca: "Tots els informes amb més de 6 mesos d'antiguitat són gratuïts per sempre. Només els informes recents requereixen Premium. Així garantim accés universal al coneixement ESG acumulat.",
    es: "Todos los informes con más de 6 meses de antigüedad son gratis para siempre. Solo los informes recientes requieren Premium. Así garantizamos acceso universal al conocimiento ESG acumulado.",
  },

  // ============ Mètodes de pagament ============
  "preus.metodes.title": {
    ca: "Mètodes de pagament",
    es: "Métodos de pago",
  },
  "preus.metodes.eyebrow": {
    ca: "Tria també com vols pagar",
    es: "Elige también cómo quieres pagar",
  },
  "preus.metodes.stripe.title": {
    ca: "Targeta (Stripe)",
    es: "Tarjeta (Stripe)",
  },
  "preus.metodes.stripe.body": {
    ca: "Mensual o anual. Activació immediata. Mètode estàndard a internet.",
    es: "Mensual o anual. Activación inmediata. Método estándar en internet.",
  },
  "preus.metodes.stripe.cta": {
    ca: "Pagar amb targeta",
    es: "Pagar con tarjeta",
  },
  "preus.metodes.fiare.title": {
    ca: "Transferència (Fiare Banca Ètica)",
    es: "Transferencia (Fiare Banca Ética)",
  },
  "preus.metodes.fiare.body": {
    ca: "Només anual. Transferència manual amb comprovant. Activació immediata.",
    es: "Solo anual. Transferencia manual con comprobante. Activación inmediata.",
  },
  "preus.metodes.fiare.cta": {
    ca: "Pagar amb transferència",
    es: "Pagar con transferencia",
  },
  "preus.metodes.storytelling": {
    ca: "Si pagues amb targeta (Stripe), una corporació nord-americana es queda una comissió del nostre treball i els diners circulen pel sistema financer especulatiu. Si tries la transferència anual al nostre compte de Fiare Banca Ètica, el 100% dels teus diners dona suport a l'economia social i transformadora.",
    es: "Si pagas con tarjeta (Stripe), una corporación norteamericana se queda una comisión de nuestro trabajo y el dinero circula por el sistema financiero especulativo. Si eliges la transferencia anual a nuestra cuenta de Fiare Banca Ética, el 100% de tu dinero apoya la economía social y transformadora.",
  },

  // ============ Botó "Veure un exemple real" ============
  "format.exemple.cta": {
    ca: "Veure un exemple real",
    es: "Ver un ejemplo real",
  },
  "format.exemple.note": {
    ca: "Informe complet de la Revisió dels ESRS (Comissió Europea, maig 2026) amb els 8 blocs.",
    es: "Informe completo de la Revisión de los ESRS (Comisión Europea, mayo 2026) con los 8 bloques.",
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

  // ============ Criteris i valors (proposta Paolo, pendent de revisió) ============
  "quisom.valors.title": {
    ca: "Els nostres criteris i valors",
    es: "Nuestros criterios y valores",
  },
  "quisom.valors.intro": {
    ca: "No som neutres. Ens movem per uns criteris ètics concrets que apliquem a cada informe que processem. La nostra mirada be de la tradició de l'ètica empresarial i dels principis de l'economia social, que ens conviden a pensar l'empresa no només com a unitat productiva, sinó com a comunitat humana que genera valor per a tots els seus stakeholders.",
    es: "No somos neutrales. Nos movemos por unos criterios éticos concretos que aplicamos a cada informe que procesamos. Nuestra mirada viene de la tradición de la ética empresarial y de los principios de la economía social, que nos invitan a pensar la empresa no solo como unidad productiva, sino como comunidad humana que genera valor para todos sus stakeholders.",
  },
  "quisom.valors.etica.title": {
    ca: "Ètica empresarial",
    es: "Ética empresarial",
  },
  "quisom.valors.etica.body": {
    ca: "L'empresa ha de ser conseqüent amb els seus principis. No basta amb publicar codis de conducta; cal viure'ls. Avaluem si allò que es diu correspon amb allò que es fa.",
    es: "La empresa debe ser coherente con sus principios. No basta con publicar códigos de conducta; hay que vivirlos. Evaluamos si lo que se dice corresponde con lo que se hace.",
  },
  "quisom.valors.economia.title": {
    ca: "Economia social",
    es: "Economía social",
  },
  "quisom.valors.economia.body": {
    ca: "Defensem un model on les persones i el territori estan per sobre del capital. Cooperatives, empreses d'inserció, fundacions: models on la propietat i la gestió són democràtiques.",
    es: "Defendemos un modelo donde las personas y el territorio están por encima del capital. Cooperativas, empresas de inserción, fundaciones: modelos donde la propiedad y la gestión son democráticas.",
  },
  "quisom.valors.dignitat.title": {
    ca: "Dignitat al centre",
    es: "Dignidad en el centro",
  },
  "quisom.valors.dignitat.body": {
    ca: "La persona no és un recurs. És subjecte. Qüestionem els marcs ESG que mesuren la 'S' només amb mètriques demogràfiques i obvien el salari just, la salut mental, la participació real.",
    es: "La persona no es un recurso. Es sujeto. Cuestionamos los marcos ESG que miden la 'S' solo con métricas demográficas y obvian el salario justo, la salud mental, la participación real.",
  },
  "quisom.valors.territori.title": {
    ca: "Arrelament territorial",
    es: "Arraigo territorial",
  },
  "quisom.valors.territori.body": {
    ca: "L'empresa existeix en un lloc concret. Valorem l'impacte al territori —comunitat local, proveïdors propers, cadena de valor relacional— per sobre de les xifres globals agregades.",
    es: "La empresa existe en un lugar concreto. Valoramos el impacto en el territorio —comunidad local, proveedores cercanos, cadena de valor relacional— por encima de las cifras globales agregadas.",
  },

  // ============ Premium: Preguntes per millorar ============
  "quisom.preguntes.title": {
    ca: "Preguntes per millorar (Premium)",
    es: "Preguntas para mejorar (Premium)",
  },
  "quisom.preguntes.eyebrow": {
    ca: "Espai de reflexió ètica per a professionals",
    es: "Espacio de reflexión ética para profesionales",
  },
  "quisom.preguntes.body": {
    ca: "La filosofia és la disciplina que reflexiona sobre les qüestions fonamentals de la vida. Portada a l'empresa, ens convida a preguntar-nos per les qüestions fonamentals de tota organització: per què existim, a qui servim, què és legítim, què és just. A Criteri oferim als subscriptors Premium un espai per reflexionar-hi. No és una autoavaluació amb puntuació: és un espai per pensar en veu alta, amb preguntes ben fetes i context ètic, per ser millors professionals i millors organitzacions.",
    es: "La filosofía es la disciplina que reflexiona sobre las cuestiones fundamentales de la vida. Llevada a la empresa, nos invita a preguntarnos por las cuestiones fundamentales de toda organización: por qué existimos, a quién servimos, qué es legítimo, qué es justo. En Criteri ofrecemos a los suscriptores Premium un espacio para reflexionar. No es una autoevaluación con puntuación: es un espacio para pensar en voz alta, con preguntas bien hechas y contexto ético, para ser mejores profesionales y mejores organizaciones.",
  },
  "quisom.preguntes.example.title": {
    ca: "Exemple de pregunta",
    es: "Ejemplo de pregunta",
  },
  "quisom.preguntes.example.body": {
    ca: "«Si la teva empresa desaparegués demà, qui ho notaria de veritat —i per què? La resposta et diu més sobre el teu valor real que cap mètrica ESG.»",
    es: "«Si tu empresa desapareciera mañana, quién lo notaría de verdad —y por qué? La respuesta te dice más sobre tu valor real que cualquier métrica ESG.»",
  },
  "quisom.preguntes.cta": {
    ca: "Disponible per a subscriptors Premium",
    es: "Disponible para suscriptores Premium",
  },

  // ============ Pàgina /que-fem (Producte — com elaborem els informes) ============
  "quefem.eyebrow": {
    ca: "Què fem · Criteri ESG",
    es: "Qué hacemos · Criteri ESG",
  },
  "quefem.title": {
    ca: "De la font al criteri, en 5 minuts.",
    es: "De la fuente al criterio, en 5 minutos.",
  },
  "quefem.subtitle": {
    ca: "Cada informe que llegeixes a Criteri ESG passa per un procés rigorós de curació, síntesi i validació. Així és com ho fem.",
    es: "Cada informe que lees en Criteri ESG pasa por un proceso riguroso de curación, síntesis y validación. Así es como lo hacemos.",
  },

  "quefem.process.eyebrow": {
    ca: "EL PROCÉS",
    es: "EL PROCESO",
  },
  "quefem.process.title": {
    ca: "Cinc passos, de la font a la teva pantalla",
    es: "Cinco pasos, de la fuente a tu pantalla",
  },
  "quefem.process.body": {
    ca: "El procés és el mateix per a tots els informes, independentment de la font o el format. La consistència és el que ens permet comparar i decidir.",
    es: "El proceso es el mismo para todos los informes, independientemente de la fuente o el formato. La consistencia es lo que nos permite comparar y decidir.",
  },
  "quefem.process.step1.title": {
    ca: "1. Detecció automàtica",
    es: "1. Detección automática",
  },
  "quefem.process.step1.body": {
    ca: "Un agent d'IA monitoritza 180+ fonts institucionals (UE, OECD, BCE, EFRAG, EcoVadis, Banc d'Espanya, Forética, think tanks, acadèmics) via RSS i crawler. Dilluns i dijous al matí, el sistema ens presenta els nous informes detectats.",
    es: "Un agente de IA monitoriza 180+ fuentes institucionales (UE, OECD, BCE, EFRAG, EcoVadis, Banco de España, Forética, think tanks, académicos) vía RSS y crawler. Lunes y jueves por la mañana, el sistema nos presenta los nuevos informes detectados.",
  },
  "quefem.process.step2.title": {
    ca: "2. Curació humana",
    es: "2. Curación humana",
  },
  "quefem.process.step2.body": {
    ca: "Una persona revisa els informes detectats i decideix quins es processen. Criteri: rellevància pel director de sostenibilitat espanyol, impacte potencial, qualitat metodològica de la font. No tot el que es publica es processa; només allò que aporta valor per decidir.",
    es: "Una persona revisa los informes detectados y decidece cuáles se procesan. Criterio: relevancia para el director de sostenibilidad español, impacto potencial, calidad metodológica de la fuente. No todo lo que se publica se procesa; solo lo que aporta valor para decidir.",
  },
  "quefem.process.step3.title": {
    ca: "3. Síntesi en 8 blocs",
    es: "3. Síntesis en 8 bloques",
  },
  "quefem.process.step3.body": {
    ca: "L'agent d'IA processa cada informe seguint el nostre format de 8 blocs: Semàfor Metodològic + Fitxa tècnica + 5 dades clau + Resum executiu + Implicacions + Connexions + Accions recomanades + Cross-reference. Cada bloc té una longitud i un propòsit definits.",
    es: "El agente de IA procesa cada informe siguiendo nuestro formato de 8 bloques: Semáforo Metodológico + Ficha técnica + 5 datos clave + Resumen ejecutivo + Implicaciones + Conexiones + Acciones recomendadas + Cross-reference. Cada bloque tiene una longitud y un propósito definidos.",
  },
  "quefem.process.step4.title": {
    ca: "4. Validació editorial",
    es: "4. Validación editorial",
  },
  "quefem.process.step4.body": {
    ca: "Cap informe es publica sense revisió humana. Una persona valida el contingut, corregeix ortografia i to, comprova que les cites a pàgines siguin exactes i que la cross-reference amb EcoVadis/B Corp/MSCI/GRI tingui sentit. La responsabilitat editorial és sempre nostra, mai de la IA.",
    es: "Ningún informe se publica sin revisión humana. Una persona valida el contenido, corrige ortografía y tono, comprueba que las citas a páginas sean exactas y que la cross-reference con EcoVadis/B Corp/MSCI/GRI tenga sentido. La responsabilidad editorial es siempre nuestra, nunca de la IA.",
  },
  "quefem.process.step5.title": {
    ca: "5. Publicació immediata",
    es: "5. Publicación inmediata",
  },
  "quefem.process.step5.body": {
    ca: "L'informe es publica a la web el mateix dia amb els 8 blocs complets. No espera a la newsletter: els subscriptors Premium hi tenen accés immediat. La newsletter (quinzenal) recull els 3-4 millors del període + una connexió entre ells.",
    es: "El informe se publica en la web el mismo día con los 8 bloques completos. No espera a la newsletter: los suscriptores Premium tienen acceso inmediato. La newsletter (quincenal) recoge los 3-4 mejores del período + una conexión entre ellos.",
  },

  "quefem.format.eyebrow": {
    ca: "EL FORMAT",
    es: "EL FORMATO",
  },
  "quefem.format.title": {
    ca: "Vuit blocs, un mateix patró per a 1.000 informes",
    es: "Ocho bloques, un mismo patrón para 1.000 informes",
  },
  "quefem.format.body": {
    ca: "La consistència et permet saber què esperar. Cada informe segueix el mateix esquema perquè puguis comparar, prioritzar i decidir.",
    es: "La consistencia te permite saber qué esperar. Cada informe sigue el mismo esquema para que puedas comparar, priorizar y decidir.",
  },

  "quefem.valors.eyebrow": {
    ca: "CRITERIS I VALORS",
    es: "CRITERIOS Y VALORES",
  },
  "quefem.valors.title": {
    ca: "No som neutres. Ens movem per uns criteris ètics.",
    es: "No somos neutrales. Nos movemos por unos criterios éticos.",
  },
  "quefem.valors.intro": {
    ca: "La nostra mirada ve de la tradició de l'ètica empresarial i dels principis de l'economia social. Apliquem aquests criteris a cada informe que processem.",
    es: "Nuestra mirada viene de la tradición de la ética empresarial y de los principios de la economía social. Aplicamos estos criterios a cada informe que procesamos.",
  },

  "quefem.preguntes.eyebrow": {
    ca: "PREMIUM",
    es: "PREMIUM",
  },
  "quefem.preguntes.title": {
    ca: "Preguntes per millorar",
    es: "Preguntas para mejorar",
  },
  "quefem.preguntes.intro": {
    ca: "Un espai de reflexió ètica per a professionals. No és una autoavaluació amb puntuació: és un espai per pensar en veu alta, amb preguntes ben fetes i context ètic, per ser millors professionals i millors organitzacions.",
    es: "Un espacio de reflexión ética para profesionales. No es una autoevaluación con puntuación: es un espacio para pensar en voz alta, con preguntas bien hechas y contexto ético, para ser mejores profesionales y mejores organizaciones.",
  },

  "quefem.closing.eyebrow": {
    ca: "EL COMPROMÍS",
    es: "EL COMPROMISO",
  },
  "quefem.closing.body": {
    ca: "Si creus que les empreses poden ser agents de canvi —i que la tecnologia ha d'estar al servei del criteri humà—, som dels teus.",
    es: "Si crees que las empresas pueden ser agentes de cambio —y que la tecnología debe estar al servicio del criterio humano—, somos de los tuyos.",
  },

  // ============ Pàgina /qui-som (Empresa — equip humà) ============
  "quisom.page.eyebrow": {
    ca: "Qui som · Criteri ESG",
    es: "Quiénes somos · Criteri ESG",
  },
  "quisom.page.title": {
    ca: "Una empresa petita amb una missió clara.",
    es: "Una empresa pequeña con una misión clara.",
  },
  "quisom.page.subtitle": {
    ca: "Ajudem les organitzacions a ser més ètiques, sostenibles i transformadores. Aquesta és la gent que hi ha al darrere.",
    es: "Ayudamos a las organizaciones a ser más éticas, sostenibles y transformadoras. Esta es la gente que hay detrás.",
  },
  "quisom.manifest.page.eyebrow": {
    ca: "EL NOSTRE MANIFEST",
    es: "NUESTRO MANIFIESTO",
  },
  "quisom.manifest.page.body": {
    ca: "La sensibilitat i la preocupació pel món que ens envolta és el motor que ens fa moure. Volem ajudar i facilitar que les empreses, com a agents ciutadans que construeixen societat, siguin les més eficients, exemplars i transformadores possibles.",
    es: "La sensibilidad y la preocupación por el mundo que nos rodea es el motor que nos hace mover. Queremos ayudar y facilitar que las empresas, como agentes ciudadanos que construyen sociedad, sean las más eficientes, ejemplares y transformadoras posibles.",
  },
  "quisom.team.eyebrow": {
    ca: "L'EQUIP",
    es: "EL EQUIPO",
  },
  "quisom.team.title": {
    ca: "Qui som",
    es: "Quiénes somos",
  },
  "quisom.team.intro": {
    ca: "Som un equip petit i compromès. Cadascú aporta el que sap fer millor, i ens complementem per construir Criteri ESG dia a dia.",
    es: "Somos un equipo pequeño y comprometido. Cada uno aporta lo que sabe hacer mejor, y nos complementamos para construir Criteri ESG día a día.",
  },
  "quisom.team.paolo.role": {
    ca: "CEO · Estratègia i editorial",
    es: "CEO · Estrategia y editorial",
  },
  "quisom.team.paolo.bio": {
    ca: "Paolo és el fundador de Criteri ESG. Combina formació en filosofia i gestió d'empreses, amb experiència en consultoria ESG. Decideix quins informes es processen, signa la Carta del Director mensual i manté la coherència editorial del projecte. La seva mirada ètica és el que diferencia Criteri d'altres serveis ESG.",
    es: "Paolo es el fundador de Criteri ESG. Combina formación en filosofía y gestión de empresas, con experiencia en consultoría ESG. Decidece qué informes se procesan, firma la Carta del Director mensual y mantiene la coherencia editorial del proyecto. Su mirada ética es lo que diferencia a Criteri de otros servicios ESG.",
  },
  "quisom.team.techlead.role": {
    ca: "Tech Lead · Disseny i programació",
    es: "Tech Lead · Diseño y programación",
  },
  "quisom.team.techlead.bio": {
    ca: "El Tech Lead s'encarrega del desenvolupament web (Next.js), la base de dades (Supabase), les integracions tècniques (Stripe, Beehiiv, Google Drive) i el manteniment de l'agent d'IA. Treballa estretament amb Paolo perquè la tecnologia estigui sempre al servei del criteri humà, no al revés.",
    es: "El Tech Lead se encarga del desarrollo web (Next.js), la base de datos (Supabase), las integraciones técnicas (Stripe, Beehiiv, Google Drive) y el mantenimiento del agente de IA. Trabaja estrechamente con Paolo para que la tecnología esté siempre al servicio del criterio humano, no al revés.",
  },
  "quisom.team.zai.role": {
    ca: "Assistent d'IA · Recerca i síntesi",
    es: "Asistente de IA · Investigación y síntesis",
  },
  "quisom.team.zai.bio": {
    ca: "L'agent d'IA fa la feina pesada —detecció de fonts, síntesi en 8 blocs, classificació, corrector ortogràfic— sempre sota supervisió humana. No és un membre de l'equip en sentit estricte, però sense ella no podríem mantenir el ritme de publicació ni el cost per informe que tenim.",
    es: "El agente de IA hace el trabajo pesado —detección de fuentes, síntesis en 8 bloques, clasificación, corrector ortográfico— siempre bajo supervisión humana. No es un miembro del equipo en sentido estricto, pero sin ella no podríamos mantener el ritmo de publicación ni el coste por informe que tenemos.",
  },
  "quisom.team.join.title": {
    ca: "Vols formar-ne part?",
    es: "¿Quieres formar parte?",
  },
  "quisom.team.join.body": {
    ca: "Som una empresa oberta a persones que comparteixin els nostres criteris ètics i la nostra passió per fer la tecnologia al servei del bé comú. Si creus que encaixes, escriu-nos a info@criteriesg.com.",
    es: "Somos una empresa abierta a personas que compartan nuestros criterios éticos y nuestra pasión por poner la tecnología al servicio del bien común. Si crees que encajas, escríbenos a info@criteriesg.com.",
  },
  "quisom.page.closing.eyebrow": {
    ca: "EL COMPROMÍS",
    es: "EL COMPROMISO",
  },
  "quisom.page.closing.body": {
    ca: "Criteri ESG no és només una eina. És la convicció que les empreses poden ser agents de canvi —i que la tecnologia ha d'estar al servei del criteri humà.",
    es: "Criteri ESG no es solo una herramienta. Es la convicción de que las empresas pueden ser agentes de cambio —y que la tecnología debe estar al servicio del criterio humano.",
  },

  // ============ HOMEPAGE VARIANT 2 — MANIFEST EDITORIAL ============
  // (decisions editorials 14 + 17: llengua per defecte ES, eslògan "5 minuts")

  // --- HERO (dark) ---
  "v2.hero.eyebrow": {
    ca: "CRITERI ESG · SETEMBRE 2026",
    es: "CRITERI ESG · SEPTIEMBRE 2026",
  },
  "v2.hero.title.line1": {
    ca: "No és la informació.",
    es: "No es la información.",
  },
  "v2.hero.title.line2": {
    ca: "És el criteri.",
    es: "Es el criterio.",
  },
  "v2.hero.subtitle": {
    ca: "Una nova forma de llegir ESG. Sense soroll, sense pressa, sense greenwashing.",
    es: "Una nueva forma de leer ESG. Sin ruido, sin prisa, sin greenwashing.",
  },
  "v2.hero.cta.primary": {
    ca: "Prova gratuïta 7 dies",
    es: "Prueba gratis 7 días",
  },
  "v2.hero.cta.secondary": {
    ca: "Veure un informe real →",
    es: "Ver un informe real →",
  },

  // --- MANIFEST (cream) ---
  "v2.manifest.eyebrow": {
    ca: "EL QUE CREIEM",
    es: "LO QUE CREEMOS",
  },
  "v2.manifest.title.pre": {
    ca: "El problema de l'ESG no és ",
    es: "El problema del ESG no es ",
  },
  "v2.manifest.title.em": {
    ca: "la manca d'informació",
    es: "la falta de información",
  },
  "v2.manifest.title.post": {
    ca: ". És la manca de temps per processar-la i de criteri per decidir què importa.",
    es: ". Es la falta de tiempo para procesarla y de criterio para decidir qué importa.",
  },
  "v2.manifest.body": {
    ca: "Cada setmana surten 14 informes institucionals sobre sostenibilitat. Tots importants. Tots llargs. Ningú té temps. La solució no és més informació: és criteri.",
    es: "Cada semana salen 14 informes institucionales sobre sostenibilidad. Todos importantes. Todos largos. Nadie tiene tiempo. La solución no es más información: es criterio.",
  },

  // --- 3 TESES (cream) ---
  "v2.theses.eyebrow": {
    ca: "COM HO RESOLEM",
    es: "CÓMO LO RESOLVEMOS",
  },
  "v2.theses.title.pre": {
    ca: "Tres passos. ",
    es: "Tres pasos. ",
  },
  "v2.theses.title.em": {
    ca: "Res més.",
    es: "Nada más.",
  },
  "v2.theses.1.verb": { ca: "Sintetitzar", es: "Sintetizar" },
  "v2.theses.1.desc": {
    ca: "Els informes institucionals més rellevants, en 5 minuts de lectura. Amb semàfor metodològic propi de 5 dimensions.",
    es: "Los informes institucionales más relevantes, en 5 minutos de lectura. Con semáforo metodológico propio de 5 dimensiones.",
  },
  "v2.theses.2.verb": { ca: "Creuar", es: "Cruzar" },
  "v2.theses.2.desc": {
    ca: "Cada informe creuat amb les teves certificacions: EcoVadis, B Corp, MSCI, GRI, SGE 21, Sustainalytics. Et diem què t'afecta i amb quina intensitat.",
    es: "Cada informe cruzado con tus certificaciones: EcoVadis, B Corp, MSCI, GRI, SGE 21, Sustainalytics. Te decimos qué te afecta y con qué intensidad.",
  },
  "v2.theses.3.verb": { ca: "Recomanar", es: "Recomendar" },
  "v2.theses.3.desc": {
    ca: "Tres accions concretes per informe. Operatives. Verificables. El criteri aplicat a la teva decisió d'aquesta setmana.",
    es: "Tres acciones concretas por informe. Operativas. Verificables. El criterio aplicado a tu decisión de esta semana.",
  },

  // --- INFORME DESTACAT (dark, 8 blocs) ---
  "v2.ultim.eyebrow": {
    ca: "ÚLTIM INFORME PUBLICAT",
    es: "ÚLTIMO INFORME PUBLICADO",
  },
  "v2.ultim.title.pre": {
    ca: "Així es veu un ",
    es: "Así se ve un ",
  },
  "v2.ultim.title.em": {
    ca: "informe Criteri",
    es: "informe Criteri",
  },
  "v2.ultim.title.post": {
    ca: ". Els 8 blocs.",
    es: ". Los 8 bloques.",
  },

  // Fitxa tècnica (Bloc 1)
  "v2.informe.tag": {
    ca: "Regulació · Gratuït",
    es: "Regulación · Gratis",
  },
  "v2.informe.title": {
    ca: "Revisió dels ESRS: simplificació del CSRD",
    es: "Revisión de los ESRS: simplificación del CSRD",
  },
  "v2.informe.meta.line1": {
    ca: "Comissió Europea",
    es: "Comisión Europea",
  },
  "v2.informe.meta.line2": {
    ca: "6 maig 2026 · 47 pàg",
    es: "6 mayo 2026 · 47 pág",
  },
  "v2.informe.meta.line3": {
    ca: "ESRS Q&A Platform",
    es: "ESRS Q&A Platform",
  },

  // Bloc 0: Semàfor
  "v2.bloc0.label": {
    ca: "BLOC 0 · SEMÀFOR METODOLÒGIC",
    es: "BLOQUE 0 · SEMÁFORO METODOLÓGICO",
  },
  "v2.bloc0.grade": { ca: "C", es: "C" },
  "v2.bloc0.grade.label": {
    ca: "Dèbil",
    es: "Débil",
  },
  "v2.bloc0.dim1": { ca: "Scope 3", es: "Scope 3" },
  "v2.bloc0.dim2": { ca: "Terminis", es: "Plazos" },
  "v2.bloc0.dim3": { ca: "Fonts", es: "Fuentes" },
  "v2.bloc0.dim4": { ca: "Granularitat", es: "Granularidad" },
  "v2.bloc0.dim5": { ca: "Verificació", es: "Verificación" },

  // Bloc 2: 5 dades clau
  "v2.bloc2.label": {
    ca: "BLOC 2 · 5 DADES CLAU",
    es: "BLOQUE 2 · 5 DATOS CLAVE",
  },
  "v2.bloc2.title": {
    ca: "El que diu l'informe, en xifres",
    es: "Lo que dice el informe, en cifras",
  },
  "v2.bloc2.d1": {
    ca: "−61% de datapoints obligatoris del CSRD eliminats (de 1.144 a 446)",
    es: "−61% de datapoints obligatorios del CSRD eliminados (de 1.144 a 446)",
  },
  "v2.bloc2.d1.strong": { ca: "−61%", es: "−61%" },
  "v2.bloc2.d1.text": {
    ca: " de datapoints obligatoris del CSRD eliminats (de 1.144 a 446)",
    es: " de datapoints obligatorios del CSRD eliminados (de 1.144 a 446)",
  },
  "v2.bloc2.d2.strong": { ca: "3.700 M€", es: "3.700 M€" },
  "v2.bloc2.d2.text": {
    ca: " d'estalvi estimat per a empreses europees en 5 anys",
    es: " de ahorro estimado para empresas europeas en 5 años",
  },
  "v2.bloc2.d3.strong": { ca: "2 categories", es: "2 categorías" },
  "v2.bloc2.d3.text": {
    ca: " d'estàndards ESRS: temàtics transversals i sectorials",
    es: " de estándares ESRS: temáticos transversales y sectoriales",
  },
  "v2.bloc2.d4.strong": {
    ca: "Convergència",
    es: "Convergencia",
  },
  "v2.bloc2.d4.text": {
    ca: " mantinguda amb GRI Universal Standards i ISSB",
    es: " mantenida con GRI Universal Standards e ISSB",
  },
  "v2.bloc2.d5.strong": {
    ca: "Aplicació",
    es: "Aplicación",
  },
  "v2.bloc2.d5.text": {
    ca: " escalonada: grans empreses (2024), cotitzades (2025), PIMEs (2026-2028)",
    es: " escalonada: grandes empresas (2024), cotizadas (2025), PIMEs (2026-2028)",
  },

  // Bloc 3: Resum executiu
  "v2.bloc3.label": {
    ca: "BLOC 3 · RESUM EXECUTIU",
    es: "BLOQUE 3 · RESUMEN EJECUTIVO",
  },
  "v2.bloc3.title": {
    ca: "Què diu en llenguatge clar",
    es: "Qué dice en lenguaje claro",
  },
  "v2.bloc3.body1": {
    ca: "La Comissió Europea redueix un 61% els datapoints obligatoris del CSRD. Se simplifica l'arquitectura dels ESRS però es manté la convergència amb GRI i ISSB. L'estalvi estimat és de 3.700 M€ en 5 anys per a les empreses europees. L'aplicació s'escalonea per mida: grans empreses (2024), cotitzades (2025), PIMEs (2026-2028).",
    es: "La Comisión Europea reduce un 61% los datapoints obligatorios del CSRD. Se simplifica la arquitectura de los ESRS pero se mantiene la convergencia con GRI e ISSB. El ahorro estimado es de 3.700 M€ en 5 años para las empresas europeas. La aplicación se escalona por tamaño: grandes empresas (2024), cotizadas (2025), PIMEs (2026-2028).",
  },
  "v2.bloc3.body2": {
    ca: "La revisió respon a les queixes de l'Omnibus I sobre càrrega administrativa, però deixa fora el detall granular que moltes empreses necessiten per implementar.",
    es: "La revisión responde a las quejas del Omnibus I sobre carga administrativa, pero deja fuera el detalle granular que muchas empresas necesitan para implementar.",
  },
  "v2.bloc3.body3.em": {
    ca: "Més simple, però també més ambigu.",
    es: "Más simple, pero también más ambiguo.",
  },

  // Bloc 4: Implicacions
  "v2.bloc4.label": {
    ca: "BLOC 4 · IMPLICACIONS",
    es: "BLOQUE 4 · IMPLICACIONES",
  },
  "v2.bloc4.title": {
    ca: "Per a empreses, reguladors, ciutadans",
    es: "Para empresas, reguladores, ciudadanos",
  },
  "v2.bloc4.empresas.strong": { ca: "Empreses:", es: "Empresas:" },
  "v2.bloc4.empresas.text": {
    ca: " Menys reporting obligatori, però més interpretació subjectiva. Les empreses amb sistemes de reporting madurs (GRI, SASB) ho tenen més fàcil. Les que començaven des de zero perden la guia prescriptiva.",
    es: " Menos reporting obligatorio, pero más interpretación subjetiva. Las empresas con sistemas de reporting maduros (GRI, SASB) lo tienen más fácil. Las que empezaban desde cero pierden la guía prescriptiva.",
  },
  "v2.bloc4.reguladores.strong": { ca: "Reguladors:", es: "Reguladores:" },
  "v2.bloc4.reguladores.text": {
    ca: " BCE, ESMA i EFRAG hauran d'emetre guies interpretatives per evitar divergències entre estats membres. Risc de fragmentació.",
    es: " BCE, ESMA y EFRAG deberán emitir guías interpretativas para evitar divergencias entre estados miembros. Riesgo de fragmentación.",
  },
  "v2.bloc4.ciudadanos.strong": { ca: "Ciutadans:", es: "Ciudadanos:" },
  "v2.bloc4.ciudadanos.text": {
    ca: " Informes més curts i llegibles, però amb menys dada verificable. Perill de greenwashing augmentat per l'ambigüitat interpretativa.",
    es: " Informes más cortos y legibles, pero con menos dato verificable. Peligro de greenwashing aumentado por la ambigüedad interpretativa.",
  },
  "v2.bloc4.mes.label": {
    ca: "MÉS ENLLÀ DEL CHECKBOX",
    es: "MÁS ALLÁ DEL CHECKBOX",
  },
  "v2.bloc4.mes.text": {
    ca: "«La simplificació és un alleujament per al reporting, però què perd la societat quan desapareix la dada granular que permetia auditar promeses?»",
    es: "«La simplificación es un alivio para el reporting, pero ¿qué pierde la sociedad cuando desaparece el dato granular que permitía auditar promesas?»",
  },

  // Bloc 5: Connexions
  "v2.bloc5.label": {
    ca: "BLOC 5 · CONNEXIONS",
    es: "BLOQUE 5 · CONEXIONES",
  },
  "v2.bloc5.title": {
    ca: "Relacions amb altres informes i actualitat",
    es: "Relaciones con otros informes y actualidad",
  },
  "v2.bloc5.body.pre": {
    ca: "Aquesta revisió arriba ",
    es: "Esta revisión llega ",
  },
  "v2.bloc5.body.strong": {
    ca: "3 mesos després del CSDDD Omnibus I",
    es: "3 meses después del CSDDD Omnibus I",
  },
  "v2.bloc5.body.post": {
    ca: " (març 2026), que ja enduriaa la diligència en drets humans. La paradoxa: menys reporting estructurat per prendre més decisions operatives. El BCE inclourà el risc climàtic en els test d'estrès de la banca espanyola des del Q4 2026 — les dades que ja no es reportaran via ESRS sí que es necessitaran per als test d'estrès.",
    es: " (marzo 2026), que ya endurecía la diligencia en derechos humanos. La paradoja: menos reporting estructurado para tomar más decisiones operativas. El BCE incluirá el riesgo climático en los test de estrés de la banca española desde Q4 2026 — los datos que ya no se reportarán vía ESRS sí que se necesitarán para los test de estrés.",
  },

  // Bloc 6: Accions recomanades
  "v2.bloc6.label": {
    ca: "BLOC 6 · ACCIONS RECOMANADES ⭐",
    es: "BLOQUE 6 · ACCIONES RECOMENDADAS ⭐",
  },
  "v2.bloc6.title": {
    ca: "3 accions operatives per a aquesta setmana",
    es: "3 acciones operativas para esta semana",
  },
  "v2.bloc6.a1": {
    ca: "Auditar la matriu de materialitat vigent: quins datapoints eliminats et convé mantenir voluntàriament?",
    es: "Auditar la matriz de materialidad vigente: ¿qué datapoints eliminados te conviene mantener voluntariamente?",
  },
  "v2.bloc6.a2": {
    ca: "Renegociar el contracte d'assurance extern: l'abast es pot reduir, però el cost no sempre baixa proporcionalment.",
    es: "Renegociar el contrato de assurance externo: el alcance puede reducirse, pero el coste no siempre baja proporcionalmente.",
  },
  "v2.bloc6.a3": {
    ca: "Construir un dataset voluntari intern amb els datapoints eliminats però que els teus inversors o clients seguiran demanant (MSCI, Sustainalytics, EcoVadis).",
    es: "Construir un dataset voluntario interno con los datapoints eliminados pero que tus inversores o clientes seguirán pidiendo (MSCI, Sustainalytics, EcoVadis).",
  },

  // Bloc 7: Cross-reference
  "v2.bloc7.label": {
    ca: "BLOC 7 · CROSS-REFERENCE ⭐",
    es: "BLOQUE 7 · CROSS-REFERENCE ⭐",
  },
  "v2.bloc7.title": {
    ca: "Com t'afecta segons les teves certificacions",
    es: "Cómo te afecta según tus certificaciones",
  },
  "v2.bloc7.impact.alto": { ca: "Alt", es: "Alto" },
  "v2.bloc7.impact.medio": { ca: "Mitjà", es: "Medio" },
  "v2.bloc7.impact.bajo": { ca: "Baix", es: "Bajo" },

  // Footer informe
  "v2.informe.footer.text": {
    ca: "5 minuts de lectura. 8 blocs que canvien el teu criteri sobre un informe de 47 pàgines.",
    es: "5 minutos de lectura. 8 bloques que cambian tu criterio sobre un informe de 47 páginas.",
  },
  "v2.informe.footer.cta": {
    ca: "Més detalls en l'informe complet →",
    es: "Más detalles en el informe completo →",
  },

  // --- CITA ÈTICA (cream) ---
  "v2.cita.eyebrow": {
    ca: "MÉS ENLLÀ DEL CHECKBOX",
    es: "MÁS ALLÁ DEL CHECKBOX",
  },
  "v2.cita.text.pre": {
    ca: "Si la teva empresa ",
    es: "Si tu empresa ",
  },
  "v2.cita.text.em": {
    ca: "desaparegués demà",
    es: "desapareciera mañana",
  },
  "v2.cita.text.post": {
    ca: ", qui ho notaria de veritat —i per què?",
    es: ", ¿quién lo notaría de verdad —y por qué?",
  },
  "v2.cita.attribution": {
    ca: "— Pregunta de la quinzena · Criteri ESG",
    es: "— Pregunta de la quincena · Criteri ESG",
  },

  // --- CTA FINAL (dark) ---
  "v2.ctafinal.eyebrow": {
    ca: "SI REONEIXES AQUESTA SITUACIÓ",
    es: "SI RECONOCES ESTA SITUACIÓN",
  },
  "v2.ctafinal.title.pre": {
    ca: "Et ",
    es: "Te ",
  },
  "v2.ctafinal.title.em": {
    ca: "entenem",
    es: "entendemos",
  },
  "v2.ctafinal.title.post": {
    ca: ". Estem per retornar-te temps per pensar.",
    es: ". Estamos para devolverte tiempo para pensar.",
  },
  "v2.ctafinal.button": {
    ca: "Accés obert al setembre",
    es: "Acceso abierto en septiembre",
  },
  "v2.ctafinal.note": {
    ca: "Sense targeta de crèdit. Sense paywall fins al novembre.",
    es: "Sin tarjeta de crédito. Sin paywall hasta noviembre.",
  },

<<<<<<< Updated upstream
  // =========================================================================
  // FASE 2B — INFORME DETALL (Variant A: sidebar sticky)
  // =========================================================================

  // Breadcrumb
  "v2.detall.breadcrumb.biblioteca": { ca: "Biblioteca", es: "Biblioteca" },
  "v2.detall.breadcrumb.informes": { ca: "Informes", es: "Informes" },
  "v2.detall.breadcrumb.right": {
    ca: "5 min · 8 blocs",
    es: "5 min · 8 bloques",
  },

  // Sidebar
  "v2.detall.sidebar.index_label": {
    ca: "Índex de l'informe",
    es: "Índice del informe",
  },
  "v2.detall.sidebar.nav.0": { ca: "Semàfor metodològic", es: "Semáforo metodológico" },
  "v2.detall.sidebar.nav.1": { ca: "Fitxa tècnica", es: "Ficha técnica" },
  "v2.detall.sidebar.nav.2": { ca: "5 dades clau", es: "5 datos clave" },
  "v2.detall.sidebar.nav.3": { ca: "Resum executiu", es: "Resumen ejecutivo" },
  "v2.detall.sidebar.nav.4": { ca: "Implicacions", es: "Implicaciones" },
  "v2.detall.sidebar.nav.5": { ca: "Connexions", es: "Conexiones" },
  "v2.detall.sidebar.nav.6": { ca: "Accions recomanades", es: "Acciones recomendadas" },
  "v2.detall.sidebar.nav.7": { ca: "Cross-reference", es: "Cross-reference" },
  "v2.detall.sidebar.semafor.label": { ca: "Semàfor", es: "Semáforo" },
  "v2.detall.sidebar.semafor.grade": { ca: "C", es: "C" },
  "v2.detall.sidebar.semafor.label_text": { ca: "Dèbil", es: "Débil" },
  "v2.detall.sidebar.progress.label": { ca: "Lectura · 5 min", es: "Lectura · 5 min" },

  // Tags
  "v2.detall.tag.regulacio": { ca: "Regulació", es: "Regulación" },
  "v2.detall.tag.gratis": { ca: "Gratuït", es: "Gratis" },

  // Header informe (Bloc 1 fitxa tècnica)
  "v2.detall.title.pre": { ca: "Revisió dels ESRS:", es: "Revisión de los ESRS:" },
  "v2.detall.title.em": {
    ca: "simplificació del CSRD",
    es: "simplificación del CSRD",
  },
  "v2.detall.meta.comissio": { ca: "Comissió Europea", es: "Comisión Europea" },
  "v2.detall.meta.date": { ca: "6 maig 2026", es: "6 mayo 2026" },
  "v2.detall.meta.pages": { ca: "47 pàg", es: "47 pág" },
  "v2.detall.meta.platform": { ca: "ESRS Q&A Platform", es: "ESRS Q&A Platform" },

  // Bloc 0: Semàfor
  "v2.detall.bloc0.label": {
    ca: "BLOC 0 · SEMÀFOR METODOLÒGIC",
    es: "BLOQUE 0 · SEMÁFORO METODOLÓGICO",
  },
  "v2.detall.bloc0.grade": { ca: "C", es: "C" },
  "v2.detall.bloc0.grade_label": { ca: "Dèbil", es: "Débil" },
  "v2.detall.bloc0.desc": {
    ca: "Rigurós en arquitectura, però deixa fora el detall granular que les empreses necessiten per implementar.",
    es: "Riguroso en arquitectura, pero deja fuera el detalle granular que las empresas necesitan para implementar.",
  },
  "v2.detall.bloc0.dim1.status": { ca: "Dèbil", es: "Débil" },
  "v2.detall.bloc0.dim2.status": { ca: "Sòlid", es: "Sólido" },
  "v2.detall.bloc0.dim3.status": { ca: "Dèbil", es: "Débil" },
  "v2.detall.bloc0.dim4.status": { ca: "Crític", es: "Crítico" },
  "v2.detall.bloc0.dim5.status": { ca: "Dèbil", es: "Débil" },
  "v2.detall.bloc0.dim1.exp": {
    ca: "Esmenta el Scope 3 però no n'exigeix la quantificació: deixa a cada empresa decidir com el tracta. En sectors industrials on el Scope 3 supera el 80% de l'empremta, això equival a una invitació al buit.",
    es: "Menciona el Scope 3 pero no exige su cuantificación: deja a cada empresa decidir cómo lo trata. En sectores industriales donde el Scope 3 supera el 80% de la huella, esto equivale a una invitación al vacío.",
  },
  "v2.detall.bloc0.dim2.exp": {
    ca: "Calendari clar i operatiu: grans empreses des de l'exercici 2024, cotitzades des de 2025, PIMEs amb calendari escalonat 2026-2028. Cada empresa sap exactament quan li toca.",
    es: "Calendario claro y operativo: grandes empresas desde ejercicio 2024, cotizadas desde 2025, PIMEs con calendario escalonado 2026-2028. Cada empresa sabe exactamente cuándo le toca.",
  },
  "v2.detall.bloc0.dim3.exp": {
    ca: "Cada canvi normatiu cita l'ESRS original corresponent, però les interpretacions tècniques (Q&A) es publiquen a part a l'ESRS Q&A Platform. Per seguir el fil necessites creuar dos documents.",
    es: "Cada cambio normativo cita el ESRS original correspondiente, pero las interpretaciones técnicas (Q&A) se publican aparte en el ESRS Q&A Platform. Para seguir el hilo necesitas cruzar dos documentos.",
  },
  "v2.detall.bloc0.dim4.exp": {
    ca: "Tota la dada és agregada a nivell UE. No hi ha desagregació per sector, país ni mida d'empresa. Una PIME industrial espanyola no pot extreure conclusions operatives per al seu cas concret.",
    es: "Todo el dato es agregado a nivel UE. No hay desagregación por sector, país ni tamaño de empresa. Una PIME industrial española no puede extraer conclusiones operativas para su caso concreto.",
  },
  "v2.detall.bloc0.dim5.exp": {
    ca: "La revisió preveu assurance extern limitat des de 2024 i raonable des de 2028, però els criteris d'auditoria no es detallen. Cada estat membre pot interpretar l'abast de manera diferent.",
    es: "La revisión prevé assurance externo limitado desde 2024 y razonable desde 2028, pero los criterios de auditoría no se detallan. Cada estado miembro puede interpretar el alcance de manera diferente.",
  },

  // Bloc 2: 5 dades clau
  "v2.detall.bloc2.label": {
    ca: "BLOC 02 · 5 DADES CLAU",
    es: "BLOQUE 02 · 5 DATOS CLAVE",
  },
  "v2.detall.bloc2.title": {
    ca: "El que diu l'informe, en xifres",
    es: "Lo que dice el informe, en cifras",
  },
  "v2.detall.bloc2.d1.strong": { ca: "−61%", es: "−61%" },
  "v2.detall.bloc2.d1.text": {
    ca: " de datapoints obligatoris del CSRD eliminats (de 1.144 a 446)",
    es: " de datapoints obligatorios del CSRD eliminados (de 1.144 a 446)",
  },
  "v2.detall.bloc2.d2.strong": { ca: "3.700 M€", es: "3.700 M€" },
  "v2.detall.bloc2.d2.text": {
    ca: " d'estalvi estimat per a empreses europees en 5 anys",
    es: " de ahorro estimado para empresas europeas en 5 años",
  },
  "v2.detall.bloc2.d3.strong": { ca: "2 categories", es: "2 categorías" },
  "v2.detall.bloc2.d3.text": {
    ca: " d'estàndards ESRS: temàtics transversals i sectorials. Convergència mantinguda amb GRI Universal Standards i ISSB.",
    es: " de estándares ESRS: temáticos transversales y sectoriales. Convergencia mantenida con GRI Universal Standards e ISSB.",
  },
  "v2.detall.bloc2.d4.strong": { ca: "Aplicació", es: "Aplicación" },
  "v2.detall.bloc2.d4.text": {
    ca: " escalonada: grans empreses (2024), cotitzades (2025), PIMEs (2026-2028)",
    es: " escalonada: grandes empresas (2024), cotizadas (2025), PIMEs (2026-2028)",
  },

  // Bloc 3: Resum executiu
  "v2.detall.bloc3.label": {
    ca: "BLOC 03 · RESUM EXECUTIU",
    es: "BLOQUE 03 · RESUMEN EJECUTIVO",
  },
  "v2.detall.bloc3.title": {
    ca: "Què diu en",
    es: "Qué dice en",
  },
  "v2.detall.bloc3.title.em": {
    ca: "llenguatge clar",
    es: "lenguaje claro",
  },
  "v2.detall.bloc3.body1": {
    ca: "La Comissió Europea redueix un 61% els datapoints obligatoris del CSRD. Se simplifica l'arquitectura dels ESRS però es manté la convergència amb GRI i ISSB. L'estalvi estimat és de 3.700 M€ en 5 anys per a les empreses europees. L'aplicació s'escaloneja per mida: grans empreses (2024), cotitzades (2025), PIMEs (2026-2028).",
    es: "La Comisión Europea reduce un 61% los datapoints obligatorios del CSRD. Se simplifica la arquitectura de los ESRS pero se mantiene la convergencia con GRI e ISSB. El ahorro estimado es de 3.700 M€ en 5 años para las empresas europeas. La aplicación se escalona por tamaño: grandes empresas (2024), cotizadas (2025), PIMEs (2026-2028).",
  },
  "v2.detall.bloc3.body2": {
    ca: "La revisió respon a les queixes de l'Omnibus I sobre càrrega administrativa, però deixa fora el detall granular que moltes empreses necessiten per implementar.",
    es: "La revisión responde a las quejas del Omnibus I sobre carga administrativa, pero deja fuera el detalle granular que muchas empresas necesitan para implementar.",
  },
  "v2.detall.bloc3.body3.em": {
    ca: "Més simple, però també més ambigu.",
    es: "Más simple, pero también más ambiguo.",
  },

  // Bloc 4: Implicacions
  "v2.detall.bloc4.label": {
    ca: "BLOC 04 · IMPLICACIONS",
    es: "BLOQUE 04 · IMPLICACIONES",
  },
  "v2.detall.bloc4.title.pre": {
    ca: "Per a empreses, reguladors,",
    es: "Para empresas, reguladores,",
  },
  "v2.detall.bloc4.title.em": { ca: "ciutadans", es: "ciudadanos" },
  "v2.detall.bloc4.empresas.label": { ca: "Empreses", es: "Empresas" },
  "v2.detall.bloc4.empresas.text": {
    ca: "Menys reporting obligatori, però més interpretació subjectiva. Les empreses amb sistemes madurs (GRI, SASB) ho tenen més fàcil. Les que començaven des de zero perden la guia prescriptiva.",
    es: "Menos reporting obligatorio, pero más interpretación subjetiva. Las empresas con sistemas maduros (GRI, SASB) lo tienen más fácil. Las que empezaban desde cero pierden la guía prescriptiva.",
  },
  "v2.detall.bloc4.reguladors.label": { ca: "Reguladors", es: "Reguladores" },
  "v2.detall.bloc4.reguladors.text": {
    ca: "BCE, ESMA i EFRAG hauran d'emetre guies interpretatives per evitar divergències entre estats membres. Risc de fragmentació.",
    es: "BCE, ESMA y EFRAG deberán emitir guías interpretativas para evitar divergencias entre estados miembros. Riesgo de fragmentación.",
  },
  "v2.detall.bloc4.ciutadans.label": { ca: "Ciutadans", es: "Ciudadanos" },
  "v2.detall.bloc4.ciutadans.text": {
    ca: "Informes més curts i llegibles, però amb menys dada verificable. Perill de greenwashing augmentat per l'ambigüitat interpretativa.",
    es: "Informes más cortos y legibles, pero con menos dato verificable. Peligro de greenwashing aumentado por la ambigüedad interpretativa.",
  },
  "v2.detall.bloc4.mes.label": {
    ca: "MÉS ENLLÀ DEL CHECKBOX",
    es: "MÁS ALLÁ DEL CHECKBOX",
  },
  "v2.detall.bloc4.mes.question": {
    ca: "«La simplificació és un alleujament per al reporting, però",
    es: "«La simplificación es un alivio para el reporting, pero",
  },
  "v2.detall.bloc4.mes.question.em": {
    ca: "què perd la societat",
    es: "¿qué pierde la sociedad",
  },
  "v2.detall.bloc4.mes.question.post": {
    ca: " quan desapareix la dada granular que permetia auditar promeses?»",
    es: " cuando desaparece el dato granular que permitía auditar promesas?»",
  },
  "v2.detall.bloc4.mes.reflection": {
    ca: "Quan un informe es redueix a la meitat, algú decideix què es queda i què se'n va. Aquesta decisió no és tècnica: és política. I gairebé mai la pren el que després patirà les conseqüències. La pregunta no és si simplificar, sinó",
    es: "Cuando un informe se reduce a la mitad, alguien decide qué se queda y qué se va. Esa decisión no es técnica: es política. Y casi nunca la toma el que después sufrirá las consecuencias. La pregunta no es si simplificar, sino",
  },
  "v2.detall.bloc4.mes.reflection.em": {
    ca: "qui decideix què és prescindible",
    es: "quién decide qué es prescindible",
  },
  "v2.detall.bloc4.mes.reflection.post": { ca: ".", es: "." },

  // Bloc 5: Connexions
  "v2.detall.bloc5.label": {
    ca: "BLOC 05 · CONNEXIONS",
    es: "BLOQUE 05 · CONEXIONES",
  },
  "v2.detall.bloc5.title.pre": {
    ca: "Relacions amb altres",
    es: "Relaciones con otros",
  },
  "v2.detall.bloc5.title.em": {
    ca: "informes i actualitat",
    es: "informes y actualidad",
  },
  "v2.detall.bloc5.body.pre": {
    ca: "Aquesta revisió arriba ",
    es: "Esta revisión llega ",
  },
  "v2.detall.bloc5.body.strong": {
    ca: "3 mesos després del CSDDD Omnibus I",
    es: "3 meses después del CSDDD Omnibus I",
  },
  "v2.detall.bloc5.body.post": {
    ca: " (març 2026), que ja enduriaa la diligència en drets humans. La paradoxa: menys reporting estructurat per prendre més decisions operatives. El BCE inclourà el risc climàtic en els test d'estrès de la banca espanyola des del Q4 2026 — les dades que ja no es reportaran via ESRS sí que es necessitaran per als test d'estrès.",
    es: " (marzo 2026), que ya endurecía la diligencia en derechos humanos. La paradoja: menos reporting estructurado para tomar más decisiones operativas. El BCE incluirá el riesgo climático en los test de estrés de la banca española desde Q4 2026 — los datos que ya no se reportarán vía ESRS sí que se necesitarán para los test de estrés.",
  },

  // Bloc 6: Accions recomanades
  "v2.detall.bloc6.label": {
    ca: "BLOC 06 · ACCIONS RECOMANADES ⭐",
    es: "BLOQUE 06 · ACCIONES RECOMENDADAS ⭐",
  },
  "v2.detall.bloc6.title.pre": {
    ca: "3 accions operatives per a",
    es: "3 acciones operativas para",
  },
  "v2.detall.bloc6.title.em": {
    ca: "aquesta setmana",
    es: "esta semana",
  },
  "v2.detall.bloc6.a1": {
    ca: "Auditar la matriu de materialitat vigent: quins datapoints eliminats et convé mantenir voluntàriament?",
    es: "Auditar la matriz de materialidad vigente: ¿qué datapoints eliminados te conviene mantener voluntariamente?",
  },
  "v2.detall.bloc6.a2": {
    ca: "Renegociar el contracte d'assurance extern: l'abast es pot reduir, però el cost no sempre baixa proporcionalment.",
    es: "Renegociar el contrato de assurance externo: el alcance puede reducirse, pero el coste no siempre baja proporcionalmente.",
  },
  "v2.detall.bloc6.a3": {
    ca: "Construir un dataset voluntari intern amb els datapoints eliminats però que els teus inversors o clients seguiran demanant (MSCI, Sustainalytics, EcoVadis).",
    es: "Construir un dataset voluntario interno con los datapoints eliminados pero que tus inversores o clientes seguirán pidiendo (MSCI, Sustainalytics, EcoVadis).",
  },

  // Bloc 7: Cross-reference
  "v2.detall.bloc7.label": {
    ca: "BLOC 07 · CROSS-REFERENCE ⭐",
    es: "BLOQUE 07 · CROSS-REFERENCE ⭐",
  },
  "v2.detall.bloc7.title.pre": {
    ca: "Com t'afecta segons les teves",
    es: "Cómo te afecta según tus",
  },
  "v2.detall.bloc7.title.em": {
    ca: "certificacions",
    es: "certificaciones",
  },
  "v2.detall.bloc7.col.cert": { ca: "Certificació", es: "Certificación" },
  "v2.detall.bloc7.col.cat": { ca: "Categoria", es: "Categoría" },
  "v2.detall.bloc7.col.how": {
    ca: "Com t'afecta",
    es: "Cómo te afecta",
  },
  "v2.detall.bloc7.col.impact": { ca: "Impacte", es: "Impacto" },
  "v2.detall.bloc7.impact.high": { ca: "Alt", es: "Alto" },
  "v2.detall.bloc7.impact.med": { ca: "Mitjà", es: "Medio" },
  "v2.detall.bloc7.impact.low": { ca: "Baix", es: "Bajo" },
  "v2.detall.bloc7.row1.cert": { ca: "GRI", es: "GRI" },
  "v2.detall.bloc7.row1.cat": { ca: "Framework", es: "Framework" },
  "v2.detall.bloc7.row1.text": {
    ca: "Interoperabilitat ESRS-GRI reforçada en aquesta revisió. Les empreses que ja reporten amb GRI Universal Standards hi guanyen.",
    es: "Interoperabilidad ESRS-GRI reforzada en esta revisión. Las empresas que ya reportan con GRI Universal Standards ganan.",
  },
  "v2.detall.bloc7.row2.cert": { ca: "EcoVadis", es: "EcoVadis" },
  "v2.detall.bloc7.row2.cat": { ca: "Certificació", es: "Certificación" },
  "v2.detall.bloc7.row2.text": {
    ca: "La reducció del 61% en datapoints afecta el score de Sustainable Procurement. Les empreses amb GRI mantenen avantatge.",
    es: "La reducción del 61% en datapoints afecta al score de Sustainable Procurement. Las empresas con GRI mantienen ventaja.",
  },
  "v2.detall.bloc7.row3.cert": { ca: "MSCI ESG", es: "MSCI ESG" },
  "v2.detall.bloc7.row3.cat": { ca: "Rating", es: "Rating" },
  "v2.detall.bloc7.row3.text": {
    ca: "La convergència amb ISSB impacta en la metodologia de rating. Les empreses amb SBTi verificades mantenen score.",
    es: "La convergencia con ISSB impacta en la metodología de rating. Las empresas con SBTi verificadas mantienen score.",
  },
  "v2.detall.bloc7.row4.cert": { ca: "B Corp", es: "B Corp" },
  "v2.detall.bloc7.row4.cat": { ca: "Certificació", es: "Certificación" },
  "v2.detall.bloc7.row4.text": {
    ca: "La simplificació pot facilitar el procés de recertificació. El B Impact Assessment no es veu directament afectat.",
    es: "La simplificación puede facilitar el proceso de recertificación. El B Impact Assessment no se ve directamente afectado.",
  },
  "v2.detall.bloc7.row5.cert": { ca: "CDP", es: "CDP" },
  "v2.detall.bloc7.row5.cat": { ca: "Certificació", es: "Certificación" },
  "v2.detall.bloc7.row5.text": {
    ca: "Les dades climàtiques eliminades del CSRD poden seguir sent necessàries per al qüestionari CDP Climate Change.",
    es: "Los datos climáticos eliminados del CSRD pueden seguir siendo necesarios para el cuestionario CDP Climate Change.",
  },
  "v2.detall.bloc7.row6.cert": { ca: "SGE 21", es: "SGE 21" },
  "v2.detall.bloc7.row6.cat": { ca: "Certificació", es: "Certificación" },
  "v2.detall.bloc7.row6.text": {
    ca: "Alineada amb ISO 26000, no es veu afectada directament per la revisió ESRS.",
    es: "Alineada con ISO 26000, no se ve afectada directamente por la revisión ESRS.",
  },

  // Footer informe
  "v2.detall.footer.text": {
    ca: "5 minuts de lectura. 8 blocs que canvien el teu criteri sobre un informe de 47 pàgines.",
    es: "5 minutos de lectura. 8 bloques que cambian tu criterio sobre un informe de 47 páginas.",
  },
  "v2.detall.footer.prev": {
    ca: "← Informe anterior",
    es: "← Informe anterior",
  },
  "v2.detall.footer.next": {
    ca: "Següent informe →",
    es: "Siguiente informe →",
  },

  // =========================================================================
  // FASE 2C — BIBLIOTECA
  // =========================================================================
  "v2.biblioteca.eyebrow": {
    ca: "Biblioteca · Informes processats",
    es: "Biblioteca · Informes procesados",
  },
  "v2.biblioteca.title.pre": { ca: "Tots els", es: "Todos los" },
  "v2.biblioteca.title.em": {
    ca: "informes Criteri",
    es: "informes Criteri",
  },
  "v2.biblioteca.title.post": { ca: ".", es: "." },
  "v2.biblioteca.subtitle": {
    ca: "Filtrats per certificació, ordenats per rellevància. Cada informe amb semàfor metodològic, 8 blocs i cross-reference amb els teus estàndards.",
    es: "Filtrados por certificación, ordenados por relevancia. Cada informe con semáforo metodológico, 8 bloques y cross-reference con tus estándares.",
  },
  "v2.biblioteca.filter.label": {
    ca: "Filtrar per certificació:",
    es: "Filtrar por certificación:",
  },
  "v2.biblioteca.filter.tots": { ca: "Tots", es: "Todos" },
  "v2.biblioteca.sort.recent": {
    ca: "Ordre: Més recents primer",
    es: "Orden: Más recientes primero",
  },
  "v2.biblioteca.sort.best": {
    ca: "Ordre: Millor semàfor primer",
    es: "Orden: Mejor semáforo primero",
  },
  "v2.biblioteca.sort.impact": {
    ca: "Ordre: Major impacte primer",
    es: "Orden: Mayor impacto primero",
  },
  "v2.biblioteca.destacada.tag.ultim": {
    ca: "Últim publicat",
    es: "Último publicado",
  },
  "v2.biblioteca.destacada.cta": {
    ca: "Llegir informe complet →",
    es: "Leer informe completo →",
  },
  "v2.biblioteca.semafor.info": {
    ca: "Com funciona? →",
    es: "¿Cómo funciona? →",
  },
  "v2.biblioteca.semafor.footer": {
    ca: "«Rigurós en arquitectura, però deixa fora el detall granular.»",
    es: "«Riguroso en arquitectura, pero deja fuera el detalle granular.»",
  },
  "v2.biblioteca.card.semafor.label": {
    ca: "Sem.",
    es: "Sem.",
  },
  "v2.biblioteca.load_more": {
    ca: "Carregar més informes",
    es: "Cargar más informes",
  },
  "v2.biblioteca.count": {
    ca: "Mostrant 7 de 24 informes",
    es: "Mostrando 7 de 24 informes",
  },
  "v2.biblioteca.tag.rating": { ca: "Rating", es: "Rating" },
  "v2.biblioteca.tag.framework": { ca: "Framework", es: "Framework" },
  "v2.biblioteca.tag.regulacio": { ca: "Regulació", es: "Regulación" },
  "v2.biblioteca.tag.premium": { ca: "Premium", es: "Premium" },
  "v2.biblioteca.tag.ultim": {
    ca: "Últim publicat",
    es: "Último publicado",
  },
  "v2.biblioteca.xref.impact.high": { ca: "Alt", es: "Alto" },
  "v2.biblioteca.xref.impact.med": { ca: "Mitjà", es: "Medio" },
  "v2.biblioteca.xref.impact.low": { ca: "Baix", es: "Bajo" },

  // =========================================================================
  // FASE 2C — POPUP METODOLOGIA SEMÀFOR (GENÈRIC)
  // =========================================================================
  "v2.popup.eyebrow": {
    ca: "Metodologia · Semàfor Criteri ESG",
    es: "Metodología · Semáforo Criteri ESG",
  },
  "v2.popup.title.pre": { ca: "Com avaluem cada", es: "Cómo evaluamos cada" },
  "v2.popup.title.em": { ca: "informe", es: "informe" },
  "v2.popup.intro": {
    ca: "El semàfor no avalua si l'informe és bo o dolent. Avalua si és útil per prendre decisions operatives en una empresa concreta. Ho fa en 5 dimensions, cadascuna amb nota verda, groga o vermella. La nota final va de A (robust fort) a D (insuficient).",
    es: "El semáforo no evalúa si el informe es bueno o malo. Evalúa si es útil para tomar decisiones operativas en una empresa concreta. Lo hace en 5 dimensiones, cada una con nota verde, amarilla o roja. La nota final va de A (robusto fuerte) a D (insuficiente).",
  },
  "v2.popup.dim.1.name": { ca: "Scope 3", es: "Scope 3" },
  "v2.popup.dim.1.question": {
    ca: "Cobreix emissions indirectes?",
    es: "¿Cubre emisiones indirectas?",
  },
  "v2.popup.dim.1.exp": {
    ca: "En la majoria de sectors, el Scope 3 és entre el 70% i el 90% de l'empremta total. Un informe que l'ignora és tècnicament correcte però operativament inservible.",
    es: "En la mayoría de sectores, el Scope 3 es entre el 70% y el 90% de la huella total. Un informe que lo ignora es técnicamente correcto pero operativamente inservible.",
  },
  "v2.popup.dim.2.name": { ca: "Terminis", es: "Plazos" },
  "v2.popup.dim.2.question": {
    ca: "Les dates són operatives o aspiracionals?",
    es: "¿Las fechas son operativas o aspiracionales?",
  },
  "v2.popup.dim.2.exp": {
    ca: "Un director que planifica inversions per al 2027 no pot treballar amb «per al 2050». Exigim calendari amb anys concrets i fites intermèdies.",
    es: "Un director que planifica inversiones para 2027 no puede trabajar con «para 2050». Exigimos calendario con años concretos y hitos intermedios.",
  },
  "v2.popup.dim.3.name": { ca: "Fonts", es: "Fuentes" },
  "v2.popup.dim.3.question": {
    ca: "Estan referenciades o són afirmacions sense suport?",
    es: "¿Están referenciadas o son afirmaciones sin respaldo?",
  },
  "v2.popup.dim.3.exp": {
    ca: "El greenwashing viu de les afirmacions sense font. Cada afirmació de l'informe ha de portar referència verificable i accessible.",
    es: "El greenwashing vive de las afirmaciones sin fuente. Cada afirmación del informe debe llevar referencia verificable y accesible.",
  },
  "v2.popup.dim.4.name": { ca: "Granularitat", es: "Granularidad" },
  "v2.popup.dim.4.question": {
    ca: "Hi ha dada desagregada per sector / geografia / mida?",
    es: "¿Hay dato desagregado por sector / geografía / tamaño?",
  },
  "v2.popup.dim.4.exp": {
    ca: "Una dada agregada a nivell europeu no la pot fer servir una PIME industrial a Catalunya. La granularitat converteix un informe institucional en eina operativa.",
    es: "Un dato agregado a nivel europeo no lo puede usar una PIME industrial en Cataluña. La granularidad convierte un informe institucional en herramienta operativa.",
  },
  "v2.popup.dim.5.name": { ca: "Verificació", es: "Verificación" },
  "v2.popup.dim.5.question": {
    ca: "Està auditat externament o és auto-reportat?",
    es: "¿Está auditado externamente o es auto-reportado?",
  },
  "v2.popup.dim.5.exp": {
    ca: "L'auto-verificació no és necessàriament dolenta, però el director ha de saber si el que llegeix ha passat per un filtre independent o no.",
    es: "La auto-verificación no es necesariamente mala, pero el director debe saber si lo que lee ha pasado por un filtro independiente o no.",
  },
  "v2.popup.grade.a.label": {
    ca: "Robust fort",
    es: "Robusto fuerte",
  },
  "v2.popup.grade.a.desc": { ca: "5 verds", es: "5 verdes" },
  "v2.popup.grade.b.label": { ca: "Robust", es: "Robusto" },
  "v2.popup.grade.b.desc": {
    ca: "4 verds + 1 groga",
    es: "4 verdes + 1 amarilla",
  },
  "v2.popup.grade.c.label": { ca: "Dèbil", es: "Débil" },
  "v2.popup.grade.c.desc": {
    ca: "Mixta amb fins a 1 vermella",
    es: "Mezcla con hasta 1 roja",
  },
  "v2.popup.grade.d.label": { ca: "Insuficient", es: "Insuficiente" },
  "v2.popup.grade.d.desc": {
    ca: "2 o més vermelles",
    es: "2 o más rojas",
  },
  "v2.popup.footer.pre": {
    ca: "El semàfor no és un judici moral. És un judici operatiu.",
    es: "El semáforo no es un juicio moral. Es un juicio operativo.",
  },
  "v2.popup.footer.em": {
    ca: "Cada informe que publiquem porta el seu",
    es: "Cada informe que publicamos lleva el suyo",
  },

  // =========================================================================
  // FASE 2C — ESTÀNDARDS ESG
  // =========================================================================
  "v2.estandards.eyebrow": {
    ca: "Estàndards ESG · 2026",
    es: "Estándares ESG · 2026",
  },
  "v2.estandards.title.pre": { ca: "Els", es: "Los" },
  "v2.estandards.title.em": {
    ca: "16 estàndards",
    es: "16 estándares",
  },
  "v2.estandards.title.post": {
    ca: "que un director de sostenibilitat no hauria de confondre.",
    es: "que un director de sostenibilidad no debería confundir.",
  },
  "v2.estandards.concept.reg": {
    ca: "Una regulació t'obliga",
    es: "Una regulación te obliga",
  },
  "v2.estandards.concept.fw": {
    ca: "Un framework t'orienta",
    es: "Un framework te orienta",
  },
  "v2.estandards.concept.cert": {
    ca: "Una certificació t'avalua",
    es: "Una certificación te evalúa",
  },
  "v2.estandards.subtitle.line2": {
    ca: "Confondre-les té conseqüències operatives reals.",
    es: "Confundirlas tiene consecuencias operativas reales.",
  },
  "v2.estandards.legend.label": { ca: "Filtrar:", es: "Filtrar:" },
  "v2.estandards.legend.reg": {
    ca: "Regulacions (5)",
    es: "Regulaciones (5)",
  },
  "v2.estandards.legend.fw": {
    ca: "Frameworks (5)",
    es: "Frameworks (5)",
  },
  "v2.estandards.legend.cert": {
    ca: "Certificacions (6)",
    es: "Certificaciones (6)",
  },
  "v2.estandards.search.placeholder": {
    ca: "Cercar estàndard...",
    es: "Buscar estándar...",
  },
  "v2.estandards.access.free": { ca: "Gratuït", es: "Gratis" },
  "v2.estandards.access.premium": { ca: "Premium", es: "Premium" },
  "v2.estandards.card.count": {
    ca: "informes",
    es: "informes",
  },
  "v2.estandards.card.link": { ca: "Veure →", es: "Ver →" },
  "v2.estandards.tag.reg.ue": { ca: "Regulació · UE", es: "Regulación · UE" },
  "v2.estandards.tag.fw.global": {
    ca: "Framework · Global",
    es: "Framework · Global",
  },
  "v2.estandards.tag.cert": { ca: "Certificació", es: "Certificación" },
  "v2.estandards.tag.rating": { ca: "Rating", es: "Rating" },
<<<<<<< Updated upstream
=======

  // =========================================================================
  // FASE 2D — /que-fem + /qui-som + /cuenta
  // (decisions editorials 14 + 17: ES per defecte, "5 minuts" com a eslògan)
  // =========================================================================

  // --- /que-fem (Qué hacemos) ---
  "v2.quefem.hero.eyebrow": {
    ca: "Què fem · Criteri ESG",
    es: "Qué hacemos · Criteri ESG",
  },
  "v2.quefem.hero.title.pre": { ca: "Un ", es: "Un " },
  "v2.quefem.hero.title.em": {
    ca: "filtre amb criteri",
    es: "filtro con criterio",
  },
  "v2.quefem.hero.title.post": {
    ca: " per a decisions ètiques.",
    es: " para decisiones éticas.",
  },
  "v2.quefem.hero.subtitle": {
    ca: "Sintetitzem, creuem i recomanem. Tres passos sobre els informes institucionals que afecten la teva empresa. Res més.",
    es: "Sintetizamos, cruzamos y recomendamos. Tres pasos sobre los informes institucionales que afectan a tu empresa. Nada más.",
  },
  "v2.quefem.hero.meta.sources": {
    ca: "fonts monitoritzades",
    es: "fuentes monitorizadas",
  },
  "v2.quefem.hero.meta.standards": {
    ca: "estàndards creuats",
    es: "estándares cruzados",
  },
  "v2.quefem.hero.meta.reading": {
    ca: "minuts de lectura per informe",
    es: "minutos de lectura por informe",
  },

  "v2.quefem.process.eyebrow": { ca: "El procés", es: "El proceso" },
  "v2.quefem.process.title.pre": { ca: "Tres passos. ", es: "Tres pasos. " },
  "v2.quefem.process.title.em": { ca: "Res més.", es: "Nada más." },
  "v2.quefem.process.1.verb": { ca: "Sintetitzar", es: "Sintetizar" },
  "v2.quefem.process.1.desc": {
    ca: "Els informes institucionals més rellevants, en 5 minuts de lectura. Amb semàfor metodològic propi de 5 dimensions.",
    es: "Los informes institucionales más relevantes, en 5 minutos de lectura. Con semáforo metodológico propio de 5 dimensiones.",
  },
  "v2.quefem.process.2.verb": { ca: "Creuar", es: "Cruzar" },
  "v2.quefem.process.2.desc": {
    ca: "Cada informe creuat amb les teves certificacions: EcoVadis, B Corp, MSCI, GRI, SGE 21, Sustainalytics. Et diem què t'afecta i amb quina intensitat.",
    es: "Cada informe cruzado con tus certificaciones: EcoVadis, B Corp, MSCI, GRI, SGE 21, Sustainalytics. Te decimos qué te afecta y con qué intensidad.",
  },
  "v2.quefem.process.3.verb": { ca: "Recomanar", es: "Recomendar" },
  "v2.quefem.process.3.desc": {
=======
  // ===== /que-fem (Fase 2D) =====
  "quefem.hero.eyebrow": { ca: "Què fem · Criteri ESG", es: "Qué hacemos · Criteri ESG" },
  "quefem.hero.title.pre": { ca: "Un ", es: "Un " },
  "quefem.hero.title.em": { ca: "filtre amb criteri", es: "filtro con criterio" },
  "quefem.hero.title.post": { ca: " per a decisions ètiques.", es: " para decisiones éticas." },
  "quefem.hero.subtitle": {
    ca: "Sintetitzem, creuem i recomanem. Tres passos sobre els informes institucionals que afecten la teva empresa. Res més.",
    es: "Sintetizamos, cruzamos y recomendamos. Tres pasos sobre los informes institucionales que afectan a tu empresa. Nada más.",
  },
  "quefem.hero.meta.fuentes": { ca: "fonts monitoritzades", es: "fuentes monitorizadas" },
  "quefem.hero.meta.estandares": { ca: "estàndards creuats", es: "estándares cruzados" },
  "quefem.hero.meta.minutos": { ca: "minuts de lectura per informe", es: "minutos de lectura por informe" },

  "quefem.proceso.eyebrow": { ca: "El procés", es: "El proceso" },
  "quefem.proceso.title.pre": { ca: "Tres passos. ", es: "Tres pasos. " },
  "quefem.proceso.title.em": { ca: "Res més.", es: "Nada más." },
  "quefem.proceso.title.post": { ca: "", es: "" },
  "quefem.proceso.01.verb": { ca: "Sintetitzar", es: "Sintetizar" },
  "quefem.proceso.01.desc": {
    ca: "Els informes institucionals més rellevants, en 5 minuts de lectura. Amb semàfor metodològic propi de 5 dimensions.",
    es: "Los informes institucionales más relevantes, en 5 minutos de lectura. Con semáforo metodológico propio de 5 dimensiones.",
  },
  "quefem.proceso.02.verb": { ca: "Creuar", es: "Cruzar" },
  "quefem.proceso.02.desc": {
    ca: "Cada informe creuat amb les teves certificacions: EcoVadis, B Corp, MSCI, GRI, SGE 21, Sustainalytics. Et diem què t'afecta i amb quina intensitat.",
    es: "Cada informe cruzado con tus certificaciones: EcoVadis, B Corp, MSCI, GRI, SGE 21, Sustainalytics. Te decimos qué te afecta y con qué intensidad.",
  },
  "quefem.proceso.03.verb": { ca: "Recomanar", es: "Recomendar" },
  "quefem.proceso.03.desc": {
>>>>>>> Stashed changes
    ca: "Tres accions concretes per informe. Operatives. Verificables. El criteri aplicat a la teva decisió d'aquesta setmana.",
    es: "Tres acciones concretas por informe. Operativas. Verificables. El criterio aplicado a tu decisión de esta semana.",
  },

<<<<<<< Updated upstream
  "v2.quefem.semafor.tag": {
    ca: "Bloc 0 · Diferenciador principal",
    es: "Bloque 0 · Diferenciador principal",
  },
  "v2.quefem.semafor.title.pre": { ca: "El semàfor ", es: "El semáforo " },
  "v2.quefem.semafor.title.em": {
    ca: "metodològic",
    es: "metodológico",
  },
  "v2.quefem.semafor.title.post": { ca: ".", es: "." },
  "v2.quefem.semafor.desc": {
    ca: "No avaluem si un informe és bo o dolent. Avaluem si és útil per prendre decisions operatives en una empresa concreta. Cinc dimensions, una nota de A a D. Transparent.",
    es: "No evaluamos si un informe es bueno o malo. Evaluamos si es útil para tomar decisiones operativas en una empresa concreta. Cinco dimensiones, una nota de A a D. Transparente.",
  },
  "v2.quefem.semafor.cta": {
    ca: "Veure exemple real →",
    es: "Ver ejemplo real →",
  },
  "v2.quefem.semafor.dim1.name": { ca: "Scope 3", es: "Scope 3" },
  "v2.quefem.semafor.dim1.desc": {
    ca: "¿Cobreix emissions indirectes de la cadena de valor o només les directes?",
    es: "¿Cubre emisiones indirectas de la cadena de valor o solo las directas?",
  },
  "v2.quefem.semafor.dim2.name": { ca: "Terminis", es: "Plazos" },
  "v2.quefem.semafor.dim2.desc": {
    ca: "¿Les dates són operatives (amb calendari) o aspiracionals?",
    es: "¿Las fechas son operativas (con calendario) o aspiracionales?",
  },
  "v2.quefem.semafor.dim3.name": { ca: "Fonts", es: "Fuentes" },
  "v2.quefem.semafor.dim3.desc": {
    ca: "¿Les afirmacions estan referenciades o són sense suport?",
    es: "¿Las afirmaciones están referenciadas o son sin respaldo?",
  },
  "v2.quefem.semafor.dim4.name": { ca: "Granularitat", es: "Granularidad" },
  "v2.quefem.semafor.dim4.desc": {
    ca: "¿Hi ha dada desagregada per sector, geografia i mida?",
    es: "¿Hay dato desagregado por sector, geografía y tamaño?",
  },
  "v2.quefem.semafor.dim5.name": { ca: "Verificació", es: "Verificación" },
  "v2.quefem.semafor.dim5.desc": {
    ca: "¿Està auditat externament o és auto-reportat?",
    es: "¿Está auditado externamente o es auto-reportado?",
  },

  "v2.quefem.blocs.eyebrow": {
    ca: "Estructura de l'informe",
    es: "Estructura del informe",
  },
  "v2.quefem.blocs.title.pre": { ca: "Set blocs més. ", es: "Siete bloques más. " },
  "v2.quefem.blocs.title.em": {
    ca: "Vuit en total.",
    es: "Ocho en total.",
  },
  "v2.quefem.blocs.1.name": { ca: "Fitxa tècnica", es: "Ficha técnica" },
  "v2.quefem.blocs.1.desc": {
    ca: "Institució, data, tipus, pàgines, URL. 50 paraules per saber què estàs llegint.",
    es: "Institución, fecha, tipo, páginas, URL. 50 palabras para saber qué estás leyendo.",
  },
  "v2.quefem.blocs.1.meta": { ca: "50 paraules", es: "50 palabras" },
  "v2.quefem.blocs.2.name": { ca: "5 dades clau", es: "5 datos clave" },
  "v2.quefem.blocs.2.desc": {
    ca: "Els punts quantitatius amb valor, context i pàgina citada. El que es queda al cap.",
    es: "Los puntos cuantitativos con valor, contexto y página citada. Lo que se queda en la cabeza.",
  },
  "v2.quefem.blocs.2.meta": { ca: "5 dades", es: "5 datos" },
  "v2.quefem.blocs.3.name": { ca: "Resum executiu", es: "Resumen ejecutivo" },
  "v2.quefem.blocs.3.desc": {
    ca: "Què diu l'informe en llenguatge clar. 300 paraules per entendre el cor.",
    es: "Qué dice el informe en lenguaje claro. 300 palabras para entender el corazón.",
  },
  "v2.quefem.blocs.3.meta": { ca: "300 paraules", es: "300 palabras" },
  "v2.quefem.blocs.4.name": { ca: "Implicacions", es: "Implicaciones" },
  "v2.quefem.blocs.4.desc": {
    ca: "Per a empreses, reguladors i ciutadans. Amb subsecció 'Més enllà del Checkbox' (lent ètica).",
    es: "Para empresas, reguladores y ciudadanos. Con subsección 'Más allá del Checkbox' (lente ética).",
  },
  "v2.quefem.blocs.4.meta": {
    ca: "450-540 paraules + subsecció ètica",
    es: "450-540 palabras + subsección ética",
  },
  "v2.quefem.blocs.5.name": { ca: "Connexions", es: "Conexiones" },
  "v2.quefem.blocs.5.desc": {
    ca: "Relacions amb altres informes i actualitat. El context que falta.",
    es: "Relaciones con otros informes y actualidad. El contexto que falta.",
  },
  "v2.quefem.blocs.5.meta": { ca: "200-250 paraules", es: "200-250 palabras" },
  "v2.quefem.blocs.6.name": { ca: "Accions recomanades", es: "Acciones recomendadas" },
  "v2.quefem.blocs.6.desc": {
    ca: "3-5 accions concretes, operatives i verificables. El cor operatiu del producte.",
    es: "3-5 acciones concretas, operativas y verificables. El corazón operativo del producto.",
  },
  "v2.quefem.blocs.6.meta": {
    ca: "3-5 accions · Bloc diferenciador",
    es: "3-5 acciones · Bloque diferenciador",
  },
  "v2.quefem.blocs.7.name": { ca: "Cross-reference", es: "Cross-reference" },
  "v2.quefem.blocs.7.desc": {
    ca: "Mapa amb EcoVadis, B Corp, MSCI, GRI, SGE 21, Sustainalytics i altres. La dada sense el teu context és soroll. La dada amb el teu context és decisió.",
    es: "Mapa con EcoVadis, B Corp, MSCI, GRI, SGE 21, Sustainalytics y otros. El dato sin tu contexto es ruido. El dato con tu contexto es decisión.",
  },
  "v2.quefem.blocs.7.meta": {
    ca: "Per a les teves certificacions · Bloc diferenciador",
    es: "Para tus certificaciones · Bloque diferenciador",
  },

  "v2.quefem.valors.eyebrow": {
    ca: "Criteris i valors",
    es: "Criterios y valores",
  },
  "v2.quefem.valors.title.pre": {
    ca: "El que guia ",
    es: "Lo que guía ",
  },
  "v2.quefem.valors.title.em": {
    ca: "cada decisió",
    es: "cada decisión",
  },
  "v2.quefem.valors.1.num": { ca: "01 · Honestedat", es: "01 · Honestidad" },
  "v2.quefem.valors.1.pre": {
    ca: "Si no sabem alguna cosa, ho diem. Si una font no és fiable, ho senyalitzem. ",
    es: "Si no sabemos algo, lo decimos. Si una fuente no es fiable, lo señalamos. ",
  },
  "v2.quefem.valors.1.em": {
    ca: "Mai inventem dades.",
    es: "Nunca inventamos datos.",
  },
  "v2.quefem.valors.2.num": { ca: "02 · Criteri", es: "02 · Criterio" },
  "v2.quefem.valors.2.pre": {
    ca: "Tot el que fem està fet amb solidesa, amb fonts verificades. ",
    es: "Todo lo que hacemos está hecho con solidez, con fuentes verificadas. ",
  },
  "v2.quefem.valors.2.em": {
    ca: "Donem exemple de criteri.",
    es: "Damos ejemplo de criterio.",
  },
  "v2.quefem.valors.3.num": { ca: "03 · Ètica", es: "03 · Ética" },
  "v2.quefem.valors.3.pre": {
    ca: "Apliquem el principi kantià i el del bé comú en cada anàlisi. ",
    es: "Aplicamos el principio kantiano y el del bien común en cada análisis. ",
  },
  "v2.quefem.valors.3.em": {
    ca: "L'ètica és fonamental.",
    es: "La ética es fundamental.",
  },
  "v2.quefem.valors.4.num": { ca: "04 · Transparència", es: "04 · Transparencia" },
  "v2.quefem.valors.4.pre": {
    ca: "Cada afirmació porta la seva font. Cada nota del semàfor, la seva justificació. ",
    es: "Cada afirmación lleva su fuente. Cada nota del semáforo, su justificación. ",
  },
  "v2.quefem.valors.4.em": {
    ca: "El greenwashing no passa aquí.",
    es: "El greenwashing no pasa aquí.",
  },
  "v2.quefem.valors.5.num": { ca: "05 · Humilitat", es: "05 · Humildad" },
  "v2.quefem.valors.5.pre": {
    ca: "No som la solució final. Som una eina al servei del director de sostenibilitat. ",
    es: "No somos la solución final. Somos una herramienta al servicio del director de sostenibilidad. ",
  },
  "v2.quefem.valors.5.em": {
    ca: "Tu decides; nosaltres filtrem.",
    es: "Tú decides; nosotros filtramos.",
  },
  "v2.quefem.valors.6.num": {
    ca: "06 · Sostenibilitat absoluta",
    es: "06 · Sostenibilidad absoluta",
  },
  "v2.quefem.valors.6.pre": {
    ca: "Els límits planetaris són físics, no comunicatius. ",
    es: "Los límites planetarios son físicos, no comunicativos. ",
  },
  "v2.quefem.valors.6.em": {
    ca: "No admetem interpretacions.",
    es: "No admitimos interpretaciones.",
  },

  "v2.quefem.manifest.eyebrow": {
    ca: "Més enllà del Checkbox",
    es: "Más allá del Checkbox",
  },
  "v2.quefem.manifest.text.pre": {
    ca: "La sostenibilitat no es mesura per la quantitat de formularis complimentats, ",
    es: "La sostenibilidad no se mide por la cantidad de formularios cumplimentados, ",
  },
  "v2.quefem.manifest.text.em": {
    ca: "sinó per la traçabilitat de les promeses",
    es: "sino por la trazabilidad de las promesas",
  },
  "v2.quefem.manifest.text.post": { ca: ".", es: "." },
  "v2.quefem.manifest.attribution": {
    ca: "— Manifest Criteri ESG",
    es: "— Manifest Criteri ESG",
  },

  // --- /qui-som (Quiénes somos) ---
  "v2.quisom.hero.eyebrow": {
    ca: "Qui som · 2026",
    es: "Quiénes somos · 2026",
  },
  "v2.quisom.hero.title.pre": {
    ca: "Ajudem les organitzacions a ser ",
    es: "Ayudamos a las organizaciones a ser ",
  },
  "v2.quisom.hero.title.em": {
    ca: "més ètiques, sostenibles i transformadores",
    es: "más éticas, sostenibles y transformadoras",
  },
  "v2.quisom.hero.title.post": { ca: ".", es: "." },
  "v2.quisom.hero.subtitle": {
    ca: "Aquesta és la gent que hi ha al darrere. Un equip petit que creu que les empreses poden ser agents de canvi —i que la tecnologia ha d'estar al servei del criteri humà.",
    es: "Esta es la gente que hay detrás. Un equipo pequeño que cree que las empresas pueden ser agentes de cambio —y que la tecnología debe estar al servicio del criterio humano.",
  },

  "v2.quisom.manifest.eyebrow": {
    ca: "Manifest",
    es: "Manifest",
  },

  "v2.quisom.equip.eyebrow": { ca: "L'equip", es: "El equipo" },
  "v2.quisom.equip.title.pre": {
    ca: "Combinem el millor de la IA amb la ",
    es: "Combinamos lo mejor de la IA con la ",
  },
  "v2.quisom.equip.title.em": {
    ca: "mirada ètica humana",
    es: "mirada ética humana",
  },
  "v2.quisom.equip.title.post": { ca: ".", es: "." },
  "v2.quisom.equip.intro": {
    ca: "Hem construït un sistema que combina el millor de la intel·ligència artificial amb la mirada ètica de persones que coneixen el sector ESG. La IA fa la feina pesada — investigació, síntesi, classificació. Les persones aportem criteri, context i judici.",
    es: "Hemos construido un sistema que combina lo mejor de la inteligencia artificial con la mirada ética de personas que conocen el sector ESG. La IA hace el trabajo pesado — investigación, síntesis, clasificación. Las personas aportamos criterio, contexto y juicio.",
  },

  "v2.quisom.member.1.role": {
    ca: "CEO · Estratègia i editorial",
    es: "CEO · Estrategia y editorial",
  },
  "v2.quisom.member.1.name": { ca: "Fundador", es: "Fundador" },
  "v2.quisom.member.1.tag": {
    ca: "Filosofia + ESG · Barcelona",
    es: "Filosofía + ESG · Barcelona",
  },
  "v2.quisom.member.2.role": {
    ca: "Tech Lead · Disseny i programació",
    es: "Tech Lead · Diseño y programación",
  },
  "v2.quisom.member.2.name": { ca: "Tech Lead", es: "Tech Lead" },
  "v2.quisom.member.2.tag": {
    ca: "Full-stack · Barcelona",
    es: "Full-stack · Barcelona",
  },
  "v2.quisom.member.3.role": {
    ca: "Assistent d'IA · Recerca i síntesi",
    es: "Asistente de IA · Investigación y síntesis",
  },
  "v2.quisom.member.3.name": {
    ca: "Agent d'IA",
    es: "Agente de IA",
  },
  "v2.quisom.member.3.tag": {
    ca: "IA · Supervisada per humà",
    es: "IA · Supervisada por humano",
  },

  "v2.quisom.conviccions.eyebrow": {
    ca: "El que creiem",
    es: "Lo que creemos",
  },
  "v2.quisom.conviccions.title.pre": {
    ca: "Cinc conviccions que ",
    es: "Cinco convicciones que ",
  },
  "v2.quisom.conviccions.title.em": {
    ca: "sostenen tot",
    es: "sostienen todo",
  },
  "v2.quisom.conviccions.title.post": { ca: ".", es: "." },
  "v2.quisom.conviccions.1.num": { ca: "01 · Dignitat", es: "01 · Dignidad" },
  "v2.quisom.conviccions.1.pre": { ca: "La ", es: "La " },
  "v2.quisom.conviccions.1.em": {
    ca: "dignitat humana",
    es: "dignidad humana",
  },
  "v2.quisom.conviccions.1.post": {
    ca: " no és negociable. Cap mètrica ESG pot justificar un deteriorament de les condicions de treball.",
    es: " no es negociable. Ninguna métrica ESG puede justificar un deterioro de las condiciones de trabajo.",
  },
  "v2.quisom.conviccions.2.num": { ca: "02 · Justícia", es: "02 · Justicia" },
  "v2.quisom.conviccions.2.pre": { ca: "La ", es: "La " },
  "v2.quisom.conviccions.2.em": {
    ca: "justícia distributiva",
    es: "justicia distributiva",
  },
  "v2.quisom.conviccions.2.post": {
    ca: " importa. El valor creat s'ha de repartir entre qui el generen, no només entre accionistes.",
    es: " importa. El valor creado debe repartirse entre quienes lo generan, no solo entre accionistas.",
  },
  "v2.quisom.conviccions.3.num": {
    ca: "03 · Sostenibilitat",
    es: "03 · Sostenibilidad",
  },
  "v2.quisom.conviccions.3.pre": { ca: "La ", es: "La " },
  "v2.quisom.conviccions.3.em": {
    ca: "sostenibilitat absoluta",
    es: "sostenibilidad absoluta",
  },
  "v2.quisom.conviccions.3.post": {
    ca: " no admet interpretacions. Els límits planetaris són físics, no comunicatius.",
    es: " no admite interpretaciones. Los límites planetarios son físicos, no comunicativos.",
  },
  "v2.quisom.conviccions.4.num": { ca: "04 · Democràcia", es: "04 · Democracia" },
  "v2.quisom.conviccions.4.pre": { ca: "La ", es: "La " },
  "v2.quisom.conviccions.4.em": {
    ca: "co-decisió democràtica",
    es: "co-decisión democrática",
  },
  "v2.quisom.conviccions.4.post": {
    ca: " és un deure. Qui afecta les decisions ha de tenir veu en elles.",
    es: " es un deber. Quienes afectan las decisiones deben tener voz en ellas.",
  },
  "v2.quisom.conviccions.5.num": { ca: "05 · Territori", es: "05 · Territorio" },
  "v2.quisom.conviccions.5.pre": { ca: "L'", es: "El " },
  "v2.quisom.conviccions.5.em": {
    ca: "arrelament territorial",
    es: "arraigo territorial",
  },
  "v2.quisom.conviccions.5.post": {
    ca: " compta. Una empresa que no deixa buit quan desapareix no crea valor real.",
    es: " cuenta. Una empresa que no deja vacío cuando desaparece no crea valor real.",
  },

  "v2.quisom.closing.eyebrow": { ca: "Criteri ESG", es: "Criteri ESG" },
  "v2.quisom.closing.text.pre": {
    ca: "No és només una eina. És la convicció que les empreses poden ser ",
    es: "No es solo una herramienta. Es la convicción de que las empresas pueden ser ",
  },
  "v2.quisom.closing.text.em": {
    ca: "agents de canvi",
    es: "agentes de cambio",
  },
  "v2.quisom.closing.text.post": {
    ca: " —i que la tecnologia ha d'estar al servei del criteri humà.",
    es: " —y que la tecnología debe estar al servicio del criterio humano.",
  },
  "v2.quisom.closing.button": {
    ca: "Prova gratuïta 7 dies",
    es: "Prueba gratis 7 días",
  },

  // --- /cuenta (Mi cuenta) ---
  "v2.cuenta.page.title": { ca: "El meu compte", es: "Mi cuenta" },
  "v2.cuenta.page.subtitle": {
    ca: "Les teves preferències i les teves certificacions en un sol lloc.",
    es: "Tus preferencias y tus certificaciones en un solo lugar.",
  },
  "v2.cuenta.brand": { ca: "Criteri ESG", es: "Criteri ESG" },
  "v2.cuenta.user.default": { ca: "Usuari", es: "Usuario" },
  "v2.cuenta.plan.free": { ca: "Pla Free", es: "Plan Free" },
  "v2.cuenta.plan.premium": { ca: "Pla Premium", es: "Plan Premium" },

  "v2.cuenta.nav.perfil": { ca: "Perfil", es: "Perfil" },
  "v2.cuenta.nav.newsletter": { ca: "Newsletter", es: "Newsletter" },
  "v2.cuenta.nav.pla": { ca: "El meu pla", es: "Mi plan" },
  "v2.cuenta.nav.estandards": {
    ca: "Els meus estàndards ESG",
    es: "Mis estándares ESG",
  },
  "v2.cuenta.nav.interessos": {
    ca: "Altres interessos",
    es: "Otros intereses",
  },
  "v2.cuenta.nav.billing": { ca: "Billing", es: "Billing" },
  "v2.cuenta.nav.logout": {
    ca: "← Tancar sessió",
    es: "← Cerrar sesión",
  },

  "v2.cuenta.card.perfil.title": { ca: "Perfil", es: "Perfil" },
  "v2.cuenta.card.newsletter.title": { ca: "Newsletter", es: "Newsletter" },
  "v2.cuenta.card.pla.title": { ca: "El meu pla", es: "Mi plan" },
  "v2.cuenta.card.estandards.title": {
    ca: "Els meus estàndards ESG",
    es: "Mis estándares ESG",
  },
  "v2.cuenta.card.interessos.title": {
    ca: "Altres interessos",
    es: "Otros intereses",
  },

  "v2.cuenta.perfil.name": { ca: "Nom", es: "Nombre" },
  "v2.cuenta.perfil.email": { ca: "Email", es: "Email" },
  "v2.cuenta.perfil.empresa": { ca: "Empresa", es: "Empresa" },
  "v2.cuenta.perfil.empresa.placeholder": {
    ca: "Nom de la teva empresa",
    es: "Nombre de tu empresa",
  },
  "v2.cuenta.perfil.sector": {
    ca: "Sector professional",
    es: "Sector profesional",
  },
  "v2.cuenta.perfil.sector.default": {
    ca: "Director de sostenibilitat",
    es: "Director de sostenibilidad",
  },

  "v2.cuenta.newsletter.lang.label": {
    ca: "Idioma de la newsletter",
    es: "Idioma de la newsletter",
  },
  "v2.cuenta.newsletter.desc": {
    ca: "Rep la newsletter bimensual (cada 2 setmanes, els dijous a les 15:00h). Pots canviar l'idioma en qualsevol moment.",
    es: "Recibes la newsletter bimensual (cada 2 semanas, los jueves a las 15:00h). Puedes cambiar el idioma en cualquier momento.",
  },

  "v2.cuenta.pla.free.name": { ca: "Pla Free", es: "Plan Free" },
  "v2.cuenta.pla.free.price": {
    ca: "0€/mes · Accés a informes antics + newsletter reduïda",
    es: "0€/mes · Acceso a informes antiguos + newsletter reducida",
  },
  "v2.cuenta.pla.cta": {
    ca: "Fes-te Premium →",
    es: "Hazte Premium →",
  },
  "v2.cuenta.pla.desc": {
    ca: "Amb Premium accedeixes a tots els informes recents (últims 6 mesos), cross-reference complet amb les teves certificacions, accions recomanades i la newsletter completa. 29€/mes per als primers 50 subscriptors (early bird fins a novembre).",
    es: "Con Premium accedes a todos los informes recientes (últimos 6 meses), cross-reference completo con tus certificaciones, acciones recomendadas y la newsletter completa. 29€/mes para los primeros 50 suscriptores (early bird hasta noviembre).",
  },

  "v2.cuenta.estandards.desc": {
    ca: "Selecciona els estàndards que ja té la teva empresa. Et recomanarem informes que t'afecten directament.",
    es: "Selecciona los estándares que ya tiene tu empresa. Te recomendaremos informes que te afectan directamente.",
  },
  "v2.cuenta.estandards.legend.reg": {
    ca: "Regulacions (5)",
    es: "Regulaciones (5)",
  },
  "v2.cuenta.estandards.legend.fw": {
    ca: "Frameworks (5)",
    es: "Frameworks (5)",
  },
  "v2.cuenta.estandards.legend.cert": {
    ca: "Certificacions (6)",
    es: "Certificaciones (6)",
  },

  "v2.cuenta.interessos.desc": {
    ca: "Altres temes que t'interessen. Els usem per millorar les recomanacions de la newsletter.",
    es: "Otros temas que te interesan. Los usamos para mejorar las recomendaciones de la newsletter.",
  },
>>>>>>> Stashed changes
=======
  "quefem.semaforo.eyebrow": { ca: "Bloc 0 · Diferenciador principal", es: "Bloque 0 · Diferenciador principal" },
  "quefem.semaforo.title.pre": { ca: "El semàfor ", es: "El semáforo " },
  "quefem.semaforo.title.em": { ca: "metodològic", es: "metodológico" },
  "quefem.semaforo.title.post": { ca: ".", es: "." },
  "quefem.semaforo.desc": {
    ca: "No avaluem si un informe és bo o dolent. Avaluem si és útil per prendre decisions operatives en una empresa concreta. Cinc dimensions, una nota d'A a D. Transparent.",
    es: "No evaluamos si un informe es bueno o malo. Evaluamos si es útil para tomar decisiones operativas en una empresa concreta. Cinco dimensiones, una nota de A a D. Transparente.",
  },
  "quefem.semaforo.scope3": { ca: "¿Cobreix emissions indirectes de la cadena de valor o només les directes?", es: "¿Cubre emisiones indirectas de la cadena de valor o solo las directas?" },
  "quefem.semaforo.plazos": { ca: "¿Les dates són operatives (amb calendari) o aspiracionals?", es: "¿Las fechas son operativas (con calendario) o aspiracionales?" },
  "quefem.semaforo.fuentes": { ca: "¿Les afirmacions estan referenciades o són sense suport?", es: "¿Las afirmaciones están referenciadas o son sin respaldo?" },
  "quefem.semaforo.granularidad": { ca: "¿Hi ha dada desagregada per sector, geografia i mida?", es: "¿Hay dato desagregado por sector, geografía y tamaño?" },
  "quefem.semaforo.verificacion": { ca: "¿Està auditat externament o és auto-reportat?", es: "¿Está auditado externamente o es auto-reportado?" },

  "quefem.estructura.eyebrow": { ca: "Estructura de l'informe", es: "Estructura del informe" },
  "quefem.estructura.title.pre": { ca: "Set blocs més. ", es: "Siete bloques más. " },
  "quefem.estructura.title.em": { ca: "Vuit en total.", es: "Ocho en total." },
  "quefem.estructura.title.post": { ca: "", es: "" },
  "quefem.bloc.01.name": { ca: "Fitxa tècnica", es: "Ficha técnica" },
  "quefem.bloc.01.desc": { ca: "Institució, data, tipus, pàgines, URL. 50 paraules per saber què estàs llegint.", es: "Institución, fecha, tipo, páginas, URL. 50 palabras para saber qué estás leyendo." },
  "quefem.bloc.01.meta": { ca: "50 paraules", es: "50 palabras" },
  "quefem.bloc.02.name": { ca: "5 dades clau", es: "5 datos clave" },
  "quefem.bloc.02.desc": { ca: "Els punts quantitatius amb valor, context i pàgina citada. El que es queda al cap.", es: "Los puntos cuantitativos con valor, contexto y página citada. Lo que se queda en la cabeza." },
  "quefem.bloc.02.meta": { ca: "5 dades", es: "5 datos" },
  "quefem.bloc.03.name": { ca: "Resum executiu", es: "Resumen ejecutivo" },
  "quefem.bloc.03.desc": { ca: "Què diu l'informe en llenguatge clar. 300 paraules per entendre el cor.", es: "Qué dice el informe en lenguaje claro. 300 palabras para entender el corazón." },
  "quefem.bloc.03.meta": { ca: "300 paraules", es: "300 palabras" },
  "quefem.bloc.04.name": { ca: "Implicacions", es: "Implicaciones" },
  "quefem.bloc.04.desc": { ca: "Per a empreses, reguladors i ciutadans. Amb subsecció 'Més enllà del Checkbox' (lent ètica).", es: "Para empresas, reguladores y ciudadanos. Con subsección 'Más allá del Checkbox' (lente ética)." },
  "quefem.bloc.04.meta": { ca: "450-540 paraules + subsecció ètica", es: "450-540 palabras + subsección ética" },
  "quefem.bloc.05.name": { ca: "Connexions", es: "Conexiones" },
  "quefem.bloc.05.desc": { ca: "Relacions amb altres informes i actualitat. El context que falta.", es: "Relaciones con otros informes y actualidad. El contexto que falta." },
  "quefem.bloc.05.meta": { ca: "200-250 paraules", es: "200-250 palabras" },
  "quefem.bloc.06.name": { ca: "Accions recomanades", es: "Acciones recomendadas" },
  "quefem.bloc.06.desc": { ca: "3-5 accions concretes, operatives i verificables. El cor operatiu del producte.", es: "3-5 acciones concretas, operativas y verificables. El corazón operativo del producto." },
  "quefem.bloc.06.meta": { ca: "3-5 accions · Bloc diferenciador", es: "3-5 acciones · Bloque diferenciador" },
  "quefem.bloc.07.name": { ca: "Cross-reference", es: "Cross-reference" },
  "quefem.bloc.07.desc": { ca: "Mapatge amb EcoVadis, B Corp, MSCI, GRI, SGE 21, Sustainalytics i altres. La dada sense el teu context és soroll. La dada amb el teu context és decisió.", es: "Mapa con EcoVadis, B Corp, MSCI, GRI, SGE 21, Sustainalytics y otros. El dato sin tu contexto es ruido. El dato con tu contexto es decisión." },
  "quefem.bloc.07.meta": { ca: "Per a les teves certificacions · Bloc diferenciador", es: "Para tus certificaciones · Bloque diferenciador" },

  "quefem.criteris.eyebrow": { ca: "Criteris i valors", es: "Criterios y valores" },
  "quefem.criteris.title.pre": { ca: "El que guia ", es: "Lo que guía " },
  "quefem.criteris.title.em": { ca: "cada decisió", es: "cada decisión" },
  "quefem.criteris.title.post": { ca: ".", es: "." },
  "quefem.criteri.01.name": { ca: "Honestitat", es: "Honestidad" },
  "quefem.criteri.01.text": { ca: "Si no sabem una cosa, ho diem. Si una font no és fiable, ho senyalem. Mai inventem dades.", es: "Si no sabemos algo, lo decimos. Si una fuente no es fiable, lo señalamos. Nunca inventamos datos." },
  "quefem.criteri.02.name": { ca: "Criteri", es: "Criterio" },
  "quefem.criteri.02.text": { ca: "Tot el que fem està fet amb solidesa, amb fonts verificades. Donem exemple de criteri.", es: "Todo lo que hacemos está hecho con solidez, con fuentes verificadas. Damos ejemplo de criterio." },
  "quefem.criteri.03.name": { ca: "Ètica", es: "Ética" },
  "quefem.criteri.03.text": { ca: "Apliquem el principi kantiana i el del bé comú en cada anàlisi. L'ètica és fonamental.", es: "Aplicamos el principio kantiano y el del bien común en cada análisis. La ética es fundamental." },
  "quefem.criteri.04.name": { ca: "Transparència", es: "Transparencia" },
  "quefem.criteri.04.text": { ca: "Cada afirmació porta la seva font. Cada nota del semàfor, la seva justificació. El greenwashing no passa aquí.", es: "Cada afirmación lleva su fuente. Cada nota del semáforo, su justificación. El greenwashing no pasa aquí." },
  "quefem.criteri.05.name": { ca: "Humilitat", es: "Humildad" },
  "quefem.criteri.05.text": { ca: "No som la solució final. Som una eina al servei del director de sostenibilitat. Tu decideixes; nosaltres filtrem.", es: "No somos la solución final. Somos una herramienta al servicio del director de sostenibilidad. Tú decides; nosotros filtramos." },
  "quefem.criteri.06.name": { ca: "Sostenibilitat absoluta", es: "Sostenibilidad absoluta" },
  "quefem.criteri.06.text": { ca: "Els límits planetaris són físics, no comunicatius. No admetem interpretacions.", es: "Los límites planetarios son físicos, no comunicativos. No admitimos interpretaciones." },

  "quefem.manifest.eyebrow": { ca: "Més enllà del Checkbox", es: "Más allá del Checkbox" },
  "quefem.manifest.text.pre": { ca: "La sostenibilitat no es mesura per la quantitat de formularis complimentats, ", es: "La sostenibilidad no se mide por la cantidad de formularios cumplimentados, " },
  "quefem.manifest.text.em": { ca: "sinó per la traçabilitat de les promeses", es: "sino por la trazabilidad de las promesas" },
  "quefem.manifest.text.post": { ca: ".", es: "." },
  "quefem.manifest.attribution": { ca: "Manifest Criteri ESG", es: "Manifest Criteri ESG" },

  // ===== /qui-som (Fase 2D) =====
  "quisom.v2.hero.eyebrow": { ca: "Qui som · 2026", es: "Quiénes somos · 2026" },
  "quisom.v2.hero.title.pre": { ca: "Ajudem les organitzacions a ser ", es: "Ayudamos a las organizaciones a ser " },
  "quisom.v2.hero.title.em": { ca: "més ètiques, sostenibles i transformadores", es: "más éticas, sostenibles y transformadoras" },
  "quisom.v2.hero.title.post": { ca: ".", es: "." },
  "quisom.v2.hero.subtitle": {
    ca: "Aquesta és la gent que hi ha al darrere. Un equip petit que creu que les empreses poden ser agents de canvi —i que la tecnologia ha d'estar al servei del criteri humà.",
    es: "Esta es la gente que hay detrás. Un equipo pequeño que cree que las empresas pueden ser agentes de cambio —y que la tecnología debe estar al servicio del criterio humano.",
  },
  "quisom.v2.manifest.eyebrow": { ca: "Manifest", es: "Manifest" },
  "quisom.v2.team.eyebrow": { ca: "L'equip", es: "El equipo" },
  "quisom.v2.team.title.pre": { ca: "Combinem el millor de la IA amb la ", es: "Combinamos lo mejor de la IA con la " },
  "quisom.v2.team.title.em": { ca: "mirada ètica humana", es: "mirada ética humana" },
  "quisom.v2.team.title.post": { ca: ".", es: "." },
  "quisom.v2.team.intro": {
    ca: "Hem construït un sistema que combina el millor de la intel·ligència artificial amb la mirada ètica de persones que coneixen el sector ESG. La IA fa la feina pesada — recerca, síntesi, classificació. Les persones aportem criteri, context i judici.",
    es: "Hemos construido un sistema que combina lo mejor de la inteligencia artificial con la mirada ética de personas que conocen el sector ESG. La IA hace el trabajo pesado — investigación, síntesis, clasificación. Las personas aportamos criterio, contexto y juicio.",
  },
  "quisom.v2.team.01.role": { ca: "CEO · Estratègia i editorial", es: "CEO · Estrategia y editorial" },
  "quisom.v2.team.01.name": { ca: "Fundador", es: "Fundador" },
  "quisom.v2.team.01.bio": {
    ca: "Combina formació en filosofia i gestió d'empreses, amb experiència en consultoria ESG. Decideix quins informes es processen, firma la Carta del Director mensual i manté la coherència editorial del projecte. La seva mirada ètica és el que diferencia Criteri d'altres serveis ESG.",
    es: "Combina formación en filosofía y gestión de empresas, con experiencia en consultoría ESG. Decide qué informes se procesan, firma la Carta del Director mensual y mantiene la coherencia editorial del proyecto. Su mirada ética es lo que diferencia a Criteri de otros servicios ESG.",
  },
  "quisom.v2.team.01.tag": { ca: "Filosofia + ESG · Barcelona", es: "Filosofía + ESG · Barcelona" },
  "quisom.v2.team.02.role": { ca: "Tech Lead · Disseny i programació", es: "Tech Lead · Diseño y programación" },
  "quisom.v2.team.02.name": { ca: "Tech Lead", es: "Tech Lead" },
  "quisom.v2.team.02.bio": {
    ca: "S'encarrega del desenvolupament web (Next.js), la base de dades (Supabase), les integracions tècniques (Stripe, Beehiiv, Google Drive) i el manteniment de l'agent d'IA. Treballa estretament amb el fundador perquè la tecnologia estigui sempre al servei del criteri humà, no al revés.",
    es: "Se encarga del desarrollo web (Next.js), la base de datos (Supabase), las integraciones técnicas (Stripe, Beehiiv, Google Drive) y el mantenimiento del agente de IA. Trabaja estrechamente con el fundador para que la tecnología esté siempre al servicio del criterio humano, no al revés.",
  },
  "quisom.v2.team.02.tag": { ca: "Full-stack · Barcelona", es: "Full-stack · Barcelona" },
  "quisom.v2.team.03.role": { ca: "Assistent d'IA · Recerca i síntesi", es: "Asistente de IA · Investigación y síntesis" },
  "quisom.v2.team.03.name": { ca: "Agent d'IA", es: "Agente de IA" },
  "quisom.v2.team.03.bio": {
    ca: "Fa la feina pesada —detecció de fonts, síntesi en 8 blocs, classificació, corrector ortogràfic— sempre sota supervisió humana. No és un membre de l'equip en sentit estricte, però sense ella no podríem mantenir el ritme de publicació ni el cost per informe que tenim.",
    es: "Hace el trabajo pesado —detección de fuentes, síntesis en 8 bloques, clasificación, corrector ortográfico— siempre bajo supervisión humana. No es un miembro del equipo en sentido estricto, pero sin ella no podríamos mantener el ritmo de publicación ni el coste por informe que tenemos.",
  },
  "quisom.v2.team.03.tag": { ca: "IA · Supervisada per humà", es: "IA · Supervisada por humano" },
  "quisom.v2.conviccions.eyebrow": { ca: "El que creiem", es: "Lo que creemos" },
  "quisom.v2.conviccions.title.pre": { ca: "Cinc conviccions que ", es: "Cinco convicciones que " },
  "quisom.v2.conviccions.title.em": { ca: "sostenen tot", es: "sostienen todo" },
  "quisom.v2.conviccions.title.post": { ca: ".", es: "." },
  "quisom.v2.conviccio.01.name": { ca: "Dignitat", es: "Dignidad" },
  "quisom.v2.conviccio.01.text": { ca: "La dignitat humana no és negociable. Cap mètrica ESG pot justificar un deteriorament de les condicions de treball.", es: "La dignidad humana no es negociable. Ninguna métrica ESG puede justificar un deterioro de las condiciones de trabajo." },
  "quisom.v2.conviccio.02.name": { ca: "Justícia", es: "Justicia" },
  "quisom.v2.conviccio.02.text": { ca: "La justícia distributiva importa. El valor creat s'ha de repartir entre qui el genera, no només entre accionistes.", es: "La justicia distributiva importa. El valor creado debe repartirse entre quienes lo generan, no solo entre accionistas." },
  "quisom.v2.conviccio.03.name": { ca: "Sostenibilitat", es: "Sostenibilidad" },
  "quisom.v2.conviccio.03.text": { ca: "La sostenibilitat absoluta no admet interpretacions. Els límits planetaris són físics, no comunicatius.", es: "La sostenibilidad absoluta no admite interpretaciones. Los límites planetarios son físicos, no comunicativos." },
  "quisom.v2.conviccio.04.name": { ca: "Democràcia", es: "Democracia" },
  "quisom.v2.conviccio.04.text": { ca: "La co-decisió democràtica és un deure. Qui afecta les decisions ha de tenir-hi veu.", es: "La co-decisión democrática es un deber. Quienes afectan las decisiones deben tener voz en ellas." },
  "quisom.v2.conviccio.05.name": { ca: "Territori", es: "Territorio" },
  "quisom.v2.conviccio.05.text": { ca: "L'arrelament territorial compta. Una empresa que no deixa buit quan desapareix no crea valor real.", es: "El arraigo territorial cuenta. Una empresa que no deja vacío cuando desaparece no crea valor real." },
  "quisom.v2.closing.eyebrow": { ca: "Criteri ESG", es: "Criteri ESG" },
  "quisom.v2.closing.text.pre": { ca: "No és només una eina. És la convicció que les empreses poden ser ", es: "No es solo una herramienta. Es la convicción de que las empresas pueden ser " },
  "quisom.v2.closing.text.em": { ca: "agents de canvi", es: "agentes de cambio" },
  "quisom.v2.closing.text.post": { ca: " —i que la tecnologia ha d'estar al servei del criteri humà.", es: " —y que la tecnología debe estar al servicio del criterio humano." },
  "quisom.v2.closing.cta": { ca: "Prova gratis 7 dies", es: "Prueba gratis 7 días" },

  // ===== /cuenta (Fase 2D) =====
  "cuenta.v2.page.title": { ca: "El meu compte", es: "Mi cuenta" },
  "cuenta.v2.page.subtitle": { ca: "Les teves preferències i les teves certificacions en un sol lloc.", es: "Tus preferencias y tus certificaciones en un solo lugar." },
  "cuenta.v2.nav.perfil": { ca: "Perfil", es: "Perfil" },
  "cuenta.v2.nav.newsletter": { ca: "Newsletter", es: "Newsletter" },
  "cuenta.v2.nav.plan": { ca: "El meu pla", es: "Mi plan" },
  "cuenta.v2.nav.estandares": { ca: "Els meus estàndards ESG", es: "Mis estándares ESG" },
  "cuenta.v2.nav.intereses": { ca: "Altres interessos", es: "Otros intereses" },
  "cuenta.v2.nav.billing": { ca: "Facturació", es: "Billing" },
  "cuenta.v2.logout": { ca: "Tanca la sessió", es: "Cerrar sesión" },
  "cuenta.v2.plan.free": { ca: "Pla Free", es: "Plan Free" },
  "cuenta.v2.plan.premium": { ca: "Pla Premium", es: "Plan Premium" },
  "cuenta.v2.plan.free_desc": { ca: "0€/mes · Accés a informes antics + newsletter reduïda", es: "0€/mes · Acceso a informes antiguos + newsletter reducida" },
  "cuenta.v2.plan.premium_desc": { ca: "29€/mes · Accés complet + cross-reference + accions", es: "29€/mes · Acceso completo + cross-reference + acciones" },
  "cuenta.v2.plan.upgrade": { ca: "Fes-te Premium →", es: "Hazte Premium →" },
  "cuenta.v2.plan.premium_info": {
    ca: "Amb Premium accedeixes a tots els informes recents (últims 6 mesos), cross-reference complet amb les teves certificacions, accions recomanades i la newsletter completa. 29€/mes per als primers 50 subscriptors (early bird fins al novembre).",
    es: "Con Premium accedes a todos los informes recientes (últimos 6 meses), cross-reference completo con tus certificaciones, acciones recomendadas y la newsletter completa. 29€/mes para los primeros 50 suscriptores (early bird hasta noviembre).",
  },
  "cuenta.v2.perfil.title": { ca: "Perfil", es: "Perfil" },
  "cuenta.v2.plan.title": { ca: "El meu pla", es: "Mi plan" },
  "cuenta.v2.perfil.nombre": { ca: "Nom", es: "Nombre" },
  "cuenta.v2.perfil.email": { ca: "Email", es: "Email" },
  "cuenta.v2.perfil.empresa": { ca: "Empresa", es: "Empresa" },
  "cuenta.v2.perfil.empresa_placeholder": { ca: "Nom de la teva empresa", es: "Nombre de tu empresa" },
  "cuenta.v2.perfil.sector": { ca: "Sector professional", es: "Sector profesional" },
  "cuenta.v2.perfil.sector_placeholder": { ca: "Director de sostenibilitat", es: "Director de sostenibilidad" },
  "cuenta.v2.newsletter.title": { ca: "Newsletter", es: "Newsletter" },
  "cuenta.v2.newsletter.idioma": { ca: "Idioma de la newsletter", es: "Idioma de la newsletter" },
  "cuenta.v2.newsletter.desc": {
    ca: "Reps la newsletter bimensual (cada 2 setmanes, els dijous a les 15:00h). Pots canviar l'idioma en qualsevol moment.",
    es: "Recibes la newsletter bimensual (cada 2 semanas, los jueves a las 15:00h). Puedes cambiar el idioma en cualquier momento.",
  },
  "cuenta.v2.estandares.title": { ca: "Els meus estàndards ESG", es: "Mis estándares ESG" },
  "cuenta.v2.estandares.desc": {
    ca: "Selecciona els estàndards que ja té la teva empresa. Et recomanarem informes que t'afecten directament.",
    es: "Selecciona los estándares que ya tiene tu empresa. Te recomendaremos informes que te afectan directamente.",
  },
  "cuenta.v2.estandares.legend.reg": { ca: "Regulacions (5)", es: "Regulaciones (5)" },
  "cuenta.v2.estandares.legend.fw": { ca: "Frameworks (5)", es: "Frameworks (5)" },
  "cuenta.v2.estandares.legend.cert": { ca: "Certificacions (6)", es: "Certificaciones (6)" },
  "cuenta.v2.intereses.title": { ca: "Altres interessos", es: "Otros intereses" },
  "cuenta.v2.intereses.desc": {
    ca: "Altres temes que t'interessen. Els fem servir per millorar les recomanacions de la newsletter.",
    es: "Otros temas que te interesan. Los usamos para mejorar las recomendaciones de la newsletter.",
  },
  "cuenta.v2.login_required.title": { ca: "Cal iniciar sessió", es: "Inicia sesión" },
  "cuenta.v2.login_required.body": { ca: "Necessites iniciar sessió per veure el teu compte.", es: "Necesitas iniciar sesión para ver tu cuenta." },
  "cuenta.v2.login_required.cta": { ca: "Accedir", es: "Acceder" },
>>>>>>> Stashed changes
} as const;
