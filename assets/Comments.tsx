import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import BottomNav from "@/components/BottomNav";
import UploadModal from "@/components/UploadModal";
import ProfileModal from "@/components/ProfileModal";
import MonetizationModal from "@/components/MonetizationModal";
import { ArrowLeft, MessageCircle } from "lucide-react";

export default function Comments() {
  const [showUpload, setShowUpload] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMonetization, setShowMonetization] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-dark-primary pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-dark-primary border-b border-gray-800 p-4 z-40">
        <div className="flex items-center space-x-4">
          <ArrowLeft className="w-6 h-6 text-white" />
          <h1 className="text-xl font-bold text-white">Comments</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="text-center text-gray-400 py-12">
          <MessageCircle className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg">Comments Page</p>
          <p className="text-sm">This page shows comments for a specific video</p>
        </div>
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