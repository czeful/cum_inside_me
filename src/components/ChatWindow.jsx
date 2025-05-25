import { useEffect, useRef, useState } from "react";
import useChatSocket from "../hooks/useChatSocket";
import { getChat } from "../services/chat";
import api from "../services/api";

function formatSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} МБ`;
}

const API_URL = "http://localhost:8080";

export default function ChatWindow({ myId, friend }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [online, setOnline] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [pendingFile, setPendingFile] = useState(null); // {file, previewUrl, type}
  const [pendingAudio, setPendingAudio] = useState(null); // {blob, previewUrl}
  const [playingIdx, setPlayingIdx] = useState(null);
  const bottomRef = useRef(null);
  let typingTimeout = useRef();
  const audioChunks = useRef([]);

  const token = localStorage.getItem("token");
  const wsUrl = `ws://localhost:8080/ws/chat?token=${token}&chat=${friend.id}`;

  // SVG для файла
  const FileIcon = (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="2" width="14" height="20" rx="4" fill="#6ec1e4" />
      <rect x="8" y="6" width="8" height="2" rx="1" fill="#fff" />
      <rect x="8" y="10" width="8" height="2" rx="1" fill="#fff" />
      <rect x="8" y="14" width="5" height="2" rx="1" fill="#fff" />
    </svg>
  );

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
      if (
        ((msg.sender_id === myId && msg.receiver_id === friend.id) ||
          (msg.sender_id === friend.id && msg.receiver_id === myId)) &&
        ["text", "file", "image", "audio"].includes(msg.type)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    },
  });

  useEffect(() => {
    if (friend) {
      getChat(friend.id).then((res) => setMessages(res.data));
    }
    setIsTyping(false);
    setOnline(false);
  }, [friend]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ===== File/Image preview
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const isAudio = file.type.startsWith("audio/");
    const previewUrl = URL.createObjectURL(file);
    setPendingFile({
      file,
      previewUrl,
      type: isImage ? "image" : isAudio ? "audio" : "file",
    });
    e.target.value = "";
  };

  // ===== Голосовое сообщение (запись только в pending, отправка отдельно)
  const startRecording = async () => {
    if (isRecording) return;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new window.MediaRecorder(stream);
    recorder.ondataavailable = (e) => audioChunks.current.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(audioChunks.current, { type: "audio/webm" });
      setPendingAudio({
        blob,
        previewUrl: URL.createObjectURL(blob),
      });
      audioChunks.current = [];
    };
    setMediaRecorder(recorder);
    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  // ====== Отправка всех типов данных только на "Send"
  const handleSend = async (e) => {
    e.preventDefault();
    let sent = false;

    // Сначала — если есть аудиосообщение
    if (pendingAudio) {
      const file = new File([pendingAudio.blob], "voice-message.webm", {
        type: "audio/webm",
      });
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      send({
        type: "audio",
        receiver_id: friend.id,
        fileUrl: res.data.url,
        fileName: res.data.name,
        fileSize: file.size,
        mimeType: file.type,
      });
      setMessages((prev) => [
        ...prev,
        {
          sender_id: myId,
          receiver_id: friend.id,
          type: "audio",
          file_url: res.data.url,
          file_name: res.data.name,
          file_size: file.size,
          mime_type: file.type,
          created_at: new Date().toISOString(),
        },
      ]);
      setPendingAudio(null);
      sent = true;
    }

    // Потом — если есть pendingFile (file/image)
    if (pendingFile) {
      const formData = new FormData();
      formData.append("file", pendingFile.file);
      const res = await api.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      send({
        type: pendingFile.type,
        receiver_id: friend.id,
        fileUrl: res.data.url,
        fileName: res.data.name,
        fileSize: pendingFile.file.size,
        mimeType: pendingFile.file.type,
      });
      setMessages((prev) => [
        ...prev,
        {
          sender_id: myId,
          receiver_id: friend.id,
          type: pendingFile.type,
          file_url: res.data.url,
          file_name: res.data.name,
          file_size: pendingFile.file.size,
          mime_type: pendingFile.file.type,
          created_at: new Date().toISOString(),
        },
      ]);
      setPendingFile(null);
      sent = true;
    }

    // Наконец — если есть текст
    if (text.trim()) {
      send({ type: "text", receiver_id: friend.id, text });
      setMessages((prev) => [
        ...prev,
        {
          sender_id: myId,
          receiver_id: friend.id,
          type: "text",
          text,
          created_at: new Date().toISOString(),
        },
      ]);
      setText("");
      sent = true;
    }

    // Если ничего не было — не отправляем
    if (!sent) return;
  };

  // Typing
  const handleInput = (e) => {
    setText(e.target.value);
    send({ type: "typing", receiver_id: friend.id, typing: true });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      send({ type: "typing", receiver_id: friend.id, typing: false });
    }, 1500);
  };

  const getFullUrl = (fileUrl) => {
    if (!fileUrl) return "";
    if (/^https?:\/\//.test(fileUrl)) return fileUrl;
    return `${API_URL}${fileUrl.startsWith("/") ? "" : "/"}${fileUrl}`;
  };

  // Waveform SVG
  function Waveform() {
    return (
      <svg width="54" height="22" viewBox="0 0 54 22" fill="none">
        <polyline
          points="2,11 7,7 12,11 17,17 22,12 27,7 32,13 37,17 42,12 47,7 52,11"
          stroke="#38bdf8"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white/80 rounded-3xl shadow-lg border border-slate-100 p-6">
      {/* Header */}
      <div className="flex flex-col mb-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <span
            className={`w-3 h-3 rounded-full ${
              online ? "bg-emerald-400" : "bg-gray-300"
            } mr-2`}
            title={online ? "Online" : "Offline"}
          ></span>
          <span className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-200 to-teal-200 flex items-center justify-center text-lg font-bold text-slate-700 shadow">
            {String(friend.id).slice(0, 2).toUpperCase()}
          </span>
          <span className="font-bold text-lg text-slate-700 truncate">
            {friend.id}
          </span>
        </div>
        {isTyping && (
          <div className="ml-14 mt-1 text-teal-500 animate-pulse text-sm font-medium">
            печатает...
          </div>
        )}
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scroll">
        {(messages || []).map((m, idx) => (
          <div
            key={idx}
            className={`mb-2 flex ${
              m.sender_id === myId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`
              max-w-[80%] px-4 py-2 rounded-2xl shadow
              ${
                m.sender_id === myId
                  ? "bg-gradient-to-tr from-teal-200 to-sky-100 text-slate-900 ml-8"
                  : "bg-slate-100 text-slate-700 mr-8"
              }
              relative
            `}
            >
              {/* === Изображения === */}
              {m.type === "image" || m.mime_type?.startsWith("image/") ? (
                <a
                  href={getFullUrl(m.file_url || m.fileUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={getFullUrl(m.file_url || m.fileUrl)}
                    alt={m.file_name || "image"}
                    style={{
                      maxWidth: 220,
                      maxHeight: 170,
                      borderRadius: "10px",
                      boxShadow: "0 2px 8px #0002",
                    }}
                    className="mb-1"
                  />
                </a>
              ) : m.type === "audio" || m.mime_type?.startsWith("audio/") ? (
                <div className="flex items-center gap-2 px-2 py-2 rounded-xl bg-gradient-to-tr from-sky-50 to-emerald-50 border border-emerald-100 shadow-inner">
                  <button
                    className="w-8 h-8 bg-emerald-200 hover:bg-emerald-300 rounded-full flex items-center justify-center text-lg font-bold"
                    onClick={() => {
                      if (playingIdx === idx) {
                        setPlayingIdx(null);
                        document.getElementById(`audio_${idx}`)?.pause();
                      } else {
                        setPlayingIdx(idx);
                        document.getElementById(`audio_${idx}`)?.play();
                      }
                    }}
                  >
                    {playingIdx === idx ? (
                      <svg
                        width="18"
                        height="18"
                        fill="none"
                        stroke="#098"
                        strokeWidth="2"
                      >
                        <rect x="4" y="4" width="4" height="10" rx="1.5" />
                        <rect x="10" y="4" width="4" height="10" rx="1.5" />
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        fill="none"
                        stroke="#098"
                        strokeWidth="2"
                      >
                        <polygon points="4,3 16,9 4,15" fill="#098" />
                      </svg>
                    )}
                  </button>
                  <audio
                    id={`audio_${idx}`}
                    controls={false}
                    src={getFullUrl(m.file_url || m.fileUrl)}
                    onEnded={() => setPlayingIdx(null)}
                    style={{
                      width: 90,
                      minWidth: 70,
                      verticalAlign: "middle",
                      display: "none",
                    }}
                  />
                  <Waveform />
                  <a
                    href={getFullUrl(m.file_url || m.fileUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={m.file_name || m.fileName}
                    className="ml-1 text-xs text-emerald-700 hover:underline"
                    title="Скачать голосовое"
                  >
                    ⬇️
                  </a>
                </div>
              ) : m.type === "file" || m.file_url ? (
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0">{FileIcon}</span>
                  <div className="flex flex-col">
                    <a
                      href={getFullUrl(m.file_url || m.fileUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-700 font-semibold hover:underline break-all"
                      download={m.file_name || m.fileName}
                    >
                      {m.file_name || m.fileName}
                    </a>
                    {m.file_size && (
                      <span className="text-xs text-slate-500">
                        {formatSize(m.file_size)}
                      </span>
                    )}
                    <a
                      href={getFullUrl(m.file_url || m.fileUrl)}
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
                {new Date(m.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
        {/* ===== Preview pending file/audio before send */}
        {(pendingFile || pendingAudio) && (
          <div className="mb-2 flex justify-end">
            <div className="bg-slate-100 text-slate-700 px-4 py-2 rounded-2xl border-2 border-dashed border-teal-300 max-w-[70%] flex flex-col gap-2 shadow">
              {/* Image preview */}
              {pendingFile && pendingFile.type === "image" && (
                <img
                  src={pendingFile.previewUrl}
                  style={{ maxWidth: 160, borderRadius: 8 }}
                  alt="Preview"
                />
              )}
              {/* Audio preview */}
              {pendingAudio && (
                <div className="flex items-center gap-2">
                  <audio
                    src={pendingAudio.previewUrl}
                    controls
                    style={{ width: 120 }}
                  />
                  <Waveform />
                </div>
              )}
              {/* File preview */}
              {pendingFile && pendingFile.type === "file" && (
                <div className="flex items-center gap-2">
                  {FileIcon}
                  <span className="font-medium">{pendingFile.file.name}</span>
                  <span className="text-xs text-slate-500">
                    {formatSize(pendingFile.file.size)}
                  </span>
                </div>
              )}
              {/* Audio preview (for file as audio) */}
              {pendingFile && pendingFile.type === "audio" && (
                <div className="flex items-center gap-2">
                  <audio
                    src={pendingFile.previewUrl}
                    controls
                    style={{ width: 120 }}
                  />
                  <Waveform />
                  <span className="text-xs text-slate-500">
                    {formatSize(pendingFile.file.size)}
                  </span>
                </div>
              )}
              <span className="text-xs text-emerald-600">
                Нажмите "Send" для отправки
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      {/* Input + file + voice */}
      <form onSubmit={handleSend} className="flex items-center gap-2 mt-3">
        <label className="cursor-pointer px-2 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 transition text-teal-600 font-bold shadow inline-flex items-center">
          <input
            type="file"
            className="hidden"
            onChange={handleFile}
            accept="image/*,audio/*,.pdf,.doc,.docx,.txt"
          />
          <span className="text-xl">📎</span>
        </label>
        <button
          type="button"
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          className={`px-2 py-2 rounded-xl ${
            isRecording
              ? "bg-orange-300 text-white"
              : "bg-orange-100 text-orange-800"
          } font-bold shadow ml-2 transition`}
          title="Записать голосовое (зажать, потом Send)"
        >
          {isRecording ? "◉" : "🎤"}
        </button>
        <input
          value={text}
          onChange={handleInput}
          className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 shadow-inner bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition"
          placeholder="Type a message..."
          disabled={isRecording}
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
