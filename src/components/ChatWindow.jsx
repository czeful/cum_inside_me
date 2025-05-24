import { useEffect, useRef, useState } from "react";
import useChatSocket from "../hooks/useChatSocket";
import { getChat } from "../services/chat";
import api from "../services/api";

// helper для формата размера файла
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} МБ`;
}

export default function ChatWindow({ myId, friend }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [online, setOnline] = useState(false);
  const bottomRef = useRef(null);

  const token = localStorage.getItem("token");
  const wsUrl = `ws://localhost:8080/ws/chat?token=${token}&chat=${friend.id}`;
  let typingTimeout = useRef();

  const send = useChatSocket({
    chatUrl: wsUrl,
    onMessage: (msg) => {
      if (msg.type === "typing" && msg.sender_id === friend.id) {
        setIsTyping(msg.typing);
        return;
      }
      if (msg.type === "status" && msg.userId === friend.id) {
        setOnline(msg.status === "online");
        return;
      }
      // Сообщения чата (text/file)
      if (
        ((msg.sender_id === myId && msg.receiver_id === friend.id) ||
          (msg.sender_id === friend.id && msg.receiver_id === myId)) &&
        (msg.type === "text" || msg.type === "file")
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    }
  });

  // Загрузка истории сообщений
  useEffect(() => {
    if (friend) {
      getChat(friend.id).then(res => setMessages(res.data));
    }
    setIsTyping(false);
    setOnline(false);
  }, [friend]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // === Отправка текста ===
  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    send({ type: "text", receiver_id: friend.id, text });
    setMessages(prev => [
      ...prev,
      {
        sender_id: myId,
        receiver_id: friend.id,
        type: "text",
        text,
        created_at: new Date().toISOString(),
      }
    ]);
    setText("");
  };

  // === Typing (печатает...) ===
  const handleInput = (e) => {
    setText(e.target.value);
    send({ type: "typing", receiver_id: friend.id, typing: true });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      send({ type: "typing", receiver_id: friend.id, typing: false });
    }, 1500);
  };

  // === File upload ===
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // 1. Отправить файл через REST /api/upload
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    // 2. Отправить ws-сообщение типа file
    send({
      type: "file",
      receiver_id: friend.id,
      fileUrl: res.data.url,
      fileName: res.data.name,
      fileSize: file.size,
    });
    // 3. Добавить себе в messages для мгновенного UI
    setMessages(prev => [
      ...prev,
      {
        sender_id: myId,
        receiver_id: friend.id,
        type: "file",
        file_url: res.data.url,
        file_name: res.data.name,
        file_size: file.size,
        created_at: new Date().toISOString(),
      }
    ]);
    e.target.value = "";
  };

  // Иконка файла (telegram-style, SVG)
  const FileIcon = (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="2" width="14" height="20" rx="4" fill="#6ec1e4" />
      <rect x="8" y="6" width="8" height="2" rx="1" fill="#fff" />
      <rect x="8" y="10" width="8" height="2" rx="1" fill="#fff" />
      <rect x="8" y="14" width="5" height="2" rx="1" fill="#fff" />
    </svg>
  );

  return (
    <div className="flex flex-col h-full bg-white/80 rounded-3xl shadow-lg border border-slate-100 p-6">
      {/* Chat header */}
      <div className="flex flex-col mb-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <span className={`w-3 h-3 rounded-full ${online ? "bg-emerald-400" : "bg-gray-300"} mr-2`} title={online ? "Online" : "Offline"}></span>
          <span className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-200 to-teal-200 flex items-center justify-center text-lg font-bold text-slate-700 shadow">
            {String(friend.id).slice(0, 2).toUpperCase()}
          </span>
          <span className="font-bold text-lg text-slate-700 truncate">{friend.id}</span>
        </div>
        {isTyping && (
          <div className="ml-14 mt-1 text-teal-500 animate-pulse text-sm font-medium">печатает...</div>
        )}
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scroll">
        {messages.map((m, idx) => (
          <div key={idx} className={`mb-2 flex ${m.sender_id === myId ? "justify-end" : "justify-start"}`}>
            <div className={`
              max-w-[80%] px-4 py-2 rounded-2xl shadow
              ${m.sender_id === myId
                ? "bg-gradient-to-tr from-teal-200 to-sky-100 text-slate-900 ml-8"
                : "bg-slate-100 text-slate-700 mr-8"
              }
              relative
            `}>
              {/* Телеграм-стиль для файлов */}
              {(m.type === "file" || m.file_url) ? (
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0">{FileIcon}</span>
                  <div className="flex flex-col">
                    <a
                      href={m.file_url || m.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-700 font-semibold hover:underline break-all"
                      download={m.file_name || m.fileName}
                    >
                      {m.file_name || m.fileName}
                    </a>
                    {m.file_size &&
                      <span className="text-xs text-slate-500">{formatSize(m.file_size)}</span>
                    }
                    <a
                      href={m.file_url || m.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-xs text-emerald-700 mt-1 hover:underline font-bold"
                      download={m.file_name || m.fileName}
                    >
                      Скачать
                    </a>
                  </div>
                </div>
              ) : (
                m.text
              )}
              <div className="text-[10px] text-slate-400 mt-1 text-right">
                {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      {/* Input + file */}
      <form onSubmit={handleSend} className="flex items-center gap-2 mt-3">
        <label className="cursor-pointer px-2 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 transition text-teal-600 font-bold shadow inline-flex items-center">
          <input
            type="file"
            className="hidden"
            onChange={handleFile}
          />
          <span className="text-xl">📎</span>
        </label>
        <input
          value={text}
          onChange={handleInput}
          className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 shadow-inner bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition"
          placeholder="Type a message..."
        />
        <button
          className="px-5 py-2 rounded-2xl bg-gradient-to-tr from-teal-300 to-sky-200 text-slate-700 font-bold shadow hover:scale-105 transition"
          type="submit"
        >
          <span className="hidden md:inline">Send</span>
          <span className="md:hidden">➤</span>
        </button>
      </form>
    </div>
  );
}
