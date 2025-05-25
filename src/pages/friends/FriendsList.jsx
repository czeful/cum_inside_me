import { useEffect, useState } from "react";
import { getFriends } from "../../services/friends";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";

const getAvatarGradient = (str) => {
  // Детерминированный выбор градиента по строке (имя/email)
  const colors = [
    "from-blue-400 via-emerald-400 to-fuchsia-500",
    "from-purple-400 via-pink-400 to-orange-400",
    "from-yellow-400 via-orange-400 to-red-400",
    "from-sky-400 via-cyan-300 to-emerald-300",
    "from-blue-800 via-blue-500 to-blue-300",
  ];
  let sum = 0;
  for (let i = 0; i < str.length; i++) sum += str.charCodeAt(i);
  return `bg-gradient-to-tr ${colors[sum % colors.length]}`;
};

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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-emerald-50">
      <Navbar />
      <div className="max-w-2xl mx-auto mt-12 mb-20 p-8 bg-white rounded-3xl shadow-2xl border border-blue-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-blue-800 tracking-tight mb-1">
              My Friends
            </h2>
            <div className="text-gray-500 text-base">List of your frineds</div>
          </div>
          <Link
            to="/find-friend"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-tr from-emerald-500 to-blue-400 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-2xl active:scale-100 transition-all duration-200"
          >
            <svg
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="mr-1"
            >
              <circle cx="11" cy="11" r="9" />
              <path d="M11 7v8M7 11h8" strokeLinecap="round" />
            </svg>
            Add Friends
          </Link>
        </div>

        {friends?.length === 0 ? (
          <div className="text-center text-gray-400 py-24 text-xl rounded-2xl bg-white/50 shadow-inner">
            You don't have any friends yet..
            <br />
            <Link
              to="/find-friend"
              className="text-blue-600 hover:underline font-semibold"
            >
              Find friends
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-7">
            {friends.map((f) => {
              const key = typeof f === "string" ? f : f._id || f.id;
              const name =
                typeof f === "string"
                  ? f
                  : f.username ||
                    f.name ||
                    f.email?.split("@")[0] ||
                    "Без имени";
              // Тута мы выводим данные наших друзей
              const email = f.email || "";
              const initial = name ? name[0].toUpperCase() : "F";
              const avatarGradient = getAvatarGradient(name + email);

              const online = key.charCodeAt(0) % 3 !== 0;

              return (
                <li key={key}>
                  <Link
                    to={`/users/${key}`}
                    className="flex items-center gap-5 p-5 bg-white/90 rounded-2xl shadow-xl border border-blue-50 hover:border-blue-400 hover:shadow-2xl transition-all group relative overflow-hidden"
                  >
                    {/* Декоративный полукруглый градиент */}
                    <div className="absolute -top-10 -right-12 w-32 h-32 rounded-full opacity-25 pointer-events-none z-0 bg-gradient-to-tr from-blue-300 via-emerald-200 to-fuchsia-400"></div>
                    {/* Аватар */}
                    <div
                      className={`relative w-14 h-14 flex items-center justify-center rounded-full text-xl font-extrabold shadow-lg select-none ${avatarGradient} z-10`}
                    >
                      {initial}
                      {/* Индикатор онлайн-статуса */}
                      <span
                        className={`absolute bottom-0 right-0 w-4 h-4 rounded-full ring-2 ring-white ${
                          online ? "bg-emerald-400" : "bg-gray-300"
                        }`}
                      ></span>
                    </div>
                    {/* Имя/email/status */}
                    <div className="flex-1 z-10">
                      <div className="font-semibold text-lg text-gray-800 group-hover:text-blue-700 truncate">
                        {name}
                      </div>
                      {email && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <svg
                            width="16"
                            height="16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="inline mr-0.5"
                          >
                            <path d="M2 4l6 5 6-5" />
                            <rect x="2" y="4" width="12" height="8" rx="2" />
                          </svg>
                          {email}
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            online
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {online ? "Online" : "Offline"}
                        </span>
                      </div>
                    </div>
                    {/* Подробнее иконка */}
                    <span className="ml-2 text-blue-400 group-hover:text-blue-700 transition z-10">
                      <svg
                        width="21"
                        height="21"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="10" cy="10" r="8" />
                        <path d="M7 10h6M10 7v6" />
                      </svg>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default FriendsList;
