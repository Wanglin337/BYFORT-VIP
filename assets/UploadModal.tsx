import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Video, Music, Sparkles, Globe } from "lucide-react";
import { uploadBytes, ref as storageRef, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

interface UploadModalProps {
  onClose: () => void;
}

export default function UploadModal({ onClose }: UploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const uploadVideoMutation = useMutation({
    mutationFn: async (videoData: { userId: number; title?: string; description: string; videoUrl: string; isPublic: boolean }) => {
      const response = await apiRequest("POST", "/api/videos", videoData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      onClose();
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    try {
      // Upload to Firebase Storage
      const videoRef = storageRef(storage, `videos/${user.id}/${Date.now()}-${selectedFile.name}`);
      const snapshot = await uploadBytes(videoRef, selectedFile);
      const videoUrl = await getDownloadURL(snapshot.ref);

      // Create video record
      await uploadVideoMutation.mutateAsync({
        userId: user.id,
        description,
        videoUrl,
        isPublic,
      });
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-dark-primary z-50">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            Cancel
          </button>
          <h3 className="text-lg font-semibold text-white">Upload</h3>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading || !user}
            className="bg-accent-pink hover:bg-accent-pink/80 text-white"
          >
            {uploading ? "Uploading..." : "Post"}
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 space-y-6 overflow-y-auto">
          {/* Video preview area */}
          <div className="aspect-[9/16] max-w-sm mx-auto bg-gray-800 rounded-xl flex items-center justify-center relative overflow-hidden">
            {previewUrl ? (
              <video
                src={previewUrl}
                className="w-full h-full object-cover"
                controls
                autoPlay
                muted
                loop
              />
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-400 text-center cursor-pointer hover:text-gray-300 transition-colors"
              >
                <Video className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg">Tap to add video</p>
                <p className="text-sm mt-2">or drag and drop</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Upload options */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <Textarea
                placeholder="Describe your video..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-dark-secondary border-gray-600 text-white placeholder-gray-400 focus:border-accent-pink resize-none"
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <button className="flex items-center justify-between w-full py-3 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  <Music className="w-5 h-5 text-white" />
                  <span className="text-white">Add music</span>
                </div>
                <span className="text-gray-400">〉</span>
              </button>

              <button className="flex items-center justify-between w-full py-3 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-5 h-5 text-white" />
                  <span className="text-white">Effects</span>
                </div>
                <span className="text-gray-400">〉</span>
              </button>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-white" />
                  <span className="text-white">Who can view</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">{isPublic ? "Everyone" : "Private"}</span>
                  <button
                    onClick={() => setIsPublic(!isPublic)}
                    className="text-gray-400"
                  >
                    〉
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
