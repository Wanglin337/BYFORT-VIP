import { useState, useEffect, useRef } from "react";
import { useVideos } from "@/hooks/useVideos";
import VideoPlayer from "./VideoPlayer";
import CommentsModal from "./CommentsModal";
import { Skeleton } from "@/components/ui/skeleton";

export default function VideoFeed() {
  const { data: videos, isLoading } = useVideos();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentVideoIndex < (videos?.length || 0) - 1) {
        // Swipe up - next video
        setCurrentVideoIndex(currentVideoIndex + 1);
      } else if (diff < 0 && currentVideoIndex > 0) {
        // Swipe down - previous video
        setCurrentVideoIndex(currentVideoIndex - 1);
      }
    }
  };

  const handleCommentClick = (videoId: number) => {
    setSelectedVideoId(videoId);
    setIsCommentsOpen(true);
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-dark-primary flex items-center justify-center">
        <div className="space-y-4">
          <Skeleton className="w-72 h-96 bg-gray-800" />
          <Skeleton className="w-48 h-4 bg-gray-800" />
          <Skeleton className="w-32 h-4 bg-gray-800" />
        </div>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="h-screen bg-dark-primary flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="text-6xl mb-4">📹</div>
          <p className="text-lg">No videos available</p>
          <p className="text-sm mt-2">Check back later for new content</p>
        </div>
      </div>
    );
  }

  const currentVideo = videos[currentVideoIndex];

  return (
    <>
      <div
        ref={containerRef}
        className="h-screen overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <VideoPlayer
          video={currentVideo}
          onCommentClick={() => handleCommentClick(currentVideo.id)}
        />
      </div>

      {isCommentsOpen && selectedVideoId && (
        <CommentsModal
          videoId={selectedVideoId}
          onClose={() => setIsCommentsOpen(false)}
        />
      )}
    </>
  );
}
