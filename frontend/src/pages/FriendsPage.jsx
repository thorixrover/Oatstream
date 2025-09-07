import { useQuery } from "@tanstack/react-query";
import { getFriends } from "../lib/api";
import { MessageSquareIcon, UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FriendsPage = () => {
  const { data: friends, isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getFriends,
  });
  const navigate = useNavigate();

  const handleChat = (friendId) => {
    navigate(`/chat/${friendId}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-[80vh]">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-primary drop-shadow">
        Teman Saya
      </h1>
      {isLoading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {friends && friends.length > 0 ? (
            friends.map((friend) => (
              <div
                key={friend._id}
                className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow p-6 flex flex-col items-center text-center border border-base-200"
              >
                <div className="avatar mb-3">
                  <div className="w-20 h-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                    {friend.profilePic ? (
                      <img src={friend.profilePic} alt={friend.fullName} />
                    ) : (
                      <UserIcon className="w-20 h-20 text-base-300" />
                    )}
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-1">{friend.fullName}</h3>
                <p className="text-xs text-gray-500 mb-2">{friend.email}</p>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {friend.nativeLanguage && (
                    <span className="badge badge-info badge-sm">
                      Bahasa Asli: {friend.nativeLanguage}
                    </span>
                  )}
                  {friend.learningLanguage && (
                    <span className="badge badge-outline badge-sm">
                      Belajar: {friend.learningLanguage}
                    </span>
                  )}
                </div>
                <button
                  className="btn btn-sm btn-primary flex items-center gap-2 mt-auto"
                  onClick={() => handleChat(friend._id)}
                  title={`Kirim pesan ke ${friend.fullName}`}
                >
                  <MessageSquareIcon className="w-4 h-4" />
                  Kirim Pesan
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 mt-12">
              <UserIcon className="w-16 h-16 mx-auto mb-2 opacity-30" />
              <p className="text-lg font-semibold">Belum ada teman.</p>
              <p className="text-sm">Cari dan tambahkan teman untuk mulai berinteraksi!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FriendsPage;