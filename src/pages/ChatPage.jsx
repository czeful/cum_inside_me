import { useEffect, useState } from "react";
import ChatFriendsList from "../components/ChatFriendsList";
import ChatWindow from "../components/ChatWindow";
import { getMyProfile } from "../services/friends";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLoading } from "../context/LoadingContext";

export default function ChatPage() {
  const [myId, setMyId] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const {setLoading} = useLoading();

  useEffect(() => {
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await getMyProfile();
      setMyId(res.data.ID || res.data.id || res.data._id);
    } finally {
      setLoading(false);
    }
  };
  fetchProfile();
}, [setLoading]);


  return (
    <div>
      <Navbar />
      <div className="flex h-[80vh] min-h-[500px] bg-gradient-to-tr from-slate-50 via-teal-50 to-emerald-50 p-6 md:p-12 rounded-3xl shadow-2xl max-w-6xl mx-auto mt-10 border border-slate-100">
        {/* Sidebar */}
        <aside className="w-1/4 min-w-[200px] max-w-[300px] bg-white/80 rounded-3xl shadow-md border border-slate-100 flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 text-lg font-bold text-slate-700 tracking-tight flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-gradient-to-tr from-teal-300 to-sky-200 animate-pulse" />
            Friends
          </div>
          <div className="flex-1 overflow-y-auto custom-scroll">
            <ChatFriendsList
              onSelect={setSelectedFriend}
              selectedId={selectedFriend?.id}
            />
          </div>
        </aside>

        {/* Main Chat */}
        <main className="flex-1 flex flex-col pl-8">
          {selectedFriend && myId ? (
            <ChatWindow myId={myId} friend={selectedFriend} />
          ) : (
            <div className="text-slate-400 flex flex-col items-center justify-center h-full text-xl font-semibold tracking-tight">
              <span className="mb-2 text-4xl">💬</span>
              Select a friend to start chatting
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
