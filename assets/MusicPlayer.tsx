import { useEffect, useRef, useState } from "react";
import { Music, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Howl } from "howler";

interface MusicPlayerProps {
  audioUrl?: string;
  title?: string;
  artist?: string;
  autoPlay?: boolean;
  loop?: boolean;
  className?: string;
}

export default function MusicPlayer({ 
  audioUrl, 
  title = "Original Sound", 
  artist = "BYFORT", 
  autoPlay = false,
  loop = true,
  className = ""
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    if (audioUrl) {
      // Create new Howl instance
      soundRef.current = new Howl({
        src: [audioUrl],
        volume: volume,
        loop: loop,
        onplay: () => setIsPlaying(true),
        onpause: () => setIsPlaying(false),
        onstop: () => setIsPlaying(false),
        onend: () => setIsPlaying(false),
      });

      if (autoPlay) {
        soundRef.current.play();
      }

      return () => {
        if (soundRef.current) {
          soundRef.current.unload();
        }
      };
    }
  }, [audioUrl, volume, loop, autoPlay]);

  const togglePlay = () => {
    if (soundRef.current) {
      if (isPlaying) {
        soundRef.current.pause();
      } else {
        soundRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (soundRef.current) {
      const newMutedState = !isMuted;
      soundRef.current.mute(newMutedState);
      setIsMuted(newMutedState);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (soundRef.current) {
      soundRef.current.volume(newVolume);
    }
  };

  if (!audioUrl) {
    // Default music disc animation when no audio
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent-pink to-accent-blue flex items-center justify-center">
          <Music className="w-5 h-5 text-white animate-spin" style={{ animationDuration: "3s" }} />
        </div>
        <div className="text-xs text-white">
          <div className="font-semibold">{title}</div>
          <div className="text-gray-300">{artist}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-3 bg-dark-card rounded-lg p-3 ${className}`}>
      {/* Music disc */}
      <div className={`w-10 h-10 rounded-full bg-gradient-to-r from-accent-pink to-accent-blue flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: "3s" }}>
        <Music className="w-5 h-5 text-white" />
      </div>

      {/* Music info */}
      <div className="flex-1 text-xs text-white">
        <div className="font-semibold">{title}</div>
        <div className="text-gray-300">{artist}</div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={togglePlay}
          className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-white" />
          ) : (
            <Play className="w-4 h-4 text-white" />
          )}
        </button>

        <button
          onClick={toggleMute}
          className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-colors"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-white" />
          ) : (
            <Volume2 className="w-4 h-4 text-white" />
          )}
        </button>
      </div>
    </div>
  );
}