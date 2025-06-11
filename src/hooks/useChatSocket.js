// import { useEffect, useRef } from "react";

// export default function useChatSocket({ chatUrl, onMessage }) {
//   const ws = useRef(null);

//   useEffect(() => {
//     ws.current = new window.WebSocket(chatUrl);

//     ws.current.onopen = () => {
//       console.log("WebSocket OPEN:", chatUrl);
//     };
//     ws.current.onmessage = (event) => {
//       try {
//         const msg = JSON.parse(event.data);
//         if (onMessage) onMessage(msg);
//       } catch (e) {
//         console.log("WebSocket message parse error", e);
//       }
//     };
//     ws.current.onerror = (e) => {
//       console.log("WebSocket ERROR", e);
//     };
//     ws.current.onclose = (e) => {
//       console.log("WebSocket CLOSE", e);
//     };

//     return () => {
//       if (ws.current && ws.current.readyState === 1) {
//         ws.current.close();
//       }
//     };
//   }, [chatUrl]);

//   const send = (msgObj) => {
//     if (ws.current && ws.current.readyState === 1) {
//       ws.current.send(JSON.stringify(msgObj));
//     } else {
//       console.warn("WebSocket is not open. Message not sent.", msgObj);
//     }
//   };

//   return send;
// }
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

/**
 * useChatSocket — универсальный хук для работы с чатом через Socket.io
 * @param {string} chatUrl — адрес микросервиса чата (например, "http://localhost:4000")
 * @param {string} token — JWT токен пользователя (для auth)
 * @param {function} onMessage — обработчик входящих сообщений
 */
export default function useChatSocket({ chatUrl, token, onMessage }) {
  const socketRef = useRef(null);

  useEffect(() => {
    // Создаём новое подключение
    const socket = io(chatUrl, {
      auth: { token },
      reconnection: true, // авто-реконнект при обрыве
      // transports: ["websocket"], // (не обязательно, если всё норм)
    });
    socketRef.current = socket;

    // Логи для дебага
    socket.on("connect", () => console.log("[SOCKET] Подключено:", socket.id));
    socket.on("disconnect", () => console.log("[SOCKET] Отключено:", socket.id));
    socket.on("connect_error", (err) => console.log("[SOCKET] Ошибка:", err));

    // Сообщения
    socket.on("message", (msg) => {
      // Для стабильности ловим ошибки
      try {
        onMessage && onMessage(msg);
      } catch (e) {
        console.error("[SOCKET] Ошибка в обработчике onMessage:", e);
      }
    });

    // Чистим сокет при размонтировании
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("message");
      socket.disconnect();
    };
  }, [chatUrl, token, onMessage]);

  // Функция для отправки сообщений через сокет
  const send = (msgObj) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("message", msgObj);
    } else {
      console.warn("[SOCKET] Попытка отправки, но сокет не подключён.");
    }
  };

  return send;
}
