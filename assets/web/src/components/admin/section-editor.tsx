"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { supabase } from "@/lib/supabase";

/**
 * Editor WYSIWYG de seccions (Fase 3 CMS).
 * - Edició in-place: negretes, cursives, enllaços, llistes, subtítols.
 * - Pujada d'imatges per botó o arrossegant-les dins l'editor
 *   (es guarden a Supabase Storage, bucket públic 'media').
 * - Estil coherent amb la web: serif per al cos, mateixa paleta.
 */

export function SectionEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const latestChange = useRef(onChange);
  latestChange.current = onChange;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [3] } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
      Image.configure({ inline: false }),
      Placeholder.configure({ placeholder: placeholder ?? "Escriu aquí…" }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "pages-wysiwyg",
      },
      handleDrop: (_view, event, _slice, moved) => {
        const files = Array.from(event.dataTransfer?.files ?? []);
        const img = files.find((f) => f.type.startsWith("image/"));
        if (!img) return false;
        event.preventDefault();
        void uploadImage(img);
        return true;
      },
      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.files ?? []);
        const img = files.find((f) => f.type.startsWith("image/"));
        if (!img) return false;
        event.preventDefault();
        void uploadImage(img);
        return true;
      },
    },
  });

  // Sincronitza canvis de fora (canvi d'idioma) → editor
  useEffect(() => {
    if (editor && value !== editor.getHTML() && document.activeElement?.closest(".pages-wysiwyg") === null) {
      editor.commands.setContent(value || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (!editor) return;
    const handler = () => latestChange.current(editor.getHTML());
    editor.on("update", handler);
    return () => {
      editor.off("update", handler);
    };
  }, [editor]);

  const uploadImage = useCallback(
    async (file: File) => {
      if (!editor) return;
      setUploadErr(null);
      if (file.size > 5 * 1024 * 1024) {
        setUploadErr("La imatge pesa més de 5MB");
        return;
      }
      setUploading(true);
      try {
        const ext = (file.name.split(".").pop() || "png").toLowerCase();
        const name = `pages/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error } = await supabase.storage.from("media").upload(name, file, {
          contentType: file.type,
          upsert: false,
        });
        if (error) throw error;
        const { data } = supabase.storage.from("media").getPublicUrl(name);
        editor.chain().focus().setImage({ src: data.publicUrl }).run();
      } catch (e) {
        setUploadErr(e instanceof Error ? e.message : "Error pujant la imatge");
      } finally {
        setUploading(false);
      }
    },
    [editor]
  );

  if (!editor) return null;

  const btn =
    "px-2 py-1 rounded font-mono text-[10px] uppercase tracking-wider border";
  const btnOff = "border-transparent text-[var(--ink-soft)] hover:bg-black/5";
  const btnOn = "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10";

  return (
    <div className="rounded-md border" style={{ borderColor: "#D8E2DA" }}>
      {/* Barra d'eines */}
      <div className="flex flex-wrap items-center gap-1 border-b px-2 py-1.5" style={{ borderColor: "#D8E2DA", background: "#F7FAF7" }}>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${btn} ${editor.isActive("bold") ? btnOn : btnOff}`}
          title="Negreta"
        >
          <b>B</b>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${btn} italic ${editor.isActive("italic") ? btnOn : btnOff}`}
          title="Cursiva"
        >
          <i>C</i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`${btn} ${editor.isActive("heading", { level: 3 }) ? btnOn : btnOff}`}
          title="Subtítol"
        >
          H
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${btn} ${editor.isActive("bulletList") ? btnOn : btnOff}`}
          title="Llista"
        >
          •≡
        </button>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt("URL de l'enllaç:");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          className={`${btn} ${editor.isActive("link") ? btnOn : btnOff}`}
          title="Enllaç"
        >
          🔗
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className={`${btn} ${btnOff}`}
          title="Imatge (també pots arrossegar-la dins l'editor)"
        >
          🖼 {uploading ? "…" : "Imatge"}
        </button>
        {editor.isActive("link") && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className={`${btn} ${btnOff}`}
            title="Treure enllaç"
          >
            ✕🔗
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void uploadImage(f);
            e.target.value = "";
          }}
        />
        {uploadErr && (
          <span className="ml-2 font-mono text-[10px]" style={{ color: "#A0522D" }}>
            {uploadErr}
          </span>
        )}
      </div>

      {/* Àrea editable */}
      <EditorContent editor={editor} className="px-4 py-3" />
      <p className="px-4 pb-2 font-mono text-[9px] uppercase tracking-[0.14em]" style={{ color: "#8AA093" }}>
        Imatges: arrossega-les dins l&apos;editor o clica 🖼 · màx 5MB
      </p>
    </div>
  );
}
