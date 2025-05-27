import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: "/dashboard", name: "Dashboard" },
  { to: "/goals", name: "Goals" },
  // { to: "/templates", name: "Templates" },
  { to: "/friends", name: "Friends" },
  { to: "/chat", name: "Chat" },
  { to: "/friend-requests", name: "Requests" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  
  const handleNavClick = () => setMenuOpen(false);

  return (
    <nav className="relative z-50 shadow bg-white/90 backdrop-blur border-b border-slate-100">
      {/* */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-sky-200 via-teal-100 to-emerald-100 opacity-70 rounded-t-xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-2 xs:px-4 sm:px-8">
        <div className="flex justify-between items-center h-16">
          {/*  */}
          <div className="flex items-center gap-2 md:gap-6">
            <Link to="/dashboard" className="flex items-center gap-2 mr-2 select-none">
              <span className="inline-flex items-center justify-center h-10 w-10 bg-gradient-to-tr from-sky-200 to-emerald-200 rounded-full shadow text-slate-700 text-xl font-black">
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="14" cy="14" r="10" strokeOpacity=".2"/>
                  <path d="M14 8v8l4 2" strokeLinecap="round" />
                </svg>
              </span>
              <span className="text-xl xs:text-2xl font-extrabold tracking-tight text-slate-800">
                Achvmnt<span className="text-teal-500">.AI</span>
              </span>
            </Link>
          </div>

          {/*  */}
          <div className="flex md:hidden items-center gap-2">
            <button
              className="p-2 rounded-lg text-teal-700 hover:bg-teal-50 transition focus:outline-none"
              aria-label="Open menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {/* */}
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h20M4 14h20M4 21h20" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          {/*  */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`
                  px-4 py-2 rounded-lg font-medium transition
                  flex items-center gap-1
                  ${location.pathname.startsWith(link.to) ?
                    "bg-teal-50 text-teal-700 shadow"
                    : "text-slate-600 hover:text-teal-700 hover:bg-teal-50"
                  }
                `}
              >
                {link.name === "Chat" && (
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block mb-[1px]">
                    <path d="M2 16.5V4.5A2.5 2.5 0 0 1 4.5 2h11A2.5 2.5 0 0 1 18 4.5v7A2.5 2.5 0 0 1 15.5 14h-8l-4 4.5" strokeLinejoin="round"/>
                  </svg>
                )}
                {link.name}
              </Link>
            ))}
          </div>
          {/* */}
          <div className="flex items-center gap-2">
            <Link
              to="/profile"
              className="flex items-center gap-2 group cursor-pointer"
              title="Перейти в профиль"
            >
              <span className="hidden xs:block text-xs xs:text-sm text-slate-600 font-semibold group-hover:underline">
                {user?.Username || user?.Email?.split("@")[0] || 'User'}
              </span>
              <span className="inline-flex items-center justify-center w-8 h-8 xs:w-9 xs:h-9 rounded-full bg-gradient-to-tr from-sky-100 via-emerald-100 to-teal-200 text-slate-700 font-bold shadow group-hover:ring-2 group-hover:ring-teal-300">
                {(user?.Username || user?.Email || "U").slice(0,2).toUpperCase()}
              </span>
            </Link>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-200 text-slate-700 font-bold shadow-md hover:bg-rose-300 transition text-xs xs:text-sm"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6v-1a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-1" />
                <path d="M10 12h7l-3-3m0 0l3 3-3 3" />
              </svg>
              Logout
            </button>
          </div>
        </div>
        {/* */}
        {menuOpen && (
          <div className="md:hidden absolute right-0 left-0 top-16 bg-white shadow-lg rounded-b-2xl py-2 px-4 flex flex-col gap-1 animate-fadeIn z-40">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={handleNavClick}
                className={`
                  px-4 py-3 rounded-lg font-medium transition
                  flex items-center gap-2
                  ${location.pathname.startsWith(link.to) ?
                    "bg-teal-50 text-teal-700 shadow"
                    : "text-slate-600 hover:text-teal-700 hover:bg-teal-50"
                  }
                `}
              >
                {link.name === "Chat" && (
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block mb-[1px]">
                    <path d="M2 16.5V4.5A2.5 2.5 0 0 1 4.5 2h11A2.5 2.5 0 0 1 18 4.5v7A2.5 2.5 0 0 1 15.5 14h-8l-4 4.5" strokeLinejoin="round"/>
                  </svg>
                )}
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
