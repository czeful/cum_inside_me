import { useEffect, useState } from "react";
import { getFriends } from "../services/friends";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const FriendsList = () => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      const res = await getFriends();
      setFriends(res.data);
    };
    fetchFriends();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-blue-700">Мои друзья</h2>
          <Link
            to="/find-friend"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
          >
            + Добавить друга
          </Link>
        </div>

        {(friends?.length === 0) ? (
          <div className="text-center text-gray-400 py-12">
            У вас пока нет друзей.<br/>
            <Link to="/find-friend" className="text-blue-600 hover:underline">Найти друзей</Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {friends.map(f => {
              const key = typeof f === "string" ? f : f._id || f.id;
              const name = typeof f === "string"
                ? f
                : f.username || f.name || f.email?.split("@")[0] || "Без имени";
              const email = f.email || "";
              const initial = name ? name[0].toUpperCase() : "F";
              const avatarColor = "bg-blue-100 text-blue-600";

              return (
                <li key={key}>
                  <Link
                    to={`/users/${key}`}
                    className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-blue-50 rounded-xl shadow-sm border border-neutral-200 transition"
                  >
                    {/* Аватар */}
                    <div className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-xl ${avatarColor} shadow`}>
                      {initial}
                    </div>
                    {/* Имя и email */}
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{name}</div>
                      {email && <div className="text-sm text-gray-500">{email}</div>}
                    </div>
                    {/* Подробнее иконка */}
                    <span className="ml-2 text-blue-400 group-hover:text-blue-700 transition">
                      &rarr;
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FriendsList;

