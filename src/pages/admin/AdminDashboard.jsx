// // src/pages/AdminDashboard.jsx
// import { useEffect, useState } from "react";
// import { getAllUsers } from "../";
// import axios from "../services/api";
// import { useAuth } from "../context/AuthProvider";

// export default function AdminDashboard() {
//   const { isAdmin } = useAuth();
//   const [users, setUsers] = useState([]);
//   const [goals, setGoals] = useState([]);
//   const [templates, setTemplates] = useState([]);

//   useEffect(() => {
//     if (isAdmin) {
//       getAllUsers().then(res => setUsers(res.data));
//       axios.get("/admin/goals").then(res => setGoals(res.data));
//       axios.get("/admin/templates").then(res => setTemplates(res.data));
//     }
//   }, [isAdmin]);

//   if (!isAdmin) return <div>Access denied</div>;

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
//       <section className="mb-8">
//         <h2 className="text-2xl font-semibold mb-2">All Users</h2>
//         <ul className="bg-white p-4 rounded-lg shadow">
//           {users.map(u => (
//             <li key={u._id}>{u.email} — {u.role}</li>
//           ))}
//         </ul>
//       </section>
//       <section className="mb-8">
//         <h2 className="text-2xl font-semibold mb-2">All Goals</h2>
//         <ul className="bg-white p-4 rounded-lg shadow">
//           {goals.map(g => (
//             <li key={g._id}>{g.name} (owner: {g.user_id})</li>
//           ))}
//         </ul>
//       </section>
//       <section>
//         <h2 className="text-2xl font-semibold mb-2">All Templates</h2>
//         <ul className="bg-white p-4 rounded-lg shadow">
//           {templates.map(t => (
//             <li key={t._id}>{t.title} (owner: {t.user_id})</li>
//           ))}
//         </ul>
//       </section>
//     </div>
//   );
// }
