"use client";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<{role: string; content: string}[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMsg = { role: "assistant", content: "" };
      setMessages((prev) => [...prev, assistantMsg]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantMsg.content += decoder.decode(value);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...assistantMsg };
          return updated;
        });
      }
    } catch (e) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Error: Failed to connect." }]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <header className="border-b border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <span className="text-2xl">✈️</span>
          <h1 className="text-xl font-bold" style={{ color: "#3fb950" }}>ContextFlow Travel</h1>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-4 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <span className="text-6xl">✈️</span>
            <h2 className="text-2xl font-bold text-white">ContextFlow Travel</h2>
            <p className="text-gray-400 text-center max-w-md">Travel planning assistant with itinerary generation, visa docs, and destination research.</p>
            <div className="grid grid-cols-2 gap-3 mt-4">
                            <button style={{ borderColor: "#3fb950", color: "#3fb950" }} className="px-4 py-2 border rounded-lg hover:bg-white/5 transition-colors text-sm">Itinerary Planner</button>
              <button style={{ borderColor: "#3fb950", color: "#3fb950" }} className="px-4 py-2 border rounded-lg hover:bg-white/5 transition-colors text-sm">Visa Requirements</button>
              <button style={{ borderColor: "#3fb950", color: "#3fb950" }} className="px-4 py-2 border rounded-lg hover:bg-white/5 transition-colors text-sm">Hotel Comparison</button>
              <button style={{ borderColor: "#3fb950", color: "#3fb950" }} className="px-4 py-2 border rounded-lg hover:bg-white/5 transition-colors text-sm">Flight Analysis</button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-xl px-4 py-3 ${msg.role === "user" ? "bg-white/10" : "bg-white/5 border border-white/10"}`}>
                  <pre className="whitespace-pre-wrap text-sm">{msg.content}</pre>
                </div>
              </div>
            ))}
            {loading && <div className="text-gray-500 text-sm">Thinking...</div>}
          </div>
        )}

        <div className="border-t border-white/10 pt-4">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about your documents..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/30"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{ backgroundColor: loading ? "#333" : "#3fb950" }}
              className="px-6 py-3 rounded-xl text-black font-semibold text-sm disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 p-3 text-center text-xs text-gray-600">
        ContextFlow Travel — Powered by ContextFlow RAG Engine
      </footer>
    </div>
  );
}
