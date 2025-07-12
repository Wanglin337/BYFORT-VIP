import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { X, Heart } from "lucide-react";
import type { Comment, User } from "@shared/schema";

interface CommentsModalProps {
  videoId: number;
  onClose: () => void;
}

export default function CommentsModal({ videoId, onClose }: CommentsModalProps) {
  const [newComment, setNewComment] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery<Comment[]>({
    queryKey: ["/api/videos", videoId, "comments"],
  });

  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", "/api/comments", {
        videoId,
        userId: user?.id,
        content,
      });
      return response.json();
    },
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["/api/videos", videoId, "comments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
    },
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && user) {
      createCommentMutation.mutate(newComment.trim());
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="w-full bg-dark-secondary rounded-t-3xl max-h-[70vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">
            {comments?.length || 0} comments
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Comments list */}
        <div className="overflow-y-auto max-h-96 hide-scrollbar p-4 space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex space-x-3">
                <Skeleton className="w-8 h-8 rounded-full bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-16 bg-gray-700 rounded-xl" />
                </div>
              </div>
            ))
          ) : comments?.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <div className="text-4xl mb-2">💬</div>
              <p>No comments yet</p>
              <p className="text-sm">Be the first to comment!</p>
            </div>
          ) : (
            comments?.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))
          )}
        </div>

        {/* Comment input */}
        <div className="p-4 border-t border-gray-700">
          <form onSubmit={handleSubmitComment} className="flex items-center space-x-3">
            <img
              src={user?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
              alt="Your profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full bg-dark-card border-gray-600 rounded-full pr-12 text-white placeholder-gray-400 focus:border-accent-pink"
              />
              <Button
                type="submit"
                size="sm"
                disabled={!newComment.trim() || createCommentMutation.isPending}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-accent-pink hover:bg-accent-pink/80 text-white rounded-full p-2"
              >
                📤
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function CommentItem({ comment }: { comment: Comment }) {
  const { data: commenter } = useQuery<User>({
    queryKey: ["/api/users", comment.userId],
    enabled: !!comment.userId,
  });

  const formatTimeAgo = (date: Date | string) => {
    const commentDate = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diff = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  return (
    <div className="flex space-x-3">
      <img
        src={commenter?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${commenter?.username}`}
        alt="Commenter"
        className="w-8 h-8 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="bg-dark-card rounded-xl p-3">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-semibold text-sm text-white">
              {commenter?.username || "Unknown User"}
            </span>
            <span className="text-xs text-gray-400">
              {comment.createdAt ? formatTimeAgo(comment.createdAt) : "now"}
            </span>
          </div>
          <p className="text-sm text-gray-200">{comment.content}</p>
        </div>
        <div className="flex items-center space-x-4 mt-2 ml-3">
          <button className="text-xs text-gray-400 hover:text-white">Reply</button>
          <button className="text-xs text-gray-400 hover:text-white flex items-center space-x-1">
            <Heart className="w-3 h-3" />
            <span>{comment.likes || 0}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
