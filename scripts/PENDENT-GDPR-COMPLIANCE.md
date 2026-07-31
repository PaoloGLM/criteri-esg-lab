# Pendent: Compliment GDPR del flux d'informes

> **Estat**: pendent de decisió
> **Detectat**: 29 juliol 2026 per Paolo
> **Prioritat**: alta — afecta posicionament ètic del projecte

## Problema

GLM (Z.ai) té els servidors a Hong Kong (Alibaba). Quan el flux d'informes crida GLM als passos 2 i 4, el text dels PDFs institucionals europeus es processa a la Xina. Això:

1. **Infringeix GDPR** (Article 44-50): Xina no té adequacy decision de la Comissió Europea. Transferir dades personals fora de l'EEA sense garanties adequades és il·legal.
2. **És incoherent amb el manifest ètic** de Criteri ESG (Economia del Bé Comú + Economia Ciutadana, criteri d'arrelament territorial).
3. **Risc reputacional**: si un client o inversor descobreix que el seu informe ESG passa per Hong Kong, perd confiança.

## Què està bé (ja GDPR-compliant)

- **Gemini via Vertex AI europe-west1** (Bèlgica) — passos 3 i 5. Contracte Google Cloud EU.
- **Supabase** — podem seleccionar regió EU (Frankfurt/Irlanda).
- **Vercel** — podem seleccionar regió EU.
- **Beehiiv** — US-based, però només guarda email + idioma (no dades sensibles).

## Què cal corregir

Els passos **2 i 4** del flux d'informes fan servir GLM (`scripts/glm_client.py`) per processar text dels PDFs. Aquestes crides van a Hong Kong.

| Pas | Què fa | Provider actual | Localització |
|-----|--------|-----------------|--------------|
| 2 | GLM destil·la | z-ai-web-dev-sdk | Hong Kong ❌ |
| 4 | GLM redacta | z-ai-web-dev-sdk | Hong Kong ❌ |

## Solucions possibles

### Opció A — Migrar passos 2 i 4 a Gemini europe-west1 (ràpida)

- Refactoritzar `02-glm-distilla.py` i `04-glm-redacta.py` per fer servir `gemini_client.py` en lloc de `glm_client.py`
- Tot el flux d'informes (passos 2-5) queda 100% a Europa
- GLM queda només per: codi, conversa amb Paolo, HTML estàtic sense dades sensibles
- Cost: ~0 (Gemini 2.5 Flash té free tier generós)

### Opció B — Mistral AI (100% europea, més ètica)

- Mistral AI és empresa francesa, servidors a París, GDPR-compliant per disseny
- Substituir tant GLM com Gemini per Mistral als passos 2, 3, 4, 5
- Màxima coherència amb el manifest ètic de Criteri ESG
- Cost: ~2€/milió de tokens d'input (similar a Gemini)

### Opció C — Llama 3 self-hosted (màxim control)

- Servidor europeu (Scaleway fr-par, Hetzner Frankfurt)
- Cap dependència de cap provider
- Cost: 50-100€/mes en hosting + configuració inicial complexa
- Només justificable si el volum és molt alt o si volem sobirania total

## Recomanació

**Opció A** a curt termini (migrar a Gemini europe-west1). És ràpida, gratuïta i soluciona el problema de GDPR immediatament.

**Opció B** a mitjà termini (substituir per Mistral). Màxima coherència amb el posicionament ètic de Criteri ESG. Avaluar quan tinguem els primers subscriptors Premium pagant.

## Sobre les converses amb GLM

GLM podria fer servir converses per training de futurs models (no es pot confirmar al 100% amb Z.ai). Per tant:

- **NO** passar a GLM: PII d'usuaris, informes interns no publicats, estratègia competitiva, dades financeres
- **SÍ** passar a GLM: codi, dissenys HTML, conversa general sobre arquitectura, errors de programació

Per a dades sensibles, **sempre** fer servir Gemini europe-west1 o Mistral.
