import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Video, InsertVideo } from "@shared/schema";

export function useVideos() {
  return useQuery<Video[]>({
    queryKey: ["/api/videos/feed"],
  });
}

export function useUserVideos(userId: number) {
  return useQuery<Video[]>({
    queryKey: ["/api/videos/user", userId],
    enabled: !!userId,
  });
}

export function useVideo(id: number) {
  return useQuery<Video>({
    queryKey: ["/api/videos", id],
    enabled: !!id,
  });
}

export function useCreateVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoData: InsertVideo) => {
      const response = await apiRequest("POST", "/api/videos", videoData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
    },
  });
}

export function useUpdateVideoViews() {
  return useMutation({
    mutationFn: async (videoId: number) => {
      const response = await apiRequest("POST", `/api/videos/${videoId}/view`);
      return response.json();
    },
  });
}
