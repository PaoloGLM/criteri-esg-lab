"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { adminApi, AdminInforme, AdminUser, AdminAlarm, AdminError } from "@/lib/admin-api";
import { supabase } from "@/lib/supabase";

/**
 * Panell d'administració de Criteri ESG.
 *
 * Accés: només usuaris amb profiles.is_admin = true (validat servidor).
 * Estètica: funcional amb la paleta corporativa (salvia/ink), sense ornaments.
 *
 * Pestanyes:
 *  - Estat: salut del sistema + alarmes actives
 *  - Informes: llista, canviar estat (draft/published), esborrar
 *  - Usuaris: llista amb pla, canviar pla manualment
 */

type Tab = "estat" | "informes" | "usuaris";

const COLORS = {
  bg: "#f4f3ef", // fons salvia clar
  card: "#ffffff",
  ink: "#1f2937",
  muted: "#6b7280",
  salvia: "#7a9471",
  salviaDark: "#5f7a58",
  border: "#e5e3dd",
  danger: "#b91c1c",
  warn: "#b45309",
  ok: "#166534",
};

const SEVERITY_STYLE: Record<string, { color: string; label: string }> = {
  critical: { color: COLORS.danger, label: "CRÍTIC" },
  error: { color: COLORS.danger, label: "ERROR" },
  warning: { color: COLORS.warn, label: "Avís" },
  info: { color: COLORS.muted, label: "Info" },
};

