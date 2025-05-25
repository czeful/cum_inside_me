import React, { useEffect, useState } from "react";
import axios from "../../services/api";
import TemplateCard from "./TemplateCard";
import Navbar from "../../components/Navbar";
import TemplateDetails from "./TemplateDetailsPage";
import { useLoading } from "../../context/LoadingContext";
import { Link } from "react-router-dom"; // <-- Добавь импорт Link

const TemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [copyMsg, setCopyMsg] = useState("");
  const { setLoading } = useLoading();

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/templates/public", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTemplates(res.data);
      } catch {
        setTemplates([]);
      }
      setLoading(false);
    };
    fetchTemplates();
  }, [setLoading]);

  const handleCopy = async (template) => {
    try {
      await axios.post(
        `/templates/${template.id || template._id || template.ID}/copy`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCopyMsg("Template successfully added to your goals!");
      setTimeout(() => setCopyMsg(""), 3000);
    } catch {
      setCopyMsg("Copying failed!");
      setTimeout(() => setCopyMsg(""), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-emerald-50 to-fuchsia-100">
      <div className="w-full flex-1 flex flex-col items-center justify-start">
        <div className="w-full max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl px-2 sm:px-4 md:px-8 py-8 sm:py-10 mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-700">
              Public Templates
            </h2>
            <div>
              {copyMsg && (
                <div className="text-green-700 text-xs sm:text-sm bg-green-50 border border-green-200 rounded-lg px-3 py-2 shadow animate-fadeIn inline-block">
                  {copyMsg}
                  {copyMsg === "Template successfully added to your goals!" && (
                    <Link to="/goals" className="ml-4 text-blue-600 underline font-semibold">
                      Перейти к целям
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
          {templates.length === 0 ? (
            <div className="text-center text-gray-400 py-16 text-base sm:text-lg">
              No public templates yet.
            </div>
          ) : (
            <div
              className="
                grid 
                grid-cols-1 
                sm:grid-cols-2 
                lg:grid-cols-3 
                gap-4 
                sm:gap-6 
                xl:gap-8
              "
            >
              {templates.map((t) => (
                <TemplateCard
                  key={t.id || t.ID || t._id}
                  template={t}
                  onCopy={handleCopy}
                  onView={setSelected}
                />
              ))}
            </div>
          )}
        </div>
        {/* Модальное окно для TemplateDetails */}
        {selected && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-2 sm:p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl relative">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                &times;
              </button>
              <TemplateDetails
                template={selected}
                onClose={() => setSelected(null)}
                onCopy={handleCopy}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateList;



// import React, { useEffect, useState } from "react";
// import axios from "../../services/api";
// import TemplateCard from "./TemplateCard";
// import Navbar from "../../components/Navbar";
// import TemplateDetails from "./TemplateDetailsPage";

// const navLinks = [
//   { to: "/dashboard", name: "Dashboard" },
//   { to: "/goals", name: "Goals" },
//   { to: "/templates", name: "Templates" },
//   { to: "/friends", name: "Friends" },
//   { to: "/friend-requests", name: "Requests" },
//   { to: "/profile", name: "Profile" },
// ];

// const TemplateList = () => {
//   const [templates, setTemplates] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [copyMsg, setCopyMsg] = useState("");

//   useEffect(() => {
//     const fetchTemplates = async () => {
//       try {
//         const res = await axios.get("/templates/public", {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         });
//         setTemplates(res.data);
//       } catch {
//         setTemplates([]);
//       }
//     };
//     fetchTemplates();
//   }, []);

//   const handleCopy = async (template) => {
//     console.log("copy", template);
//     try {
//       await axios.post(
//         `/templates/${template.id}/copy`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         }
//       );
//       setCopyMsg("Template successfully added to your goals!");
//       setTimeout(() => setCopyMsg(""), 3000);
//     } catch {
//       setCopyMsg("Copying failed!");
//       setTimeout(() => setCopyMsg(""), 3000);
//     }
//   };

//   const Navbar = () => {
//     const { user, logout } = useAuth();
//     const location = useLocation();

//     return (
//       <nav className="relative z-50 shadow-sm bg-white/95 backdrop-blur-md border-b border-transparent">
//         {/* Gradient bottom border */}
//         <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 via-emerald-400 to-fuchsia-400 opacity-90 rounded-t-xl pointer-events-none" />
//         <div className="max-w-7xl mx-auto px-4 sm:px-8">
//           <div className="flex justify-between h-16 items-center">
//             {/* Logo and navigation */}
//             <div className="flex items-center space-x-6">
//               {/* Logo */}
//               <Link to="/dashboard" className="flex items-center gap-2 mr-2 select-none">
//                 {/* Icon */}
//                 <span className="inline-flex items-center justify-center h-10 w-10 bg-gradient-to-tr from-blue-500 to-emerald-400 rounded-full shadow text-white text-xl font-black">
//                   <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
//                     <circle cx="14" cy="14" r="10" strokeOpacity=".2"/>
//                     <path d="M14 8v8l4 2" strokeLinecap="round" />
//                   </svg>
//                 </span>
//                 <span className="text-2xl font-extrabold tracking-tight text-gray-800">
//                   Achvmnt<span className="text-blue-500">.AI</span>
//                 </span>
//               </Link>
//               {/* Navigation links */}
//               <div className="hidden md:flex items-center gap-2">
//                 {navLinks.map(link => (
//                   <Link
//                     key={link.to}
//                     to={link.to}
//                     className={`
//                       px-4 py-2 rounded-lg font-medium transition 
//                       ${location.pathname.startsWith(link.to) ? 
//                         "bg-blue-50 text-blue-700 shadow" : 
//                         "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
//                       }
//                     `}
//                   >
//                     {link.name}
//                   </Link>
//                 ))}
//               </div>
//             </div>
//             {/* User Block */}
//             <div className="flex items-center gap-4">
//               {/* Greeting and avatar */}
//               <div className="flex items-center gap-2 pr-2">
//                 <span className="hidden sm:block text-sm text-gray-600 font-semibold">
//                   {user?.Username || user?.Email?.split("@")[0] || 'User'}
//                 </span>
//                 {/* Avatar with initials */}
//                 <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-blue-400 via-fuchsia-400 to-emerald-400 text-white font-bold shadow">
//                   {(user?.Username || user?.Email || "U").slice(0,2).toUpperCase()}
//                 </span>
//               </div>
//               {/* Logout button */}
//               <button
//                 onClick={logout}
//                 className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-gradient-to-tr from-red-500 via-pink-500 to-orange-400 text-white font-bold shadow-md hover:scale-105 hover:shadow-xl transition"
//               >
//                 <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M6 6v-1a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-1" />
//                   <path d="M10 12h7l-3-3m0 0l3 3-3 3" />
//                 </svg>
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>
//     );
//   };

//   return (
//     <div>
//       <div className="max-w-4xl mx-auto mt-10">
//         <div className="flex items-center justify-between mb-7">
//           <h2 className="text-3xl font-bold text-blue-700">
//           </h2>
//         </div>
//         {copyMsg && <div className="mb-4 text-green-700">{copyMsg}</div>}
//         {templates.length === 0 ? (
//           <div className="text-center text-gray-400 py-12">
//             No public templates yet.
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {templates.map((t) => (
//               <TemplateCard
//                 key={t.id || t.ID || t._id}
//                 template={t}
//                 onCopy={handleCopy}
//                 onView={setSelected}
//               />
//             ))}
//           </div>
//         )}
//         {selected && (
//           <TemplateDetails
//             template={selected}
//             onClose={() => setSelected(null)}
//             onCopy={handleCopy}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default TemplateList;