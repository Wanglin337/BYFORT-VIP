import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import BottomNav from "@/components/BottomNav";
import UploadModal from "@/components/UploadModal";
import ProfileModal from "@/components/ProfileModal";
import MonetizationModal from "@/components/MonetizationModal";

export default function Monetization() {
  const [showUpload, setShowUpload] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMonetization, setShowMonetization] = useState(true);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-dark-primary">
      <BottomNav
        onUploadClick={() => setShowUpload(true)}
        onProfileClick={() => setShowProfile(true)}
        onMonetizationClick={() => setShowMonetization(true)}
      />

      {/* Monetization modal is always shown on this page */}
      {showMonetization && <MonetizationModal onClose={() => setShowMonetization(false)} />}
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </div>
  );
}