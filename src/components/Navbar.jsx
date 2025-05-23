import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: "/dashboard", name: "Dashboard" },
  { to: "/goals", name: "Goals" },
  { to: "/templates", name: "Templates" },
  { to: "/friends", name: "Friends" },
  { to: "/friend-requests", name: "Requests" },
  { to: "/profile", name: "Profile" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="relative z-50 shadow-sm bg-white/95 backdrop-blur-md border-b border-transparent">
      {/* Градиентная нижняя граница */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 via-emerald-400 to-fuchsia-400 opacity-90 rounded-t-xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Логотип и навигация */}
          <div className="flex items-center space-x-6">
            {/* Логотип */}
            <Link to="/dashboard" className="flex items-center gap-2 mr-2 select-none">
              {/* Иконка */}
              <span className="inline-flex items-center justify-center h-10 w-10 bg-gradient-to-tr from-blue-500 to-emerald-400 rounded-full shadow text-white text-xl font-black">
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="14" cy="14" r="10" strokeOpacity=".2"/>
                  <path d="M14 8v8l4 2" strokeLinecap="round" />
                </svg>
              </span>
              <span className="text-2xl font-extrabold tracking-tight text-gray-800">
                Achvmnt<span className="text-blue-500">.AI</span>
              </span>
            </Link>
            {/* Навигационные ссылки */}
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition 
                    ${location.pathname.startsWith(link.to) ? 
                      "bg-blue-50 text-blue-700 shadow" : 
                      "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
                    }
                  `}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          {/* User Block */}
          <div className="flex items-center gap-4">
            {/* Приветствие и аватар */}
            <div className="flex items-center gap-2 pr-2">
              <span className="hidden sm:block text-sm text-gray-600 font-semibold">
                {user?.Username || user?.Email?.split("@")[0] || 'User'}
              </span>
              {/* Фейковый аватар с инициалами */}
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-blue-400 via-fuchsia-400 to-emerald-400 text-white font-bold shadow">
                {(user?.Username || user?.Email || "U").slice(0,2).toUpperCase()}
              </span>
            </div>
            {/* Кнопка выхода */}
            <button
              onClick={logout}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-gradient-to-tr from-red-500 via-pink-500 to-orange-400 text-white font-bold shadow-md hover:scale-105 hover:shadow-xl transition"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6v-1a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-1" />
                <path d="M10 12h7l-3-3m0 0l3 3-3 3" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
