import React, { useState, useRef, useEffect } from "react";

// OpenRouter API KEY (replace with your own)
const OPENROUTER_API_KEY = "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";

// Function to get the username if not passed as prop
const getUserName = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.name || "";
  } catch {
    return "";
  }
};

export default function AssistantChat({ user }) {
  // user: { name: "Name" } — pass from your state/context/props

  const username = user?.name || user?.Name || user?.username || user?.Username || user?.email || user?.Email || getUserName();

  // Show widget only if user and username exist
  if (!username) return null;

  // system prompt for personalization
  const initialMessages = [
    {
      role: "system",
      content: `The user's name is: ${username}. Address them by name and remember they're working with a goals management system. You need to help him choose correct steps and help him to find correct literature`
    },
    {
      role: "assistant",
      content: `Hello, ${username}! I am your AI assistant. Ready to help with your goals, planning, steps, or any questions.`
    }
  ];

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll on every new message or open
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Open/close chat
  const handleToggle = () => setOpen(v => !v);

  // Send message
  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": window.location.origin + "/",
          "X-Title": "AchievementManager"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: newMessages.map(({ role, content }) => ({ role, content })),
          temperature: 0.7,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        setMessages([...newMessages, { role: "assistant", content: "AI unavailable: " + errorText }]);
      } else {
        const data = await res.json();
        const answer = data.choices?.[0]?.message?.content || "No response from AI.";
        setMessages([...newMessages, { role: "assistant", content: answer }]);
      }
    } catch (e) {
      setMessages([...newMessages, { role: "assistant", content: "Error: " + e.message }]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Icon button — open chat */}
      {!open && (
        <button
          onClick={handleToggle}
          style={{
            position: "fixed", bottom: 24, right: 24,
            zIndex: 9999,
            background: "linear-gradient(90deg,#32d0ae,#56b6f8)",
            border: "none", borderRadius: "50%",
            width: 60, height: 60,
            boxShadow: "0 4px 32px #0003",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
          }}
          title="Open AI Assistant"
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="18" fill="#fff" /><path d="M12 24v-2a4 4 0 0 1 8 0v2" stroke="#32d0ae" strokeWidth="2"/><circle cx="16" cy="14" r="4" stroke="#56b6f8" strokeWidth="2"/><rect x="23" y="18" width="5" height="7" rx="2" fill="#32d0ae"/></svg>
        </button>
      )}
      {/* Chat window */}
      {open && (
        <div style={{
          position: "fixed",
          bottom: 24, right: 24,
          width: 360,
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 4px 32px #0002",
          border: "1px solid #e6eaf1",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}>
          <div style={{
            background: "linear-gradient(90deg, #32d0ae 0%, #56b6f8 100%)",
            color: "#fff",
            padding: "16px 20px",
            fontWeight: "bold",
            fontSize: "18px",
            borderBottom: "1px solid #e6eaf1",
            display: "flex", alignItems: "center", justifyContent: "space-between"
          }}>
            <span>AI Assistant</span>
            <button
              onClick={handleToggle}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                fontSize: 24,
                cursor: "pointer",
                marginLeft: 12,
                lineHeight: 1
              }}
              title="Minimize"
            >
              ×
            </button>
          </div>
          <div style={{
            padding: 16,
            minHeight: 220,
            maxHeight: 300,
            overflowY: "auto",
            background: "#f8fafb"
          }}>
            {messages.filter(msg => msg.role !== "system").map((msg, i) => (
              <div key={i} style={{
                textAlign: msg.role === "assistant" ? "left" : "right",
                margin: "10px 0"
              }}>
                <span style={{
                  display: "inline-block",
                  background: msg.role === "assistant" ? "#f1f5fb" : "#d9f3ee",
                  color: "#262c38",
                  borderRadius: 12,
                  padding: "9px 15px",
                  maxWidth: 240,
                  fontSize: "15px",
                  boxShadow: "0 1px 4px #0001"
                }}>
                  {msg.content}
                </span>
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>
          <div style={{ borderTop: "1px solid #e6eaf1", display: "flex", padding: "12px 12px" }}>
            <input
              type="text"
              value={input}
              placeholder="Type your question..."
              disabled={loading}
              style={{
                flex: 1,
                padding: "10px 14px",
                border: "1px solid #dbeafe",
                borderRadius: 8,
                fontSize: 15,
                marginRight: 8,
                outline: "none",
                background: "#fff"
              }}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !loading && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                background: "linear-gradient(90deg, #32d0ae 0%, #56b6f8 100%)",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "16px",
                padding: "0 20px",
                border: "none",
                borderRadius: 8,
                cursor: loading ? "default" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "opacity .2s"
              }}>
              {loading ? "..." : "➤"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
