import { useState, useEffect } from "react";
import axios from "../services/api";

// Пропс friendIds — массив ID друзей
function CollaboratorInvite({ goalId, onInvite, friendIds }) {
  const [friends, setFriends] = useState([]);
  const [query, setQuery] = useState("");
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Получаем подробную информацию о друзьях по их ID
  useEffect(() => {
    if (!friendIds || friendIds.length === 0) {
      setFriends([]);
      return;
    }
    axios
      .get(`/users/by-ids?ids=${friendIds.join(",")}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setFriends(res.data || []))
      .catch(() => setFriends([]));
  }, [friendIds]);

  const handleSearch = () => {
    const q = query.trim().toLowerCase();
    setFilteredFriends(
      friends.filter(
        (u) =>
          (u.Username && u.Username.toLowerCase().includes(q)) ||
          (u.Email && u.Email.toLowerCase().includes(q))
      )
    );
  };

  const handleInvite = async (userId) => {
    setLoading(true);
    setMessage("");
    try {
      await axios.post(
        `/goals/${goalId}/invite`,
        { collaborator_id: userId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setMessage("Invited!");
      setFilteredFriends([]);
      setQuery("");
      if (onInvite) onInvite();
    } catch (e) {
      setMessage("Ошибка приглашения.");
    }
    setLoading(false);
  };

  return (
    <div className="mb-6 mt-8 p-4 rounded-xl border border-blue-100 bg-blue-50">
      <h4 className="font-semibold mb-2">Invite a Friend</h4>
      <div className="flex gap-2">
        <input
          className="w-full rounded-lg px-3 py-2 border border-blue-200 bg-white"
          placeholder="Search friend by name or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="button"
          className="btn-primary px-3"
          onClick={handleSearch}
          disabled={loading || !query.trim()}
        >
          Search
        </button>
      </div>
      {message && <div className="mt-2 text-sm text-blue-600">{message}</div>}
      <ul className="mt-3 space-y-1">
        {filteredFriends.map((u) => (
          <li key={u._id || u.ID} className="flex justify-between items-center bg-white p-2 rounded">
            <span>{u.Username || u.Email}</span>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => handleInvite(u._id || u.ID)}
              disabled={loading}
            >
              Invite
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CollaboratorInvite;