export default function AdminPage() {
  const { user, loading, session } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("estat");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // null = comprovant
  const [allowed, setAllowed] = useState(false);

  const [reports, setReports] = useState<AdminInforme[] | null>(null);
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [alarms, setAlarms] = useState<AdminAlarm[]>([]);
  const [alarmCounts, setAlarmCounts] = useState<Record<string, number>>({});
  const [health, setHealth] = useState<Record<string, { ok: boolean; detail?: string }> | null>(null);
  const [setupPending, setSetupPending] = useState(false);

  const [banner, setBanner] = useState<{ type: "ok" | "error"; msg: string; errorId?: string } | null>(null);
  const [busy, setBusy] = useState(false);

  // ── Verificació d'accés ────────────────────────────────────────────
  useEffect(() => {
    if (loading) return;
    if (!user) {
      setAllowed(false);
      setIsAdmin(false);
      return;
    }
    // Prova d'accés real contra l'API (el servidor valida el rol)
    adminApi
      .health()
      .then(() => {
        setAllowed(true);
        setIsAdmin(true);
      })
      .catch((e: AdminError) => {
        setAllowed(false);
        setIsAdmin(false);
        if (e.status !== 401 && e.status !== 403) {
          setBanner({ type: "error", msg: e.error, errorId: e.errorId });
        }
      });
  }, [user, loading]);

  // ── Càrrega de dades ───────────────────────────────────────────────
  const loadAll = async () => {
    setBusy(true);
    try {
      const [h, e] = await Promise.allSettled([adminApi.health(), adminApi.errors.list()]);
      if (h.status === "fulfilled") setHealth(h.value.checks);
      if (e.status === "fulfilled") {
        setAlarms(e.value.errors);
        setAlarmCounts(e.value.counts);
        setSetupPending(!!e.value.setup_pending);
      }
    } finally {
      setBusy(false);
    }
  };

  const loadReports = async () => {
    setBusy(true);
    try {
      const r = await adminApi.reports.list();
      setReports(r.reports);
    } catch (e) {
      showErr(e);
    } finally {
      setBusy(false);
    }
  };

  const loadUsers = async () => {
    setBusy(true);
    try {
      const r = await adminApi.users.list();
      setUsers(r.users);
    } catch (e) {
      showErr(e);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!allowed) return;
    loadAll();
    if (tab === "informes" && reports === null) loadReports();
    if (tab === "usuaris" && users === null) loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowed, tab]);

  const showErr = (e: unknown) => {
    const err = e as AdminError;
    setBanner({ type: "error", msg: err.error, errorId: err.errorId });
  };

  const ok = (msg: string) => setBanner({ type: "ok", msg });

  // ── Accions ────────────────────────────────────────────────────────
  const changeStatus = async (slug: string, status: AdminInforme["status"]) => {
    setBusy(true);
    try {
      await adminApi.reports.update(slug, { status });
      setReports((rs) => rs?.map((r) => (r.slug === slug ? { ...r, status } : r)) ?? null);
      ok(`Informe "${slug}" → ${status}`);
    } catch (e) {
      showErr(e);
    } finally {
      setBusy(false);
    }
  };

  const deleteReport = async (slug: string) => {
    if (!confirm(`Segur que vols ESBORRAR l'informe "${slug}"? Això no es pot desfer.`)) return;
    setBusy(true);
    try {
      await adminApi.reports.remove(slug);
      setReports((rs) => rs?.filter((r) => r.slug !== slug) ?? null);
      ok(`Informe "${slug}" esborrat`);
    } catch (e) {
      showErr(e);
    } finally {
      setBusy(false);
    }
  };

  const changePlan = async (userId: string, plan: string) => {
    setBusy(true);
    try {
      await adminApi.users.setPlan(userId, plan);
      setUsers((us) => us?.map((u) => (u.id === userId ? { ...u, plan } : u)) ?? null);
      ok(`Pla canviat a ${plan}`);
    } catch (e) {
      showErr(e);
    } finally {
      setBusy(false);
    }
  };

  const resolveAlarm = async (id: string) => {
    try {
      await adminApi.errors.resolve(id);
      setAlarms((as) => as.filter((a) => a.id !== id));
    } catch (e) {
      showErr(e);
    }
  };

  /** Login admin: OAuth Google (mateix flux que la resta de la web).
   * Els comptes registrats amb Google no tenen contrasenya local, així que
   * signInWithPassword mai funcionaria per a ells. */
  const login = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: typeof window !== "undefined" ? `${window.location.origin}/admin` : undefined,
      },
    });
    if (error) {
      setBanner({
        type: "error",
        msg: "No s'ha pogut iniciar el login amb Google: " + error.message,
        errorId: "LOGIN-FAIL",
      });
    }
    // El useEffect d'adalt repetirà la verificació quan l'OAuth torni i canviï user
  };

  // ── Estats d'espera ────────────────────────────────────────────────
  if (loading || isAdmin === null) {
    return <Shell><p style={{ color: COLORS.muted }}>Carregant…</p></Shell>;
  }

  if (!user) {
    return (
      <Shell>
        <h1 style={{ ...h1 }}>Administració</h1>
        <p style={{ color: COLORS.muted }}>Cal iniciar sessió amb un compte d'administrador.</p>
        <button onClick={login} style={btnPrimary}>Entra amb Google</button>
      </Shell>
    );
  }

  if (!allowed) {
    return (
      <Shell>
        <h1 style={h1}>Administració</h1>
        <div style={{ ...note, borderColor: COLORS.danger }}>
          <strong>Accés restringit.</strong> Aquest compte no té permisos d'administració.
          Si hauries de tenir-los: executa el pas 9 del SQL <code>supabase-admin-fase1.sql</code>
          {" "}i tanca/reobre la sessió.
        </div>
      </Shell>
    );
  }

  // ── Panell ─────────────────────────────────────────────────────────
  const criticalCount = (alarmCounts.critical || 0) + (alarmCounts.error || 0);

  return (
    <Shell>
      {/* Capçalera */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={h1}>Panell d&apos;administració</h1>
        <button onClick={logout} style={btnGhost}>Tanca sessió</button>
      </div>

      {/* Franja d'alarma global */}
      {criticalCount > 0 && (
        <div style={{ ...alarmBar, background: "#fef2f2", borderColor: COLORS.danger }}>
          ⚠️ <strong>{criticalCount}</strong> error{criticalCount !== 1 ? "s" : ""} actiu
          {criticalCount !== 1 ? "s" : ""} a la web — revisa la pestanya <em>Estat</em>.
        </div>
      )}

      {banner && (
        <div
          style={{
            ...note,
            borderColor: banner.type === "ok" ? COLORS.ok : COLORS.danger,
            background: banner.type === "ok" ? "#f0fdf4" : "#fef2f2",
          }}
        >
          {banner.msg}
          {banner.errorId && <code style={{ marginLeft: 8 }}>[{banner.errorId}]</code>}
          <button onClick={() => setBanner(null)} style={btnX}>✕</button>
        </div>
      )}

      {/* Pestanyes */}
      <div style={tabs}>
        {(["estat", "informes", "usuaris"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              ...tabBtn,
              ...(tab === t ? { background: COLORS.salvia, color: "#fff" } : {}),
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {t === "estat" && alarms.length > 0 && (
              <span style={badge}>{alarms.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Pestanya ESTAT ── */}
      {tab === "estat" && (
        <section>
          {setupPending && (
            <div style={{ ...note, borderColor: COLORS.warn, background: "#fffbeb" }}>
              <strong>Configuració pendent:</strong> executa el fitxer{" "}
              <code>assets/supabase-admin-fase1.sql</code> al Supabase Dashboard
              (SQL Editor) per activar el registre d&apos;alarmes i el rol d&apos;admin.
            </div>
          )}

          <h2 style={h2}>Estat del sistema</h2>
          {health ? (
            <ul style={list}>
              {Object.entries(health).map(([k, v]) => (
                <li key={k} style={listItem}>
                  <span style={{ color: v.ok ? COLORS.ok : COLORS.danger, fontWeight: 700 }}>
                    {v.ok ? "✓" : "✗"}
                  </span>{" "}
                  <strong>{k}</strong>
                  {v.detail && <span style={{ color: COLORS.muted }}> — {v.detail}</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: COLORS.muted }}>Carregant estat…</p>
          )}

          <h2 style={h2}>
            Alarmes actives {alarms.length > 0 && <span style={{ color: COLORS.danger }}>({alarms.length})</span>}
          </h2>
          {alarms.length === 0 ? (
            <p style={{ color: COLORS.ok }}>✓ Cap alarma activa. Tot tranquil.</p>
          ) : (
            <div style={cardList}>
              {alarms.map((a) => {
                const sev = SEVERITY_STYLE[a.severity] || SEVERITY_STYLE.info;
                return (
                  <div key={a.id} style={{ ...card, borderLeft: `4px solid ${sev.color}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <strong style={{ color: sev.color }}>{sev.label}</strong>{" "}
                        <code>{a.error_id}</code>
                        <div style={{ color: COLORS.muted, fontSize: 14 }}>
                          {new Date(a.created_at).toLocaleString("ca-ES")}
                        </div>
                      </div>
                      <button onClick={() => resolveAlarm(a.id)} style={btnGhostSmall}>
                        Marca resolta
                      </button>
                    </div>
                    {a.context && (
                      <pre style={pre}>{JSON.stringify(a.context, null, 2)}</pre>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ── Pestanya INFORMES ── */}
      {tab === "informes" && (
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={h2}>Informes ({reports?.length ?? "…"})</h2>
            <button onClick={loadReports} style={btnGhostSmall} disabled={busy}>↻ Recarrega</button>
          </div>
          {reports === null ? (
            <p style={{ color: COLORS.muted }}>Carregant…</p>
          ) : reports.length === 0 ? (
            <div style={note}>
              La base de dades encara no té informes. Els 11 informes actuals venen del
              codi (fallback). El seed es farà al pas següent.
            </div>
          ) : (
            <div style={cardList}>
              {reports.map((r) => (
                <div key={r.slug} style={card}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <strong>{r.title}</strong>{" "}
                      <span style={{ color: COLORS.muted, fontSize: 14 }}>
                        · {r.institution} · {r.date}
                      </span>
                      <div style={{ marginTop: 6 }}>
                        <StatusPill status={r.status} />
                        {r.content_ca ? " · CA ✓" : " · CA ✗"}
                        {r.content_es ? " · ES ✓" : " · ES ✗"}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      {r.status !== "published" && (
                        <button onClick={() => changeStatus(r.slug, "published")} style={btnPrimarySmall} disabled={busy}>
                          Publica
                        </button>
                      )}
                      {r.status !== "draft" && (
                        <button onClick={() => changeStatus(r.slug, "draft")} style={btnGhostSmall} disabled={busy}>
                          → Draft
                        </button>
                      )}
                      <button onClick={() => deleteReport(r.slug)} style={btnDangerSmall} disabled={busy}>
                        Esborra
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Pestanya USUARIS ── */}
      {tab === "usuaris" && (
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={h2}>Usuaris ({users?.length ?? "…"})</h2>
            <button onClick={loadUsers} style={btnGhostSmall} disabled={busy}>↻ Recarrega</button>
          </div>
          {users === null ? (
            <p style={{ color: COLORS.muted }}>Carregant…</p>
          ) : users.length === 0 ? (
            <p style={{ color: COLORS.muted }}>Encara no hi ha usuaris registrats.</p>
          ) : (
            <div style={cardList}>
              {users.map((u) => (
                <div key={u.id} style={card}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <strong>{u.full_name || u.email}</strong>
                      {u.is_admin && (
                        <span style={{ ...pill, background: COLORS.salvia, color: "#fff" }}>admin</span>
                      )}
                      <div style={{ color: COLORS.muted, fontSize: 14 }}>
                        {u.email} · {u.company || "—"} · alta {new Date(u.created_at).toLocaleDateString("ca-ES")}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                      <PlanSelect
                        plan={u.plan}
                        disabled={busy}
                        onChange={(p) => changePlan(u.id, p)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </Shell>
  );

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }
}

// ── Subcomponents petits ────────────────────────────────────────────

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { bg: string; fg: string; label: string }> = {
    published: { bg: "#dcfce7", fg: COLORS.ok, label: "publicat" },
    draft: { bg: "#fef3c7", fg: COLORS.warn, label: "esborrany" },
    validated: { bg: "#e0e7ff", fg: "#3730a3", label: "validat" },
    archived: { bg: "#f3f4f6", fg: COLORS.muted, label: "arxivat" },
  };
  const s = map[status] || map.draft;
  return <span style={{ ...pill, background: s.bg, color: s.fg }}>{s.label}</span>;
}

function PlanSelect({
  plan,
  disabled,
  onChange,
}: {
  plan: string;
  disabled: boolean;
  onChange: (p: string) => void;
}) {
  return (
    <select value={plan} disabled={disabled} onChange={(e) => onChange(e.target.value)} style={select}>
      <option value="free">free</option>
      <option value="premium">premium</option>
      <option value="ultra">ultra</option>
    </select>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "80vh", background: COLORS.bg, padding: "40px 24px", fontSize: 16 }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>{children}</div>
    </div>
  );
}

// ── Estils (objectes inline, paleta v7) ─────────────────────────────
const h1: React.CSSProperties = { fontSize: 32, color: COLORS.ink, margin: 0 };
const h2: React.CSSProperties = { fontSize: 22, color: COLORS.ink, margin: "28px 0 14px" };
const tabs: React.CSSProperties = { display: "flex", gap: 10, margin: "24px 0" };
const tabBtn: React.CSSProperties = {
  padding: "12px 26px",
  borderRadius: 8,
  border: `1px solid ${COLORS.border}`,
  background: COLORS.card,
  cursor: "pointer",
  fontSize: 16,
  color: COLORS.ink,
};
const cardList: React.CSSProperties = { display: "grid", gap: 12 };
const card: React.CSSProperties = {
  background: COLORS.card,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 10,
  padding: "18px 22px",
  fontSize: 15,
};
const note: React.CSSProperties = {
  border: `1px solid ${COLORS.border}`,
  borderLeft: `4px solid ${COLORS.salvia}`,
  background: COLORS.card,
  borderRadius: 8,
  padding: "14px 18px",
  fontSize: 15,
  margin: "14px 0",
};
const alarmBar: React.CSSProperties = {
  border: `1px solid ${COLORS.danger}`,
  borderRadius: 8,
  padding: "14px 18px",
  fontSize: 15,
  margin: "14px 0",
};
const list: React.CSSProperties = { listStyle: "none", padding: 0, fontSize: 15 };
const listItem: React.CSSProperties = { padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` };
const pre: React.CSSProperties = {
  background: "#f8f7f4",
  fontSize: 13,
  padding: 10,
  borderRadius: 6,
  overflow: "auto",
  marginTop: 8,
  maxHeight: 140,
};
const pill: React.CSSProperties = {
  fontSize: 12,
  padding: "3px 10px",
  borderRadius: 999,
  marginLeft: 8,
  fontWeight: 600,
};
const badge: React.CSSProperties = {
  background: COLORS.danger,
  color: "#fff",
  borderRadius: 999,
  fontSize: 12,
  padding: "2px 8px",
  marginLeft: 6,
};
const select: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 6,
  border: `1px solid ${COLORS.border}`,
  fontSize: 15,
  background: COLORS.card,
};
const btnPrimary: React.CSSProperties = {
  background: COLORS.salvia,
  color: "#fff",
  border: "none",
  padding: "13px 26px",
  borderRadius: 8,
  fontSize: 16,
  cursor: "pointer",
};
const btnPrimarySmall: React.CSSProperties = { ...btnPrimary, padding: "8px 16px", fontSize: 14 };
const btnGhost: React.CSSProperties = {
  background: "transparent",
  border: `1px solid ${COLORS.border}`,
  padding: "10px 18px",
  borderRadius: 8,
  fontSize: 14,
  cursor: "pointer",
  color: COLORS.ink,
};
const btnGhostSmall: React.CSSProperties = { ...btnGhost, padding: "8px 14px", fontSize: 14 };
const btnDangerSmall: React.CSSProperties = {
  ...btnGhostSmall,
  color: COLORS.danger,
  borderColor: COLORS.danger,
};
const btnX: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  float: "right",
  color: COLORS.muted,
};
