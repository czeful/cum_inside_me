import { useEffect, useState } from "react";
import { getFriends } from "../services/friends";

// Генерация цвета фона для аватарки
function avatarColor(idx) {
  const palette = [
    "bg-gradient-to-br from-teal-200 to-sky-200",
    "bg-gradient-to-br from-rose-200 to-orange-100",
    "bg-gradient-to-br from-purple-200 to-indigo-200",
    "bg-gradient-to-br from-amber-200 to-lime-200",
  ];
  return palette[idx % palette.length];
}

export default function ChatFriendsList({ onSelect, selectedId }) {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    getFriends().then(res => setFriends(Array.isArray(res.data) ? res.data : []));
  }, []);

  return (
    <ul className="divide-y divide-slate-100">
      {friends.map((friend, idx) => (
        <li key={friend.id || friend._id}>
          <button
            className={`
              w-full flex items-center gap-3 text-left py-3 px-4
              hover:bg-teal-50/70 transition rounded-2xl
              ${selectedId === (friend.id || friend._id) ? "bg-teal-100/80 font-bold shadow" : ""}
            `}
            onClick={() => onSelect(friend)}
          >
            {/* Аватар */}
            <span className={`w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold text-slate-700 shadow ${avatarColor(idx)}`}>
              {(friend.username ? friend.username[0] : "U").toUpperCase()}
            </span>
            <div className="flex flex-col truncate">
              <span className="font-semibold truncate">{friend.username}</span>
              <span className="text-xs text-gray-500 truncate">{friend.email}</span>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
