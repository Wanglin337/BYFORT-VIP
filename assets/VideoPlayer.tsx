import { useState, useRef, useEffect } from "react";
import { Heart, MessageCircle, Share, Music } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import MusicPlayer from "./MusicPlayer";
import type { Video, User, Music as MusicType } from "@shared/schema";

interface VideoPlayerProps {
  video: Video;
  onCommentClick: () => void;
}

export default function VideoPlayer({ video, onCommentClick }: VideoPlayerProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get video creator
  const { data: creator } = useQuery<User>({
    queryKey: ["/api/users", video.userId],
    enabled: !!video.userId,
  });

  // Get music data
  const { data: musicData } = useQuery<MusicType>({
    queryKey: ["/api/music", video.musicId],
    enabled: !!video.musicId,
  });

  // Check if liked
  const { data: likeStatus } = useQuery({
    queryKey: ["/api/likes", user?.id, video.id],
    enabled: !!user?.id && !!video.id,
  });

  // Check if following
  const { data: followStatus } = useQuery({
    queryKey: ["/api/follows", user?.id, video.userId],
    enabled: !!user?.id && !!video.userId,
  });

  useEffect(() => {
    setIsLiked(likeStatus?.isLiked || false);
  }, [likeStatus]);

  useEffect(() => {
    setIsFollowing(followStatus?.isFollowing || false);
  }, [followStatus]);

  // Update video views
  const updateViewsMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/videos/${video.id}/view`);
    },
  });

  // Like/Unlike video
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (isLiked) {
        await apiRequest("DELETE", `/api/likes/${user?.id}/${video.id}`);
      } else {
        await apiRequest("POST", "/api/likes", { userId: user?.id, videoId: video.id });
      }
    },
    onSuccess: () => {
      setIsLiked(!isLiked);
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
    },
  });

  // Follow/Unfollow user
  const followMutation = useMutation({
    mutationFn: async () => {
      if (isFollowing) {
        await apiRequest("DELETE", `/api/follows/${user?.id}/${video.userId}`);
      } else {
        await apiRequest("POST", "/api/follows", { followerId: user?.id, followingId: video.userId });
      }
    },
    onSuccess: () => {
      setIsFollowing(!isFollowing);
      queryClient.invalidateQueries({ queryKey: ["/api/follows"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
  });

  useEffect(() => {
    if (videoRef.current) {
      updateViewsMutation.mutate();
    }
  }, []);

  const handleLike = () => {
    if (user) {
      likeMutation.mutate();
    }
  };

  const handleFollow = () => {
    if (user && video.userId !== user.id) {
      followMutation.mutate();
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: video.title || "Check out this video",
        url: window.location.href,
      });
    }
  };

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
    <div className="relative w-full h-screen bg-black flex items-center justify-center">
      {/* Video/Placeholder */}
      {video.videoUrl ? (
        <video
          ref={videoRef}
          src={video.videoUrl}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-accent-pink via-purple-500 to-accent-blue animate-gradient-xy"></div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>

      {/* Right side actions */}
      <div className="absolute right-4 bottom-24 flex flex-col space-y-6">
        {/* Profile picture with follow button */}
        <div className="relative">
          <img
            src={creator?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator?.username}`}
            alt="Creator"
            className="w-12 h-12 rounded-full border-2 border-white object-cover"
          />
          {user && video.userId !== user.id && (
            <button
              onClick={handleFollow}
              className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold transition-colors ${
                isFollowing ? "bg-gray-600" : "bg-accent-pink"
              }`}
            >
              {isFollowing ? "✓" : "+"}
            </button>
          )}
        </div>

        {/* Like button */}
        <button onClick={handleLike} className="flex flex-col items-center space-y-1 text-white">
          <div className="w-12 h-12 flex items-center justify-center">
            <Heart
              className={`w-7 h-7 ${
                isLiked ? "fill-red-500 text-red-500" : "text-white"
              } transition-colors`}
            />
          </div>
          <span className="text-xs font-semibold">{formatCount(video.likes)}</span>
        </button>

        {/* Comment button */}
        <button onClick={onCommentClick} className="flex flex-col items-center space-y-1 text-white">
          <div className="w-12 h-12 flex items-center justify-center">
            <MessageCircle className="w-7 h-7" />
          </div>
          <span className="text-xs font-semibold">{formatCount(video.comments)}</span>
        </button>

        {/* Share button */}
        <button onClick={handleShare} className="flex flex-col items-center space-y-1 text-white">
          <div className="w-12 h-12 flex items-center justify-center">
            <Share className="w-7 h-7" />
          </div>
          <span className="text-xs font-semibold">Share</span>
        </button>

        {/* Music disc */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-dark-secondary border-2 border-white flex items-center justify-center">
            <Music className="w-5 h-5 text-white animate-spin" style={{ animationDuration: "3s" }} />
          </div>
        </div>
      </div>

      {/* Bottom content info */}
      <div className="absolute bottom-24 left-4 right-20 text-white">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-lg">@{creator?.username}</span>
            {user && video.userId !== user.id && !isFollowing && (
              <button
                onClick={handleFollow}
                className="text-accent-pink font-semibold text-sm border border-accent-pink px-3 py-1 rounded"
              >
                Follow
              </button>
            )}
          </div>
          {video.description && (
            <p className="text-sm leading-relaxed">{video.description}</p>
          )}
          <div className="flex items-center space-x-2 text-sm">
            <Music className="w-4 h-4 text-gray-300" />
            <span className="text-gray-300">
              {musicData ? `${musicData.title} - ${musicData.artist}` : `Original sound - ${creator?.username}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
