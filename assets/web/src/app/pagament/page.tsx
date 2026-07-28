"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { useLanguage } from "@/components/language-provider";
import { useAuth } from "@/lib/auth-context";

export default function PagamentPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"register" | "login">("register");
  const [preusOpen, setPreusOpen] = useState(false);
  const [method, setMethod] = useState<"stripe" | "fiare" | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const openAuth = (tab: "register" | "login" = "register") => { setAuthTab(tab); setAuthOpen(true); };
  const tr = (ca: string, es: string) => (lang === "ca" ? ca : es);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onOpenPreus={() => setPreusOpen(true)} onOpenAuth={(tab) => openAuth(tab || "register")} />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-rule px-6 py-4" style={{ background: "#F5EFE6" }}>
          <div className="mx-auto max-w-4xl">
            <button onClick={() => router.push("/preus")} className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: "#8A5526" }}>
              {tr("Plans", "Planes")} <span style={{ color: "#C9B89A" }}>/</span> <span style={{ color: "#2C1810" }}>{tr("Pagament", "Pago")}</span>
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-6 py-12" style={{ background: "#F5EFE6" }}>
          {/* Header */}
          <div className="mb-8">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#8A5526" }}>{tr("Premium · Pagament", "Premium · Pago")}</p>
            <h1 className="font-serif text-4xl font-medium text-primary" style={{ letterSpacing: "-0.018em" }}>{tr("Completa el teu pagament", "Completa tu pago")}</h1>
          </div>

          {/* Resum preu */}
          <div className="mb-8 border p-6" style={{ borderColor: "#C9B89A", background: "white" }}>
            <div className="flex justify-between items-baseline mb-4">
              <div>
                <p className="font-serif text-2xl font-medium text-primary">Premium · Early Bird</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "#8B7355" }}>{tr("Pagament anual · 50 places", "Pago anual · 50 plazas")}</p>
              </div>
              <div className="text-right">
                <p className="font-serif text-4xl font-medium" style={{ color: "#B87333" }}>348 €</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "#8B7355" }}>{tr("/ any", "/ año")}</p>
              </div>
            </div>
            <div className="border-t pt-3" style={{ borderColor: "#C9B89A" }}>
              <div className="flex justify-between text-sm py-1" style={{ color: "#5C3A1E" }}>
                <span>{tr("Base imposable", "Base imponible")}</span><span>287,60 €</span>
              </div>
              <div className="flex justify-between text-sm py-1" style={{ color: "#5C3A1E" }}>
                <span>IVA (21%)</span><span>60,40 €</span>
              </div>
              <div className="flex justify-between font-semibold text-base py-2 border-t mt-1" style={{ color: "#2C1810", borderColor: "#C9B89A" }}>
                <span>{tr("Total", "Total")}</span><span>348,00 €</span>
              </div>
              <p className="text-xs mt-2" style={{ color: "#8B7355" }}>{tr("Equival a 29 €/mes. IVA deduïble per a empreses.", "Equivale a 29 €/mes. IVA deducible para empresas.")}</p>
            </div>
          </div>

          {/* Selector mètode de pagament (només si no s'ha triat) */}
          {!method && (
            <div className="grid gap-4 sm:grid-cols-2">
              <button onClick={() => setMethod("stripe")} className="flex flex-col gap-3 border p-6 text-left transition-colors hover:border-accent" style={{ borderColor: "#C9B89A", background: "white" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded flex items-center justify-center" style={{ background: "#2C1810" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5EFE6" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium text-primary">Targeta</h3>
                    <p className="font-mono text-[9px] uppercase tracking-[0.14em]" style={{ color: "#8B7355" }}>Stripe · {tr("Immediat", "Inmediato")}</p>
                  </div>
                </div>
                <p className="text-sm" style={{ color: "#5C3A1E" }}>{tr("Paga amb targeta de crèdit/dèbit. Accés Premium actiu immediatament.", "Paga con tarjeta de crédito/débito. Acceso Premium activo inmediatamente.")}</p>
              </button>

              <button onClick={() => setMethod("fiare")} className="flex flex-col gap-3 border p-6 text-left transition-colors hover:border-accent" style={{ borderColor: "#C9B89A", background: "white" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded flex items-center justify-center" style={{ background: "#B87333" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></svg>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium text-primary">{tr("Transferència", "Transferencia")}</h3>
                    <p className="font-mono text-[9px] uppercase tracking-[0.14em]" style={{ color: "#8B7355" }}>Fiare · {tr("Immediata", "Inmediata")}</p>
                  </div>
                </div>
                <p className="text-sm" style={{ color: "#5C3A1E" }}>{tr("Paga per transferència bancària a Fiare. Accés Premium activat en rebre el pagament.", "Paga por transferencia bancaria a Fiare. Acceso Premium activado al recibir el pago.")}</p>
              </button>
            </div>
          )}

          {/* Formulari Stripe */}
          {method === "stripe" && (
            <div className="border p-6" style={{ borderColor: "#C9B89A", background: "white" }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-xl font-medium text-primary">{tr("Pagament amb targeta", "Pago con tarjeta")}</h2>
                <button onClick={() => setMethod(null)} className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "#8A5526" }}>← {tr("Tornar", "Volver")}</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-[0.16em] font-semibold block mb-1.5" style={{ color: "#8A5526" }}>{tr("Nom del titular", "Nombre del titular")}</label>
                  <input className="w-full border p-3 text-sm" style={{ borderColor: "#C9B89A", background: "#F5EFE6", color: "#2C1810" }} placeholder="Paolo G." />
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-[0.16em] font-semibold block mb-1.5" style={{ color: "#8A5526" }}>{tr("Número de targeta", "Número de tarjeta")}</label>
                  <input className="w-full border p-3 text-sm font-mono" style={{ borderColor: "#C9B89A", background: "#F5EFE6", color: "#2C1810" }} placeholder="4242 4242 4242 4242" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-[0.16em] font-semibold block mb-1.5" style={{ color: "#8A5526" }}>{tr("Caducitat", "Caducidad")}</label>
                    <input className="w-full border p-3 text-sm font-mono" style={{ borderColor: "#C9B89A", background: "#F5EFE6", color: "#2C1810" }} placeholder="MM / AA" />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-[0.16em] font-semibold block mb-1.5" style={{ color: "#8A5526" }}>CVC</label>
                    <input className="w-full border p-3 text-sm font-mono" style={{ borderColor: "#C9B89A", background: "#F5EFE6", color: "#2C1810" }} placeholder="123" />
                  </div>
                </div>
                <div className="border-t pt-4 mt-4" style={{ borderColor: "#C9B89A" }}>
                  <div className="flex justify-between text-sm mb-1" style={{ color: "#5C3A1E" }}>
                    <span>{tr("Base imposable", "Base imponible")}</span><span>287,60 €</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1" style={{ color: "#5C3A1E" }}>
                    <span>IVA (21%)</span><span>60,40 €</span>
                  </div>
                  <div className="flex justify-between font-semibold text-base py-2" style={{ color: "#2C1810" }}>
                    <span>{tr("Total a pagar", "Total a pagar")}</span><span>348,00 €</span>
                  </div>
                </div>
                <button className="w-full py-3.5 text-sm font-semibold text-white" style={{ background: "#B87333" }}>
                  {tr("Pagar 348 €", "Pagar 348 €")}
                </button>
                <p className="text-xs text-center" style={{ color: "#8B7355" }}>{tr("Pagament segur processat per Stripe. Dades encriptades.", "Pago seguro procesado por Stripe. Datos encriptados.")}</p>
              </div>
            </div>
          )}

          {/* Formulari Fiare */}
          {method === "fiare" && (
            <div className="border p-6" style={{ borderColor: "#C9B89A", background: "white" }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-xl font-medium text-primary">{tr("Transferència a Fiare", "Transferencia a Fiare")}</h2>
                <button onClick={() => setMethod(null)} className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "#8A5526" }}>← {tr("Tornar", "Volver")}</button>
              </div>
              <div className="space-y-4">
                <div className="p-4" style={{ background: "rgba(184,115,51,0.06)", border: "1px solid #B87333" }}>
                  <p className="font-serif text-sm italic" style={{ color: "#5C3A1E" }}>{tr("Per activar el teu accés Premium, realitza la TRANSFERÈNCIA IMMEDIATA amb les següents dades i puja el justificant a continuació. L'accés s'activarà en uns segons.", "Para activar tu acceso Premium, realiza la TRANSFERENCIA INMEDIATA con los siguientes datos y sube el justificante a continuación. El acceso se activará en unos segundos.")}</p>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-[140px_1fr] gap-2 py-2 border-b" style={{ borderBottomColor: "#C9B89A" }}>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] font-semibold" style={{ color: "#8A5526" }}>{tr("Beneficiari", "Beneficiario")}</span>
                    <span className="text-sm text-primary">Criteri ESG</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] gap-2 py-2 border-b" style={{ borderBottomColor: "#C9B89A" }}>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] font-semibold" style={{ color: "#8A5526" }}>IBAN</span>
                    <span className="text-sm font-mono text-primary">ES77 2100 3000 7422 0123 4567</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] gap-2 py-2 border-b" style={{ borderBottomColor: "#C9B89A" }}>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] font-semibold" style={{ color: "#8A5526" }}>BIC/SWIFT</span>
                    <span className="text-sm font-mono text-primary">CAIXESBBXXX</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] gap-2 py-2 border-b" style={{ borderBottomColor: "#C9B89A" }}>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] font-semibold" style={{ color: "#8A5526" }}>{tr("Banc", "Banco")}</span>
                    <span className="text-sm text-primary">Fiare Banca Ètica</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] gap-2 py-2 border-b" style={{ borderBottomColor: "#C9B89A" }}>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] font-semibold" style={{ color: "#8A5526" }}>{tr("Concepte", "Concepto")}</span>
                    <span className="text-sm text-primary">Premium Early Bird — {user?.email || tr("el teu email", "tu email")}</span>
                  </div>
                </div>
                <div className="border-t pt-4 mt-2" style={{ borderColor: "#C9B89A" }}>
                  <div className="flex justify-between text-sm mb-1" style={{ color: "#5C3A1E" }}>
                    <span>{tr("Base imposable", "Base imponible")}</span><span>287,60 €</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1" style={{ color: "#5C3A1E" }}>
                    <span>IVA (21%)</span><span>60,40 €</span>
                  </div>
                  <div className="flex justify-between font-semibold text-base py-2" style={{ color: "#2C1810" }}>
                    <span>{tr("Total a transferir", "Total a transferir")}</span><span>348,00 €</span>
                  </div>
                </div>

                {/* Pujar justificant */}
                <div className="border-t pt-4" style={{ borderColor: "#C9B89A" }}>
                  <label className="font-mono text-[10px] uppercase tracking-[0.16em] font-semibold block mb-2" style={{ color: "#8A5526" }}>{tr("Pujar justificant de transferència", "Subir justificante de transferencia")}</label>
                  {uploadedFile ? (
                    <div className="flex items-center justify-between p-3 border" style={{ borderColor: "#B87333", background: "rgba(184,115,51,0.06)" }}>
                      <span className="text-sm text-primary">{uploadedFile}</span>
                      <button onClick={() => setUploadedFile(null)} className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "#8A5526" }}>✕ {tr("Treure", "Quitar")}</button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed cursor-pointer" style={{ borderColor: "#C9B89A", background: "#F5EFE6" }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8B7355" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <span className="text-sm" style={{ color: "#8B7355" }}>{tr("Arrossega el fitxer aquí o fes clic per seleccionar", "Arrastra el archivo aquí o haz clic para seleccionar")}</span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.14em]" style={{ color: "#8B7355" }}>PDF, JPG, PNG · {tr("màx 10 MB", "máx 10 MB")}</span>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => { if (e.target.files?.[0]) setUploadedFile(e.target.files[0].name); }} />
                    </label>
                  )}
                </div>

                <button disabled={!uploadedFile} className="w-full py-3.5 text-sm font-semibold text-white disabled:opacity-50" style={{ background: "#B87333" }}>
                  {uploadedFile ? tr("Enviar justificant", "Enviar justificante") : tr("Puja el justificant per continuar", "Sube el justificante para continuar")}
                </button>
                <p className="text-xs text-center" style={{ color: "#8B7355" }}>{tr("El justificant es guardarà a la nostra base de dades per a la seva revisió.", "El justificante se guardará en nuestra base de datos para su revisión.")}</p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
      <PreusDialog open={preusOpen} onOpenChange={setPreusOpen} onOpenRegister={() => openAuth("register")} />
    </div>
  );
}
