import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import BottomNav from "@/components/BottomNav";
import UploadModal from "@/components/UploadModal";
import ProfileModal from "@/components/ProfileModal";
import MonetizationModal from "@/components/MonetizationModal";
import { Search, MessageCircle, Heart, User, Bell } from "lucide-react";

export default function Inbox() {
  const [showUpload, setShowUpload] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMonetization, setShowMonetization] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "comments" | "likes" | "follows">("all");
  const { user } = useAuth();

  const notifications = [
    {
      id: 1,
      type: "like",
      user: { username: "user123", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user123" },
      message: "liked your video",
      time: "2m ago",
    },
    {
      id: 2,
      type: "comment",
      user: { username: "dancer_girl", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dancer_girl" },
      message: "commented on your video",
      time: "5m ago",
    },
    {
      id: 3,
      type: "follow",
      user: { username: "creative_soul", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=creative_soul" },
      message: "started following you",
      time: "1h ago",
    },
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true;
    if (activeTab === "comments") return notification.type === "comment";
    if (activeTab === "likes") return notification.type === "like";
    if (activeTab === "follows") return notification.type === "follow";
    return false;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="w-5 h-5 text-red-500" />;
      case "comment":
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case "follow":
        return <User className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-primary pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-dark-primary border-b border-gray-800 p-4 z-40">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-white">Inbox</h1>
          <Search className="w-6 h-6 text-gray-400" />
        </div>

        {/* Tabs */}
        <div className="flex space-x-6">
          {[
            { key: "all", label: "All" },
            { key: "comments", label: "Comments" },
            { key: "likes", label: "Likes" },
            { key: "follows", label: "Follows" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "text-white border-b-2 border-accent-pink pb-2"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications list */}
      <div className="p-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <Bell className="w-12 h-12 mx-auto mb-4" />
            <p className="text-lg">No notifications yet</p>
            <p className="text-sm">You'll see notifications here when people interact with your content</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-center space-x-3 p-3 bg-dark-secondary rounded-lg hover:bg-gray-700 transition-colors"
              >
                <img
                  src={notification.user.avatar}
                  alt={notification.user.username}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-white">
                      {notification.user.username}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {notification.message}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{notification.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {getIcon(notification.type)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav
        onUploadClick={() => setShowUpload(true)}
        onProfileClick={() => setShowProfile(true)}
        onMonetizationClick={() => setShowMonetization(true)}
      />

      {/* Modals */}
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
      {showMonetization && <MonetizationModal onClose={() => setShowMonetization(false)} />}
    </div>
  );
}
