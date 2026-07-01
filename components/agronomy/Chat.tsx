"use client";

import { useRef, useState, type FormEvent } from "react";
import Citation, { type Source } from "./Citation";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
};

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const conversationId = useRef<string | null>(null);

  /** Update the in-progress assistant message (always the last entry). */
  function updateLast(fn: (m: ChatMessage) => ChatMessage) {
    setMessages((prev) => {
      if (prev.length === 0) return prev;
      const copy = prev.slice();
      copy[copy.length - 1] = fn(copy[copy.length - 1]);
      return copy;
    });
  }

  function handleEvent(raw: string) {
    let event = "message";
    let data = "";
    for (const line of raw.split("\n")) {
      if (line.startsWith("event:")) event = line.slice(6).trim();
      else if (line.startsWith("data:")) data += line.slice(5).trim();
    }
    if (!data) return;
    let parsed: unknown;
    try {
      parsed = JSON.parse(data);
    } catch {
      return;
    }

    if (event === "meta") {
      const id = (parsed as { conversationId?: string }).conversationId;
      if (id) conversationId.current = id;
    } else if (event === "sources") {
      const sources = parsed as Source[];
      updateLast((m) => ({ ...m, sources }));
    } else if (event === "token") {
      const text = (parsed as { text?: string }).text ?? "";
      updateLast((m) => ({ ...m, content: m.content + text }));
    } else if (event === "error") {
      setError((parsed as { message?: string }).message ?? "Something went wrong.");
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = input.trim();
    if (!q || busy) return;
    setError(null);
    setBusy(true);
    setInput("");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: q },
      { role: "assistant", content: "" },
    ]);

    try {
      const res = await fetch("/api/agronomy/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: conversationId.current,
          message: q,
        }),
      });
      if (!res.ok || !res.body) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error ?? "Request failed.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buffer.indexOf("\n\n")) !== -1) {
          handleEvent(buffer.slice(0, idx));
          buffer = buffer.slice(idx + 2);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex h-[68vh] flex-col overflow-hidden rounded-xl border border-cmd-line bg-cmd-surface">
      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined text-cmd-accent-dim" style={{ fontSize: 32 }}>
              forum
            </span>
            <p className="mt-3 max-w-md text-body-md text-cmd-muted">
              Ask a question about your documents — e.g.{" "}
              <span className="text-cmd-text">
                &ldquo;What&apos;s the re-entry interval for this product?&rdquo;
              </span>{" "}
              Answers are grounded in your uploaded files and cite their sources.
            </p>
          </div>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] rounded-2xl rounded-br-sm bg-cmd-accent px-4 py-3 text-body-md text-cmd-on-accent"
                    : "max-w-[85%] rounded-2xl rounded-bl-sm border border-cmd-line bg-cmd-surface2 px-4 py-3 text-body-md text-cmd-text"
                }
              >
                <p className="whitespace-pre-wrap">
                  {m.content ||
                    (m.role === "assistant" && busy ? (
                      <span className="font-mono text-cmd-muted">thinking…</span>
                    ) : (
                      ""
                    ))}
                </p>
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 border-t border-cmd-line pt-3">
                    {m.sources.map((s) => (
                      <Citation key={s.marker} source={s} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {error && (
          <p className="rounded-lg border border-cmd-danger/30 bg-cmd-danger/10 px-3 py-2 text-body-md text-cmd-danger">
            {error}
          </p>
        )}
      </div>

      <form
        onSubmit={onSubmit}
        className="flex items-center gap-3 border-t border-cmd-line bg-cmd-bg/40 p-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your documents…"
          className="flex-1 rounded-full border border-cmd-line bg-cmd-bg px-4 py-2.5 text-body-md text-cmd-text placeholder:text-cmd-muted focus:border-cmd-accent focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="inline-flex items-center gap-2 rounded-full bg-cmd-accent px-6 py-2.5 text-label-md text-cmd-on-accent transition-all hover:bg-cmd-accent-strong disabled:pointer-events-none disabled:opacity-50"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            send
          </span>
          {busy ? "…" : "Send"}
        </button>
      </form>
    </div>
  );
}
