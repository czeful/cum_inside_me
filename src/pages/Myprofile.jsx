import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile } from "../services/friends";
import Navbar from "../components/Navbar";

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getMyProfile().then(res => setUser(res.data));
  }, []);

  if (!user) return (
    <div className="flex justify-center items-center min-h-[40vh] text-lg text-gray-500">
      Loading profile...
    </div>
  );

  const initial = user.Username ? user.Username[0].toUpperCase() : "U";
  const formatDate = d => d ? new Date(d).toLocaleDateString() : "-";

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto mt-10 px-4">
        <div className="flex flex-col items-center bg-white rounded-2xl shadow-xl py-10 relative">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-600 mb-4 shadow-lg border-4 border-white absolute -top-12 left-1/2 -translate-x-1/2" style={{ zIndex: 2 }}>
            {initial}
          </div>
          <div className="mt-12 w-full text-center">
            <h2 className="text-2xl font-bold mb-1">{user.Username}</h2>
            <div className="text-gray-500">{user.Email}</div>
          </div>
          <div className="mt-6 w-full px-8 flex flex-col gap-3">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-700">Role:</span>
              <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-600 text-sm">
                {user.Role || "user"}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-700">Registration date:</span>
              <span className="text-gray-600">{formatDate(user.CreatedAt)}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-700">User ID:</span>
              <span className="text-gray-600">{user._id || user.id}</span>
            </div>
            {user.Friends && (
              <div className="flex flex-col border-b pb-2">
                <span className="font-medium text-gray-700 mb-1">Friends:</span>
                {user.Friends.length > 0 ? (
                  <ul className="ml-3 list-disc text-gray-600">
                    {user.Friends.map(fid => (
                      <li key={fid}>{fid}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-400">No friends yet</span>
                )}
              </div>
            )}
          </div>
          {/* Edit Button */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button
              className="px-6 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
              onClick={() => alert("Edit profile coming soon!")}
            >
              Edit Profile
            </button>
            {/* Найти друга */}
            <button
              className="px-6 py-2 rounded-xl bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition"
              onClick={() => navigate("/find-friend")}
            >
              Найти друга
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
