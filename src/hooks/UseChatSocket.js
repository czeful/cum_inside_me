import { useEffect, useRef } from "react";

export default function useChatSocket({ chatUrl, onMessage }) {
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new window.WebSocket(chatUrl);

    ws.current.onopen = () => {
      console.log("WebSocket OPEN:", chatUrl);
    };
    ws.current.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (onMessage) onMessage(msg);
      } catch (e) {
        console.log("WebSocket message parse error", e);
      }
    };
    ws.current.onerror = (e) => {
      console.log("WebSocket ERROR", e);
    };
    ws.current.onclose = (e) => {
      console.log("WebSocket CLOSE", e);
    };

    return () => {
      if (ws.current && ws.current.readyState === 1) {
        ws.current.close();
      }
    };
    // Не включаем onMessage в зависимости!
  }, [chatUrl]);

  const send = (msgObj) => {
    if (ws.current && ws.current.readyState === 1) {
      ws.current.send(JSON.stringify(msgObj));
    } else {
      console.warn("WebSocket is not open. Message not sent.", msgObj);
    }
  };

  return send;
}
