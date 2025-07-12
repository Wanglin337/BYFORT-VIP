import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useUserVideos } from "@/hooks/useVideos";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Settings, MessageSquare, Download } from "lucide-react";
import type { User, Video } from "@shared/schema";

interface ProfileModalProps {
  userId?: number;
  onClose: () => void;
}

export default function ProfileModal({ userId, onClose }: ProfileModalProps) {
  const { user: currentUser } = useAuth();
  const targetUserId = userId || currentUser?.id;
  const isOwnProfile = !userId || userId === currentUser?.id;

  const { data: user } = useQuery<User>({
    queryKey: ["/api/users", targetUserId],
    enabled: !!targetUserId,
  });

  const { data: videos, isLoading: videosLoading } = useUserVideos(targetUserId!);

  const formatCount = (count: number = 0) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (!user) {
    return (
      <div className="fixed inset-0 bg-dark-primary z-50 flex items-center justify-center">
        <div className="space-y-4">
          <Skeleton className="w-24 h-24 rounded-full bg-gray-800 mx-auto" />
          <Skeleton className="w-48 h-4 bg-gray-800" />
          <Skeleton className="w-32 h-4 bg-gray-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-dark-primary z-50">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h3 className="text-lg font-semibold text-white">@{user.username}</h3>
          {isOwnProfile && (
            <button className="text-gray-400 hover:text-white">
              <Settings className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Profile content */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {/* Profile info */}
          <div className="px-4 pb-6 text-center">
            <img
              src={user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
              alt="Profile picture"
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
            <h2 className="text-xl font-bold text-white mb-2">{user.displayName}</h2>
            {user.bio && (
              <p className="text-gray-400 mb-4">{user.bio}</p>
            )}

            {/* Stats */}
            <div className="flex justify-center space-x-8 mb-6">
              <div className="text-center">
                <div className="text-xl font-bold text-white">{formatCount(user.following)}</div>
                <div className="text-sm text-gray-400">Following</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">{formatCount(user.followers)}</div>
                <div className="text-sm text-gray-400">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">{formatCount(user.totalLikes)}</div>
                <div className="text-sm text-gray-400">Likes</div>
              </div>
            </div>

            {/* Action buttons */}
            {isOwnProfile ? (
              <div className="flex space-x-4">
                <Button className="flex-1 bg-dark-secondary border border-gray-600 text-white hover:bg-gray-700">
                  Edit Profile
                </Button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Button className="flex-1 bg-accent-pink hover:bg-accent-pink/80 text-white">
                  Follow
                </Button>
                <Button variant="outline" size="icon" className="border-gray-600 text-white hover:bg-gray-700">
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="border-gray-600 text-white hover:bg-gray-700">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Video grid */}
          <div className="px-4">
            {videosLoading ? (
              <div className="grid grid-cols-3 gap-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[9/16] bg-gray-800 rounded-lg" />
                ))}
              </div>
            ) : videos && videos.length > 0 ? (
              <div className="grid grid-cols-3 gap-1">
                {videos.map((video) => (
                  <VideoThumbnail key={video.id} video={video} />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <div className="text-4xl mb-2">📹</div>
                <p>{isOwnProfile ? "You haven't" : "This user hasn't"} posted any videos yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoThumbnail({ video }: { video: Video }) {
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
    <div className="aspect-[9/16] bg-gray-800 rounded-lg relative overflow-hidden">
      {video.thumbnailUrl ? (
        <img
          src={video.thumbnailUrl}
          alt="Video thumbnail"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-accent-pink via-purple-500 to-accent-blue"></div>
      )}
      <div className="absolute bottom-2 left-2 text-white text-xs font-semibold">
        {formatCount(video.views)}
      </div>
    </div>
  );
}
