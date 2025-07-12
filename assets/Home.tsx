import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "wouter";
import VideoFeed from "@/components/VideoFeed";
import BottomNav from "@/components/BottomNav";
import UploadModal from "@/components/UploadModal";
import ProfileModal from "@/components/ProfileModal";
import MonetizationModal from "@/components/MonetizationModal";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"following" | "foryou">("foryou");
  const [showUpload, setShowUpload] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMonetization, setShowMonetization] = useState(false);
  const { firebaseUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-primary flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!firebaseUser) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="min-h-screen bg-dark-primary">
      {/* Top tabs */}
      <div className="fixed top-safe-area left-0 right-0 z-40 flex justify-center pt-4">
        <div className="flex space-x-8 text-white font-semibold">
          <button
            onClick={() => setActiveTab("following")}
            className={`transition-colors ${
              activeTab === "following"
                ? "text-white border-b-2 border-white pb-1"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Following
          </button>
          <button
            onClick={() => setActiveTab("foryou")}
            className={`transition-colors ${
              activeTab === "foryou"
                ? "text-white border-b-2 border-white pb-1"
                : "text-gray-400 hover:text-white"
            }`}
          >
            For You
          </button>
        </div>
      </div>

      {/* Video feed */}
      <VideoFeed />

      {/* Bottom navigation */}
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
