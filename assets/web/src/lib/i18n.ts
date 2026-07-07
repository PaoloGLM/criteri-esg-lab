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
    ca: "Criteri ESG converteix els informes institucionals, els frameworks i les certificacions europees en accions concretes. Cada document, sintetitzat en 5 minuts de lectura — per a directors de sostenibilitat, compliance officers i consultories que volen ser més ètiques, més sostenibles i millor reputades.",
    es: "Criteri ESG convierte los informes institucionales, los frameworks y las certificaciones europeas en acciones concretas. Cada documento, sintetizado en 5 minutos de lectura — para directores de sostenibilidad, compliance officers y consultorías que quieren ser más éticas, más sostenibles y mejor reputadas.",
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
    ca: "Cada informe rellevant de la UE, sintetitzat en 8 blocs accionables amb cross-reference a EcoVadis, B Corp i MSCI.",
    es: "Cada informe relevante de la UE, sintetizado en 8 bloques accionables con cross-reference a EcoVadis, B Corp y MSCI.",
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
    ca: "3 informes destacats + 1 connexió entre ells, cada dues setmanes. Gratuït, cancel·la quan vulguis.",
    es: "3 informes destacados + 1 conexión entre ellos, cada dos semanas. Gratuito, cancela cuando quieras.",
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
    es: "Lee el informe completo con registro gratuito",
  },

  "cta.newsletter.eyebrow": { ca: "La newsletter gratuïta", es: "La newsletter gratuita" },
  "cta.newsletter.title": {
    ca: "Cada dues setmanes, 3 informes que has de conèixer.",
    es: "Cada dos semanas, 3 informes que debes conocer.",
  },
  "cta.newsletter.body": {
    ca: "Resums executius de 300 paraules + una connexió entre ells. 5 minuts de lectura que et posen al dia. Cancel·la quan vulguis.",
    es: "Resúmenes ejecutivos de 300 palabras + una conexión entre ellos. 5 minutos de lectura que te pon al día. Cancela cuando quieras.",
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
    ca: "Comencem amb 2 mesos gratuïts per a tothom (setembre i octubre 2026). A partir de novembre, tries el teu pla. La subscripció Premium es paga anualment. Sense permanència, cancel·la quan vulguis.",
    es: "Empezamos con 2 meses gratuitos para todos (septiembre y octubre 2026). A partir de noviembre, eliges tu plan. La suscripción Premium se paga anualmente. Sin permanencia, cancela cuando quieras.",
  },
  "preus.period.forever": { ca: "sempre", es: "siempre" },
  "preus.period.month": { ca: "mes", es: "mes" },
  "preus.period.year": { ca: "any", es: "año" },
  "preus.toggle.monthly": { ca: "Mensual", es: "Mensual" },
  "preus.toggle.annual": { ca: "Anual", es: "Anual" },
  "preus.toggle.annual.note": {
    ca: "Estalvia 28€/any pagant anualment",
    es: "Ahorra 28€/año pagando anualmente",
  },

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
    ca: "Anual",
    es: "Anual",
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
  "preus.premium.f6": { ca: "Preguntes per millorar (reflexió ètica mensual)", es: "Preguntas para mejorar (reflexión ética mensual)" },
  "preus.premium.subprice": {
    ca: "Equival a 36,67€/mes · Impostos inclosos",
    es: "Equivale a 36,67€/mes · Impuestos incluidos",
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
  "preus.earlybird.price": { ca: "290€", es: "290€" },
  "preus.earlybird.period": { ca: "any", es: "año" },
  "preus.earlybird.subprice": {
    ca: "Equival a 24,17€/mes · Impostos inclosos · Estalvi de 150€",
    es: "Equivale a 24,17€/mes · Impuestos incluidos · Ahorro de 150€",
  },
  "preus.earlybird.body": {
    ca: "Els primers 50 subscriptors Premium paguen 290€/any (impostos inclosos) en lloc dels 440€ habituals. Equival a 24,17€/mes — un descompte del 34%. Llançament setembre 2026. Una vegada assignades les 50 places, el preu torna a 440€/any.",
    es: "Los primeros 50 suscriptores Premium pagan 290€/año (impuestos incluidos) en lugar de los 440€ habituales. Equival a 24,17€/mes — un descuento del 34%. Lanzamiento septiembre 2026. Una vez asignadas las 50 plazas, el precio vuelve a 440€/año.",
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
    es: "Todos los informes con más de 6 meses de antigüedad son gratuitos para siempre. Solo los informes recientes requieren Premium. Así garantizamos acceso universal al conocimiento ESG acumulado.",
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
} as const;
