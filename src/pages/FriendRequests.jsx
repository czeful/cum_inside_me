import { useEffect, useState } from "react";
import {
  getFriendRequests,
  respondToFriendRequest,
} from "../services/friends";

import Navbar from "../components/Navbar";

const FriendRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getFriendRequests();
        setRequests(res.data || []); // fallback для null
      } catch (e) {
        setRequests([]); // если ошибка — показывать пустой массив
      }
    };
    fetchRequests();
  }, []);

  const accept = async (id) => {
    await respondToFriendRequest(id, true);
    setRequests(requests.filter(r => r.id !== id && r._id !== id));
  };

  const reject = async (id) => {
    await respondToFriendRequest(id, false);
    setRequests(requests.filter(r => r.id !== id && r._id !== id));
  };

  // Сначала подстрахуемся с ключами и id
  const safeRequests = requests || [];

  return (
    <div>
        <Navbar/>
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Заявки в друзья</h2>
      {safeRequests.length === 0 ? <div>Нет заявок</div> : (
        <ul>
          {safeRequests.map(req => (
            <li key={req._id || req.id} className="mb-3 flex justify-between">
              <span>{req.sender_id}</span>
              <div>
                <button className="btn-primary mr-2" onClick={() => accept(req._id || req.id)}>Принять</button>
                <button className="btn-secondary" onClick={() => reject(req._id || req.id)}>Отклонить</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>
  );
};

export default FriendRequests;

