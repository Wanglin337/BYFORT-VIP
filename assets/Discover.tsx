import { useState } from "react";
import { useVideos } from "@/hooks/useVideos";
import { useAuth } from "@/hooks/useAuth";
import BottomNav from "@/components/BottomNav";
import UploadModal from "@/components/UploadModal";
import ProfileModal from "@/components/ProfileModal";
import MonetizationModal from "@/components/MonetizationModal";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, TrendingUp, Hash } from "lucide-react";
import type { Video } from "@shared/schema";

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMonetization, setShowMonetization] = useState(false);
  const { data: videos, isLoading } = useVideos();
  const { user } = useAuth();

  const trendingHashtags = [
    "#dance", "#viral", "#funny", "#music", "#trending",
    "#comedy", "#duet", "#challenge", "#foryou", "#art"
  ];

  const filteredVideos = videos?.filter(video =>
    video.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.title?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const formatCount = (count: number = 0) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="min-h-screen bg-dark-primary pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-dark-primary border-b border-gray-800 p-4 z-40">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search videos, users, sounds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-secondary border-gray-600 text-white placeholder-gray-400 pl-10 focus:border-accent-pink"
          />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {!searchQuery && (
          <>
            {/* Trending section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-white">
                <TrendingUp className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Trending</h2>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {trendingHashtags.map((hashtag) => (
                  <button
                    key={hashtag}
                    onClick={() => setSearchQuery(hashtag)}
                    className="bg-dark-secondary px-3 py-2 rounded-full text-sm text-white border border-gray-600 hover:border-accent-pink transition-colors"
                  >
                    {hashtag}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured videos */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Discover Videos</h2>
              
              {isLoading ? (
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-[9/16] bg-gray-800 rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {videos?.slice(0, 10).map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Search results */}
        {searchQuery && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">
              Search Results for "{searchQuery}"
            </h2>
            
            {filteredVideos.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <Search className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg">No results found</p>
                <p className="text-sm">Try searching for something else</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {filteredVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            )}
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

function VideoCard({ video }: { video: Video }) {
  const formatCount = (count: number = 0) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="aspect-[9/16] bg-gray-800 rounded-lg relative overflow-hidden group cursor-pointer">
      {video.thumbnailUrl ? (
        <img
          src={video.thumbnailUrl}
          alt="Video thumbnail"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-accent-pink via-purple-500 to-accent-blue"></div>
      )}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all"></div>
      
      {/* Stats */}
      <div className="absolute bottom-2 left-2 text-white text-xs font-semibold">
        👁 {formatCount(video.views)}
      </div>
      
      {/* Description preview */}
      {video.description && (
        <div className="absolute bottom-2 right-2 left-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="line-clamp-2">{video.description}</p>
        </div>
      )}
    </div>
  );
}
