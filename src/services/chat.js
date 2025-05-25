import api from "./api";

// Получить историю сообщений с конкретным другом
export function getChat(friendId) {
  return api.get(`/chat/${friendId}`); // если ты реализовал GET /chat/{friendId} (REST, не ws)
}
