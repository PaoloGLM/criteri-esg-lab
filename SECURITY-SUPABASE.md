# Configuració de seguretat — Supabase

> **Document operatiu.** Quan Supabase es configuri (previst agost 2026), aquests són els passos de seguretat obligatoris abans d'obrir registres als beta testers.

---

## 1. Rate limiting (Authentication → Rate Limits)

Supabase té rate limiting configurable al dashboard. Configurar:

| Operació | Límit | Raó |
|----------|-------|-----|
| Email OTP (magic link) | 5 per hora per IP | Evita spam d'emails |
| Sign-up (registre) | 3 per hora per IP | Evita creació massiva de comptes |
| Sign-in (login) | 10 per hora per IP | Evita brute force de contrasenyes |
| Token refresh | 100 per hora per usuari | Evita abús del refresh token |
| Password reset | 3 per hora per IP | Evita spam de reset emails |

**Configuració al dashboard**: Authentication → Rate Limits → aplicar els límits anteriors.

---

## 2. Verificació d'email obligatòria

A Authentication → Settings:
- ✅ "Confirm email" habilitat
- ✅ "Double confirm email changes" habilitat
- ❌ "Allow anonymous sign-ins" deshabilitat
- ✅ "Secure email change" habilitat (requereix verificació de l'email nou)

Això garanteix que cap usuari pot accedir a `/cuenta` o als informes Premium sense haver verificat el seu correu.

---

## 3. Politiques RLS (Row Level Security)

L'esquema `download/supabase-schema.sql` ja activa RLS a totes les taules amb polítiques restrictives:
- Cada usuari només pot veure/modificar el seu propi perfil
- Cada usuari només pot veure les seves pròpies subscriptions i documents fiscals
- Newsletter: qualsevol pot subscriure's (insert) però només veu el seu
- Report views: només el propietari

**Verificar abans d'obrir registres**:
1. Executar `supabase-schema.sql` al SQL Editor
2. Comprovar que totes les taules tenen RLS activat:
   ```sql
   select tablename, rowsecurity from pg_tables where schemaname = 'public';
   ```
   Totes han de tenir `rowsecurity = true`.
3. Comprovar que no hi ha cap policy amb `using (true)` o `with check (true)` excepte la de newsletter insert.

---

## 4. 2FA per al compte d'administració (Paolo)

Quan Paolo tingui accés d'administració a Supabase:
1. Account → Security → Enable Two-Factor Authentication
2. Guardar els recovery codes en un gestor de contrasenyes (1Password, Bitwarden)
3. No guardar-los al telèfon ni al email

---

## 5. Backup automàtic

Al dashboard de Supabase:
- Database → Backups → activar backups diaris automàtics
- Configurar retention: 7 dies (plà free) o 30 dies (plà pro)

---

## 6. Audit logs

Supabase (plà pro) té audit logs. Quan es migrí al pro:
- Habilitar audit logs per a totes les taules amb dades sensibles (profiles, subscriptions, documents_fiscals)
- Configurar alerts per accesos sospitosos (IP fora de l'estat, multiples logins fallits)

---

## 7. Environment variables a Vercel

Quan Supabase estigui configurat, afegir a Vercel → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://XXXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJXXXXX...
```

**Mai** pujar la service_role_key al frontend. La service_role_key és per a server-side only (API routes, server components).

---

## 8. Secrets management

- ✅ `.env` local: gitignored, mai al repo
- ✅ Vercel env vars: configurades al dashboard
- ❌ Mai commitejar tokens, API keys, contrasenyes al codi
- ❌ Mai posar la service_role_key de Supabase en codi client

### Regla absoluta de protecció de credencials (16 juliol 2026)

**Z.ai-bot MAI compartirà, publicarà, ni commitejarà al GitHub cap clau, contrasenya, token, API key o `service_role` key que Paolo li hagi proporcionat.**

Aquestes claus són només per ús productiu del projecte Criteri ESG i es guarden exclusivament al fitxer `.env` local (gitignored). Mai apareixeran al codi font, ni al frontend, ni al backend, ni als commits, ni als missatges de commit, ni als logs públics.

Si Z.ai-bot necessita fer servir una clau per a una tasca administrativa (ex: esborrar usuaris de test, executar SQL), la llegeix del `.env` local i la fa servir via scripts Node — sense exposar-la mai.

Si una clau es compromet, es regenera al dashboard corresponent i s'actualitza al `.env` local.

**Clau que té Z.ai-bot al `.env` local (16 juliol 2026)**:
- `NEXT_PUBLIC_SUPABASE_URL` — pública (va al frontend)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — pública (va al frontend)
- `SUPABASE_SERVICE_ROLE_KEY` — **privada**, només per scripts administratius server-side. MAI al frontend.

---

## Data de revisió

Aquest document s'ha de revisar:
- Abans d'obrir registres als beta testers (agost 2026)
- Abans del llançament oficial (setembre 2026)
- Quan es migri a Supabase Pro (previsió: desembre 2026)

Última actualització: 15 juliol 2026
