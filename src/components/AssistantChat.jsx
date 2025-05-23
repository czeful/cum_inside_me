import React, { useState, useRef, useEffect } from "react";

// OpenRouter API KEY (замени на свой)
const OPENROUTER_API_KEY = "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"; // Пример: or-xxxxxx...

// Функция для получения имени пользователя, если не передано в пропсах
const getUserName = () => {
  // Пример: если имя сохранено в localStorage
  // Ты можешь заменить на другую логику
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.name || "";
  } catch {
    return "";
  }
};

export default function AssistantChat({ user }) {
  // user: { name: "Имя" } — передавай из своего состояния/контекста/props

const username = user?.name || user?.Name || user?.username || user?.Username || user?.email || user?.Email || getUserName();


  // Показывать виджет только если пользователь есть и имя указано
  if (!username) return null;

  // system prompt для персонализации
  const initialMessages = [
    {
      role: "system",
      content: `Пользователь, с которым ты общаешься, зовут: ${username}. Обращайся к нему по имени и учитывай, что он работает с системой целей.`
    },
    {
      role: "assistant",
      content: `Привет, ${username}! Я твой AI-ассистент. Готов помочь с целями, планированием, шагами или любыми вопросами.`
    }
  ];

  const [open, setOpen] = useState(false); // Открыт или свернут чат
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Скролл вниз при каждом новом сообщении
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Переключение (свернуть/развернуть)
  const handleToggle = () => setOpen(v => !v);

  // Отправка сообщения
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
          model: "openai/gpt-3.5-turbo", // можно заменить на другую модель
          messages: newMessages.map(({ role, content }) => ({ role, content })),
          temperature: 0.7,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        setMessages([...newMessages, { role: "assistant", content: "AI недоступен: " + errorText }]);
      } else {
        const data = await res.json();
        const answer = data.choices?.[0]?.message?.content || "Нет ответа от AI.";
        setMessages([...newMessages, { role: "assistant", content: answer }]);
      }
    } catch (e) {
      setMessages([...newMessages, { role: "assistant", content: "Ошибка: " + e.message }]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Кнопка-иконка — открыть чат */}
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
          title="Открыть AI-ассистент"
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="18" fill="#fff" /><path d="M12 24v-2a4 4 0 0 1 8 0v2" stroke="#32d0ae" strokeWidth="2"/><circle cx="16" cy="14" r="4" stroke="#56b6f8" strokeWidth="2"/><rect x="23" y="18" width="5" height="7" rx="2" fill="#32d0ae"/></svg>
        </button>
      )}
      {/* Сам чат */}
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
              title="Свернуть"
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
              placeholder="Напиши вопрос..."
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
