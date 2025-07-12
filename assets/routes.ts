import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, insertVideoSchema, insertCommentSchema, 
  insertFollowSchema, insertLikeSchema, insertMusicSchema,
  insertMonetizationSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.get("/api/users/uid/:uid", async (req, res) => {
    try {
      const { uid } = req.params;
      const user = await storage.getUserByUid(uid);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.updateUser(id, req.body);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Video routes
  app.get("/api/videos/feed", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const videos = await storage.getFeedVideos(userId, limit);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to get feed videos" });
    }
  });

  app.get("/api/videos/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const videos = await storage.getVideosByUser(userId);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user videos" });
    }
  });

  app.get("/api/videos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const video = await storage.getVideo(id);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.json(video);
    } catch (error) {
      res.status(500).json({ message: "Failed to get video" });
    }
  });

  app.post("/api/videos", async (req, res) => {
    try {
      const videoData = insertVideoSchema.parse(req.body);
      const video = await storage.createVideo(videoData);
      res.status(201).json(video);
    } catch (error) {
      res.status(400).json({ message: "Invalid video data" });
    }
  });

  app.post("/api/videos/:id/view", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.updateVideoStats(id, 'views');
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to update views" });
    }
  });

  // Comment routes
  app.get("/api/videos/:videoId/comments", async (req, res) => {
    try {
      const videoId = parseInt(req.params.videoId);
      const comments = await storage.getCommentsByVideo(videoId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to get comments" });
    }
  });

  app.post("/api/comments", async (req, res) => {
    try {
      const commentData = insertCommentSchema.parse(req.body);
      const comment = await storage.createComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      res.status(400).json({ message: "Invalid comment data" });
    }
  });

  // Follow routes
  app.get("/api/follows/:followerId/:followingId", async (req, res) => {
    try {
      const followerId = parseInt(req.params.followerId);
      const followingId = parseInt(req.params.followingId);
      const isFollowing = await storage.isFollowing(followerId, followingId);
      res.json({ isFollowing });
    } catch (error) {
      res.status(500).json({ message: "Failed to check follow status" });
    }
  });

  app.post("/api/follows", async (req, res) => {
    try {
      const followData = insertFollowSchema.parse(req.body);
      const follow = await storage.createFollow(followData);
      res.status(201).json(follow);
    } catch (error) {
      res.status(400).json({ message: "Invalid follow data" });
    }
  });

  app.delete("/api/follows/:followerId/:followingId", async (req, res) => {
    try {
      const followerId = parseInt(req.params.followerId);
      const followingId = parseInt(req.params.followingId);
      await storage.deleteFollow(followerId, followingId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to unfollow" });
    }
  });

  // Like routes
  app.get("/api/likes/:userId/:videoId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const videoId = parseInt(req.params.videoId);
      const isLiked = await storage.isLiked(userId, videoId);
      res.json({ isLiked });
    } catch (error) {
      res.status(500).json({ message: "Failed to check like status" });
    }
  });

  app.post("/api/likes", async (req, res) => {
    try {
      const likeData = insertLikeSchema.parse(req.body);
      const like = await storage.createLike(likeData);
      res.status(201).json(like);
    } catch (error) {
      res.status(400).json({ message: "Invalid like data" });
    }
  });

  app.delete("/api/likes/:userId/:videoId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const videoId = parseInt(req.params.videoId);
      await storage.deleteLike(userId, videoId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to unlike" });
    }
  });

  // Music routes
  app.get("/api/music", async (req, res) => {
    try {
      const music = await storage.getAllMusic();
      res.json(music);
    } catch (error) {
      res.status(500).json({ message: "Failed to get music" });
    }
  });

  app.get("/api/music/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const music = await storage.getMusic(id);
      if (!music) {
        return res.status(404).json({ message: "Music not found" });
      }
      res.json(music);
    } catch (error) {
      res.status(500).json({ message: "Failed to get music" });
    }
  });

  app.post("/api/music", async (req, res) => {
    try {
      const musicData = insertMusicSchema.parse(req.body);
      const music = await storage.createMusic(musicData);
      res.status(201).json(music);
    } catch (error) {
      res.status(400).json({ message: "Invalid music data" });
    }
  });

  // Monetization routes
  app.get("/api/monetization/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const monetization = await storage.getMonetization(userId);
      if (!monetization) {
        return res.status(404).json({ message: "Monetization data not found" });
      }
      res.json(monetization);
    } catch (error) {
      res.status(500).json({ message: "Failed to get monetization data" });
    }
  });

  app.post("/api/monetization", async (req, res) => {
    try {
      const monetizationData = insertMonetizationSchema.parse(req.body);
      const monetization = await storage.createMonetization(monetizationData);
      res.status(201).json(monetization);
    } catch (error) {
      res.status(400).json({ message: "Invalid monetization data" });
    }
  });

  app.patch("/api/monetization/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const monetization = await storage.updateMonetization(userId, req.body);
      if (!monetization) {
        return res.status(404).json({ message: "Monetization data not found" });
      }
      res.json(monetization);
    } catch (error) {
      res.status(500).json({ message: "Failed to update monetization data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
