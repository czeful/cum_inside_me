import { useState, useEffect } from "react";
import { searchUsers, sendFriendRequest, getMyProfile } from "../services/friends";
import Navbar  from "../components/Navbar";

const FindFriends = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [myId, setMyId] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingId, setSendingId] = useState(null);
  const [successId, setSuccessId] = useState(null);

  // Получить свой id (чтобы не показывать себя)
  useEffect(() => {
    getMyProfile().then((res) => setMyId(res.data.ID));
  }, []);

  // Поиск пользователей
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await searchUsers(search);
      setUsers(res.data);
    } catch (err) {
      alert("Ошибка поиска пользователей");
    }
    setLoading(false);
  };

  // Отправка заявки в друзья
  const handleSendRequest = async (userId) => {
    setSendingId(userId);
    try {
      await sendFriendRequest(userId);
      setSuccessId(userId);
    } catch (err) {
      alert("Не удалось отправить заявку: " + (err.response?.data || err.message));
    }
    setSendingId(null);
  };

  return (
    <div>
        <Navbar/>
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-5">Найти друзей</h2>
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          className="flex-1 border px-3 py-2 rounded"
          type="text"
          placeholder="Имя или email пользователя"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Поиск..." : "Искать"}
        </button>
      </form>

      {users.length === 0 && <div className="text-gray-500">Никого не найдено</div>}

      <ul>
        {users
          .filter((u) => u.ID !== myId) // не показываем самого себя
          .map((u) => (
            <li
              key={u.ID}
              className="flex items-center justify-between border-b py-2"
            >
              <div>
                <div className="font-semibold">{u.Username}</div>
                <div className="text-sm text-gray-500">{u.Email}</div>
              </div>
              <button
                className={`ml-4 px-4 py-1 rounded ${
                  successId === u.ID
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                onClick={() => handleSendRequest(u.ID)}
                disabled={sendingId === u.ID || successId === u.ID}
              >
                {successId === u.ID
                  ? "Запрос отправлен"
                  : sendingId === u.ID
                  ? "Отправка..."
                  : "Добавить в друзья"}
              </button>
            </li>
          ))}
      </ul>
    </div>
    </div>
  );
};

export default FindFriends;

