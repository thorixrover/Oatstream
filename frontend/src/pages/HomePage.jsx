import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router-dom";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from "lucide-react";
import { capitialize } from "../lib/utils";
import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
// import { flagEmoji } from "../constants"; // Uncomment jika ingin emoji bendera

// Greeting & motivational quotes
const quotes = [
  "Belajar bahasa adalah jendela dunia.",
  "Setiap hari adalah kesempatan baru untuk berkembang.",
  "Jangan takut salah, teruslah mencoba!",
  "Practice makes perfect.",
  "Bahasa memperluas persahabatan."
];
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "SELAMAT PAGI";
  if (hour < 15) return "SELAMAT SIANG";
  if (hour < 18) return "SELAMAT SORE";
  return "SELAMAT MALAM";
};
const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  // Query friends
  const { data: friendsRaw = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });
  // Only accepted friends
  const friends = friendsRaw.filter(
    (friend) => friend.status === "accepted" || !friend.status
  );

  // Query recommended users
  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  // Query outgoing friend requests
  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  // Mutation for sending friend request
  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  // Track outgoing requests
  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        if (req && req.recipient && req.recipient._id) {
          outgoingIds.add(req.recipient._id);
        }
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header: Greeting & Quote */}
      <div className="mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary drop-shadow">
            {getGreeting()}, <span className="text-base-content">Selamat datang di Oatstream!</span>
          </h1>
          <div className="mt-2 italic text-sm text-secondary">
            "{randomQuote}"
          </div>
        </div>
      </div>


<div className="container mx-auto space-y-10">
  <section>
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Temanmu</h2>
      <div className="flex gap-2">
        <Link
          to="/notifications"
          className="btn btn-outline btn-sm w-[250px] flex-shrink-0 shadow-md border-2 border-primary"
        >
          <UsersIcon className="mr-2 size-4" />
          Permintaan Pertemanan
        </Link>
        <button
          className="btn btn-outline btn-sm w-[200px] flex-shrink-0 shadow-md border-2 border-primary"
          onClick={() => navigator.share && navigator.share({
            title: "Join Oatstream!",
            text: "Yuk gabung di Oatstream, platform belajar bahasa bareng teman!",
            url: window.location.origin,
          })}
        >
          Bagikan Oatstream
        </button>
      </div>
    </div>

    {loadingFriends ? (
      <div className="flex justify-center py-12">
        <span className="loading loading-spinner loading-lg" />
      </div>
    ) : friends.length === 0 ? (
      <NoFriendsFound />
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {friends.map((friend) => (
          <FriendCard key={friend._id} friend={friend} />
        ))}
      </div>
    )}
  </section>
  {/* ...rest of your code... */}

        {/* Recommended Users Section */}
        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Bertemulah Dengan Hal Baru yang ingin Dipelajari
                </h2>
                <p className="opacity-70">
                  Temukan Partner Pertukaran Bahasa yang Cocok untuk Kamu!
                </p>
              </div>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">
                Ups! Belum ada partner yang cocok ditemukan sekarang.
              </h3>
              <p className="text-base-content opacity-70">
                Yuk, kembali lagi nanti untuk melihat partner bahasa yang baru!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="card-body p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar size-16 rounded-full">
                          <img src={user.profilePic} alt={user.fullName} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{user.fullName}</h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Languages with flags */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="badge badge-secondary">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitialize(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline">
                          {getLanguageFlag(user.learningLanguage)}
                          Bahasa yang dipelajari: {capitialize(user.learningLanguage)}
                        </span>
                      </div>

                      {user.bio && <p className="text-sm opacity-70">{user.bio}</p>}

                      {/* Action button */}
                      <button
                        className={`btn w-full mt-2 ${
                          hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                        } `}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Permintaan Pertemanan
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Mengirim permintaan pertemanan
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;