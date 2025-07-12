import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import BottomNav from "@/components/BottomNav";
import UploadModal from "@/components/UploadModal";
import ProfileModal from "@/components/ProfileModal";
import MonetizationModal from "@/components/MonetizationModal";

export default function Profile() {
  const [showUpload, setShowUpload] = useState(false);
  const [showProfile, setShowProfile] = useState(true);
  const [showMonetization, setShowMonetization] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-dark-primary">
      <BottomNav
        onUploadClick={() => setShowUpload(true)}
        onProfileClick={() => setShowProfile(true)}
        onMonetizationClick={() => setShowMonetization(true)}
      />

      {/* Profile modal is always shown on this page */}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
      {showMonetization && <MonetizationModal onClose={() => setShowMonetization(false)} />}
    </div>
  );
}
