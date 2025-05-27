import api from "./api";

export function getChat(friendId) {
  return api.get(`/chat/${friendId}`); 
}
