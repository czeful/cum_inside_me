import chatApi from "../services/chat_api";

export function getChat(friendId) {
  return chatApi.get(`/chat/${friendId}`); 
}
