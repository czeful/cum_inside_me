import axios from "./api";

export const getUserProfile = (id) =>
  axios.get(`/users/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

export const getMyProfile = () =>
  axios.get(`/users/me`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

export const getFriends = () =>
  axios.get(`/friends`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

export const getFriendRequests = () =>
  axios.get(`/friends/requests`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

// ВАЖНО: receiver_id — это _id пользователя, которому отправляешь запрос!
export const sendFriendRequest = (receiver_id) =>
  axios.post(
    `/friends/${receiver_id}/request`,
    {},
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  );

// requestId — это _id запроса, accept — true (принять) или false (отклонить)
export const respondToFriendRequest = (requestId, accept) =>
  axios.post(
    `/friends/requests/${requestId}/respond`,
    { accept },
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  );


// Получить всех пользователей (админский эндпоинт)
export function getAllUsers() {
  return axios.get("/admin/users", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
}

export function searchUsers(query = "") {
  return axios.get(`/users/search${query ? `?query=${encodeURIComponent(query)}` : ""}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
}

export async function removeFriend(id) {
  return axios.delete(`/friends/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
}
