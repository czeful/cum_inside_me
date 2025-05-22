import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getUserProfile,
  sendFriendRequest,
  removeFriend,
} from "../services/friends";

const UserProfile = () => {
  const { id } = useParams(); // id пользователя из url
  const [user, setUser] = useState(null);
  const [friendStatus, setFriendStatus] = useState(""); // "friend", "pending", "not_friend"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await getUserProfile(id);
        setUser(res.data);
        // TODO: Узнать статус отношений с этим пользователем (см. ниже)
        setFriendStatus(res.data.friendStatus || "not_friend");
      } catch (e) {
        setUser(null);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [id]);

  const handleAddFriend = async () => {
    await sendFriendRequest(id);
    setFriendStatus("pending");
  };

  const handleRemoveFriend = async () => {
    await removeFriend(id);
    setFriendStatus("not_friend");
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Пользователь не найден</div>;

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-3">{user.Username || user.Email}</h2>
      <div>Email: {user.Email}</div>
      <div>Name: {user.Username}</div>
      <div className="mt-4">
        {friendStatus === "not_friend" && (
          <button className="btn-primary" onClick={handleAddFriend}>Добавить в друзья</button>
        )}
        {friendStatus === "pending" && <span>Заявка отправлена</span>}
        {friendStatus === "friend" && (
          <button className="btn-danger" onClick={handleRemoveFriend}>Удалить из друзей</button>
        )}
      </div>
      {/* Можно вывести список друзей пользователя */}
    </div>
  );
};

export default UserProfile;
