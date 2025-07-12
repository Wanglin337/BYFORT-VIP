// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users = /* @__PURE__ */ new Map();
  videos = /* @__PURE__ */ new Map();
  comments = /* @__PURE__ */ new Map();
  follows = /* @__PURE__ */ new Map();
  likes = /* @__PURE__ */ new Map();
  music = /* @__PURE__ */ new Map();
  monetization = /* @__PURE__ */ new Map();
  withdrawals = /* @__PURE__ */ new Map();
  currentId = 1;
  constructor() {
    this.initializeSampleData();
  }
  initializeSampleData() {
    const sampleMusic = [
      {
        title: "Upbeat Summer",
        artist: "DJ Audio",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 30
      },
      {
        title: "Chill Vibes",
        artist: "Lo-Fi Master",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 45
      }
    ];
    for (const musicData of sampleMusic) {
      const music2 = {
        ...musicData,
        id: this.currentId++,
        createdAt: /* @__PURE__ */ new Date()
      };
      this.music.set(music2.id, music2);
    }
    const sampleUsers = [
      {
        uid: "demo-user-1",
        username: "dancer_pro",
        displayName: "Pro Dancer",
        email: "dancer@example.com",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=dancer_pro",
        bio: "Professional dancer and choreographer \u{1F483}",
        followers: 15420,
        following: 892,
        totalLikes: 234560,
        isVerified: true
      },
      {
        uid: "demo-user-2",
        username: "music_lover",
        displayName: "Music Lover",
        email: "music@example.com",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=music_lover",
        bio: "Creating beats and vibes \u{1F3B5}",
        followers: 8934,
        following: 1245,
        totalLikes: 89450,
        isVerified: false
      },
      {
        uid: "demo-user-3",
        username: "creative_soul",
        displayName: "Creative Soul",
        email: "creative@example.com",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=creative_soul",
        bio: "Art meets technology \u2728",
        followers: 23150,
        following: 567,
        totalLikes: 156780,
        isVerified: true
      }
    ];
    for (const userData of sampleUsers) {
      const user = {
        ...userData,
        id: this.currentId++,
        createdAt: /* @__PURE__ */ new Date()
      };
      this.users.set(user.id, user);
    }
    const sampleVideos = [
      {
        userId: 1,
        title: "Amazing Dance Moves",
        description: "Check out these sick dance moves! \u{1F525} #dance #viral #trending #foryou",
        videoUrl: "",
        thumbnailUrl: "",
        musicId: 1,
        views: 125340,
        likes: 23450,
        comments: 1234,
        shares: 567,
        isPublic: true
      },
      {
        userId: 2,
        title: "Beat Drop Challenge",
        description: "When the beat drops \u{1F3B5} Can you handle it? #music #challenge #beatdrop",
        videoUrl: "",
        thumbnailUrl: "",
        musicId: 2,
        views: 89234,
        likes: 15678,
        comments: 892,
        shares: 234,
        isPublic: true
      },
      {
        userId: 3,
        title: "Creative Art Process",
        description: "Watch me create magic \u2728 Art is life! #art #creative #process #satisfying",
        videoUrl: "",
        thumbnailUrl: "",
        musicId: 1,
        views: 67890,
        likes: 12345,
        comments: 678,
        shares: 123,
        isPublic: true
      },
      {
        userId: 1,
        title: "Quick Tutorial",
        description: "Learn this move in 30 seconds! \u{1F4AA} #tutorial #dance #learn #quick",
        videoUrl: "",
        thumbnailUrl: "",
        musicId: 2,
        views: 234567,
        likes: 45678,
        comments: 2345,
        shares: 890,
        isPublic: true
      }
    ];
    for (const videoData of sampleVideos) {
      const video = {
        ...videoData,
        id: this.currentId++,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1e3)
        // Random time within last week
      };
      this.videos.set(video.id, video);
    }
    const sampleComments = [
      {
        videoId: 3,
        userId: 2,
        content: "This is incredible! How did you learn to do this?",
        likes: 23
      },
      {
        videoId: 3,
        userId: 1,
        content: "Amazing work! \u{1F525}",
        likes: 45
      },
      {
        videoId: 4,
        userId: 3,
        content: "I tried this and it worked perfectly! Thanks!",
        likes: 67
      },
      {
        videoId: 5,
        userId: 2,
        content: "The creativity is off the charts! \u{1F3A8}",
        likes: 34
      }
    ];
    for (const commentData of sampleComments) {
      const comment = {
        ...commentData,
        id: this.currentId++,
        parentId: null,
        createdAt: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1e3)
        // Random time within last 3 days
      };
      this.comments.set(comment.id, comment);
    }
    for (let i = 1; i <= 3; i++) {
      const monetization2 = {
        id: this.currentId++,
        userId: i,
        totalEarnings: Math.floor(Math.random() * 5e5) + 1e4,
        // $100-$5000
        monthlyEarnings: Math.floor(Math.random() * 1e5) + 5e3,
        // $50-$1000
        weeklyEarnings: Math.floor(Math.random() * 25e3) + 1e3,
        // $10-$250
        engagementRate: Math.floor(Math.random() * 1e3) + 500,
        // 5-15%
        creatorFundEnabled: true,
        virtualGiftsEnabled: Math.random() > 0.5,
        brandPartnershipsEnabled: i <= 2,
        // Only first two users
        paymentMethod: "PayPal",
        updatedAt: /* @__PURE__ */ new Date()
      };
      this.monetization.set(i, monetization2);
    }
  }
  // Users
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUid(uid) {
    return Array.from(this.users.values()).find((user) => user.uid === uid);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }
  async createUser(insertUser) {
    const id = this.currentId++;
    const user = {
      ...insertUser,
      id,
      followers: 0,
      following: 0,
      totalLikes: 0,
      isVerified: false,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.users.set(id, user);
    return user;
  }
  async updateUser(id, updates) {
    const user = this.users.get(id);
    if (!user) return void 0;
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  // Videos
  async getVideo(id) {
    return this.videos.get(id);
  }
  async getVideosByUser(userId) {
    return Array.from(this.videos.values()).filter((video) => video.userId === userId);
  }
  async getFeedVideos(userId, limit = 20) {
    return Array.from(this.videos.values()).filter((video) => video.isPublic).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)).slice(0, limit);
  }
  async createVideo(insertVideo) {
    const id = this.currentId++;
    const video = {
      ...insertVideo,
      id,
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.videos.set(id, video);
    return video;
  }
  async updateVideoStats(id, field) {
    const video = this.videos.get(id);
    if (video) {
      video[field] = (video[field] || 0) + 1;
      this.videos.set(id, video);
    }
  }
  // Comments
  async getCommentsByVideo(videoId) {
    return Array.from(this.comments.values()).filter((comment) => comment.videoId === videoId).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }
  async createComment(insertComment) {
    const id = this.currentId++;
    const comment = {
      ...insertComment,
      id,
      likes: 0,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.comments.set(id, comment);
    if (insertComment.videoId) {
      await this.updateVideoStats(insertComment.videoId, "comments");
    }
    return comment;
  }
  // Follows
  async isFollowing(followerId, followingId) {
    return this.follows.has(`${followerId}-${followingId}`);
  }
  async createFollow(insertFollow) {
    const id = this.currentId++;
    const follow = {
      ...insertFollow,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.follows.set(`${insertFollow.followerId}-${insertFollow.followingId}`, follow);
    if (insertFollow.followerId && insertFollow.followingId) {
      const follower = await this.getUser(insertFollow.followerId);
      const following = await this.getUser(insertFollow.followingId);
      if (follower) {
        await this.updateUser(insertFollow.followerId, { following: (follower.following || 0) + 1 });
      }
      if (following) {
        await this.updateUser(insertFollow.followingId, { followers: (following.followers || 0) + 1 });
      }
    }
    return follow;
  }
  async deleteFollow(followerId, followingId) {
    this.follows.delete(`${followerId}-${followingId}`);
    const follower = await this.getUser(followerId);
    const following = await this.getUser(followingId);
    if (follower) {
      await this.updateUser(followerId, { following: Math.max(0, (follower.following || 0) - 1) });
    }
    if (following) {
      await this.updateUser(followingId, { followers: Math.max(0, (following.followers || 0) - 1) });
    }
  }
  // Likes
  async isLiked(userId, videoId) {
    return this.likes.has(`${userId}-${videoId}`);
  }
  async createLike(insertLike) {
    const id = this.currentId++;
    const like = {
      ...insertLike,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.likes.set(`${insertLike.userId}-${insertLike.videoId}`, like);
    if (insertLike.videoId) {
      await this.updateVideoStats(insertLike.videoId, "likes");
    }
    return like;
  }
  async deleteLike(userId, videoId) {
    this.likes.delete(`${userId}-${videoId}`);
    const video = this.videos.get(videoId);
    if (video) {
      video.likes = Math.max(0, (video.likes || 0) - 1);
      this.videos.set(videoId, video);
    }
  }
  // Music
  async getMusic(id) {
    return this.music.get(id);
  }
  async getAllMusic() {
    return Array.from(this.music.values());
  }
  async createMusic(insertMusic) {
    const id = this.currentId++;
    const music2 = {
      ...insertMusic,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.music.set(id, music2);
    return music2;
  }
  // Monetization
  async getMonetization(userId) {
    return this.monetization.get(userId);
  }
  async createMonetization(insertMonetization) {
    const id = this.currentId++;
    const monetization2 = {
      ...insertMonetization,
      id,
      totalEarnings: 0,
      monthlyEarnings: 0,
      weeklyEarnings: 0,
      engagementRate: 0,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.monetization.set(insertMonetization.userId, monetization2);
    return monetization2;
  }
  async updateMonetization(userId, updates) {
    const monetization2 = this.monetization.get(userId);
    if (!monetization2) return void 0;
    const updated = { ...monetization2, ...updates, updatedAt: /* @__PURE__ */ new Date() };
    this.monetization.set(userId, updated);
    return updated;
  }
  // Withdrawals
  async getWithdrawalsByUser(userId) {
    return Array.from(this.withdrawals.values()).filter((w) => w.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  async createWithdrawal(insertWithdrawal) {
    const id = this.currentId++;
    const withdrawal = {
      id,
      ...insertWithdrawal,
      status: "pending",
      createdAt: /* @__PURE__ */ new Date(),
      processedAt: null
    };
    this.withdrawals.set(id, withdrawal);
    return withdrawal;
  }
  async updateWithdrawalStatus(id, status) {
    const withdrawal = this.withdrawals.get(id);
    if (!withdrawal) return void 0;
    const updated = {
      ...withdrawal,
      status,
      processedAt: status !== "pending" ? /* @__PURE__ */ new Date() : null
    };
    this.withdrawals.set(id, updated);
    return updated;
  }
  async getAllUsers() {
    return Array.from(this.users.values());
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(),
  // Firebase UID
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  email: text("email").notNull().unique(),
  profileImage: text("profile_image"),
  bio: text("bio"),
  followers: integer("followers").default(0),
  following: integer("following").default(0),
  totalLikes: integer("total_likes").default(0),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title"),
  description: text("description"),
  videoUrl: text("video_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  musicId: integer("music_id").references(() => music.id),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").references(() => videos.id),
  userId: integer("user_id").references(() => users.id),
  content: text("content").notNull(),
  likes: integer("likes").default(0),
  parentId: integer("parent_id"),
  // For replies
  createdAt: timestamp("created_at").defaultNow()
});
var follows = pgTable("follows", {
  id: serial("id").primaryKey(),
  followerId: integer("follower_id").references(() => users.id),
  followingId: integer("following_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow()
});
var likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  videoId: integer("video_id").references(() => videos.id),
  createdAt: timestamp("created_at").defaultNow()
});
var music = pgTable("music", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  audioUrl: text("audio_url").notNull(),
  duration: integer("duration"),
  // in seconds
  createdAt: timestamp("created_at").defaultNow()
});
var monetization = pgTable("monetization", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  totalEarnings: integer("total_earnings").default(0),
  // in cents
  monthlyEarnings: integer("monthly_earnings").default(0),
  weeklyEarnings: integer("weekly_earnings").default(0),
  engagementRate: integer("engagement_rate").default(0),
  // percentage * 100
  creatorFundEnabled: boolean("creator_fund_enabled").default(false),
  virtualGiftsEnabled: boolean("virtual_gifts_enabled").default(false),
  brandPartnershipsEnabled: boolean("brand_partnerships_enabled").default(false),
  paymentMethod: text("payment_method"),
  updatedAt: timestamp("updated_at").defaultNow()
});
var withdrawals = pgTable("withdrawals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  method: text("method").notNull(),
  // DANA, OVO, PayPal
  accountNumber: text("account_number").notNull(),
  accountName: text("account_name").notNull(),
  amount: integer("amount").notNull(),
  status: text("status").default("pending"),
  // pending, completed, failed
  createdAt: timestamp("created_at").defaultNow(),
  processedAt: timestamp("processed_at")
});
var insertUserSchema = createInsertSchema(users).pick({
  uid: true,
  username: true,
  displayName: true,
  email: true,
  profileImage: true,
  bio: true
});
var insertVideoSchema = createInsertSchema(videos).pick({
  userId: true,
  title: true,
  description: true,
  videoUrl: true,
  thumbnailUrl: true,
  musicId: true,
  isPublic: true
});
var insertCommentSchema = createInsertSchema(comments).pick({
  videoId: true,
  userId: true,
  content: true,
  parentId: true
});
var insertFollowSchema = createInsertSchema(follows).pick({
  followerId: true,
  followingId: true
});
var insertLikeSchema = createInsertSchema(likes).pick({
  userId: true,
  videoId: true
});
var insertMusicSchema = createInsertSchema(music).pick({
  title: true,
  artist: true,
  audioUrl: true,
  duration: true
});
var insertMonetizationSchema = createInsertSchema(monetization).pick({
  userId: true,
  creatorFundEnabled: true,
  virtualGiftsEnabled: true,
  brandPartnershipsEnabled: true,
  paymentMethod: true
});
var insertWithdrawalSchema = createInsertSchema(withdrawals).pick({
  userId: true,
  method: true,
  accountNumber: true,
  accountName: true,
  amount: true
});

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/users/:id", async (req, res) => {
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
  app2.get("/api/users/uid/:uid", async (req, res) => {
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
  app2.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });
  app2.patch("/api/users/:id", async (req, res) => {
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
  app2.get("/api/videos/feed", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId) : void 0;
      const limit = req.query.limit ? parseInt(req.query.limit) : 20;
      const videos2 = await storage.getFeedVideos(userId, limit);
      res.json(videos2);
    } catch (error) {
      res.status(500).json({ message: "Failed to get feed videos" });
    }
  });
  app2.get("/api/videos/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const videos2 = await storage.getVideosByUser(userId);
      res.json(videos2);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user videos" });
    }
  });
  app2.get("/api/videos/:id", async (req, res) => {
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
  app2.post("/api/videos", async (req, res) => {
    try {
      const videoData = insertVideoSchema.parse(req.body);
      const video = await storage.createVideo(videoData);
      res.status(201).json(video);
    } catch (error) {
      res.status(400).json({ message: "Invalid video data" });
    }
  });
  app2.post("/api/videos/:id/view", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.updateVideoStats(id, "views");
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to update views" });
    }
  });
  app2.get("/api/videos/:videoId/comments", async (req, res) => {
    try {
      const videoId = parseInt(req.params.videoId);
      const comments2 = await storage.getCommentsByVideo(videoId);
      res.json(comments2);
    } catch (error) {
      res.status(500).json({ message: "Failed to get comments" });
    }
  });
  app2.post("/api/comments", async (req, res) => {
    try {
      const commentData = insertCommentSchema.parse(req.body);
      const comment = await storage.createComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      res.status(400).json({ message: "Invalid comment data" });
    }
  });
  app2.get("/api/follows/:followerId/:followingId", async (req, res) => {
    try {
      const followerId = parseInt(req.params.followerId);
      const followingId = parseInt(req.params.followingId);
      const isFollowing = await storage.isFollowing(followerId, followingId);
      res.json({ isFollowing });
    } catch (error) {
      res.status(500).json({ message: "Failed to check follow status" });
    }
  });
  app2.post("/api/follows", async (req, res) => {
    try {
      const followData = insertFollowSchema.parse(req.body);
      const follow = await storage.createFollow(followData);
      res.status(201).json(follow);
    } catch (error) {
      res.status(400).json({ message: "Invalid follow data" });
    }
  });
  app2.delete("/api/follows/:followerId/:followingId", async (req, res) => {
    try {
      const followerId = parseInt(req.params.followerId);
      const followingId = parseInt(req.params.followingId);
      await storage.deleteFollow(followerId, followingId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to unfollow" });
    }
  });
  app2.get("/api/likes/:userId/:videoId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const videoId = parseInt(req.params.videoId);
      const isLiked = await storage.isLiked(userId, videoId);
      res.json({ isLiked });
    } catch (error) {
      res.status(500).json({ message: "Failed to check like status" });
    }
  });
  app2.post("/api/likes", async (req, res) => {
    try {
      const likeData = insertLikeSchema.parse(req.body);
      const like = await storage.createLike(likeData);
      res.status(201).json(like);
    } catch (error) {
      res.status(400).json({ message: "Invalid like data" });
    }
  });
  app2.delete("/api/likes/:userId/:videoId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const videoId = parseInt(req.params.videoId);
      await storage.deleteLike(userId, videoId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to unlike" });
    }
  });
  app2.get("/api/music", async (req, res) => {
    try {
      const music2 = await storage.getAllMusic();
      res.json(music2);
    } catch (error) {
      res.status(500).json({ message: "Failed to get music" });
    }
  });
  app2.get("/api/music/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const music2 = await storage.getMusic(id);
      if (!music2) {
        return res.status(404).json({ message: "Music not found" });
      }
      res.json(music2);
    } catch (error) {
      res.status(500).json({ message: "Failed to get music" });
    }
  });
  app2.post("/api/music", async (req, res) => {
    try {
      const musicData = insertMusicSchema.parse(req.body);
      const music2 = await storage.createMusic(musicData);
      res.status(201).json(music2);
    } catch (error) {
      res.status(400).json({ message: "Invalid music data" });
    }
  });
  app2.get("/api/monetization/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const monetization2 = await storage.getMonetization(userId);
      if (!monetization2) {
        return res.status(404).json({ message: "Monetization data not found" });
      }
      res.json(monetization2);
    } catch (error) {
      res.status(500).json({ message: "Failed to get monetization data" });
    }
  });
  app2.post("/api/monetization", async (req, res) => {
    try {
      const monetizationData = insertMonetizationSchema.parse(req.body);
      const monetization2 = await storage.createMonetization(monetizationData);
      res.status(201).json(monetization2);
    } catch (error) {
      res.status(400).json({ message: "Invalid monetization data" });
    }
  });
  app2.patch("/api/monetization/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const monetization2 = await storage.updateMonetization(userId, req.body);
      if (!monetization2) {
        return res.status(404).json({ message: "Monetization data not found" });
      }
      res.json(monetization2);
    } catch (error) {
      res.status(500).json({ message: "Failed to update monetization data" });
    }
  });
  app2.get("/api/withdrawals/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const withdrawals2 = await storage.getWithdrawalsByUser(userId);
      res.json(withdrawals2);
    } catch (error) {
      res.status(500).json({ message: "Failed to get withdrawals" });
    }
  });
  app2.post("/api/withdrawals", async (req, res) => {
    try {
      const withdrawalData = insertWithdrawalSchema.parse(req.body);
      const withdrawal = await storage.createWithdrawal(withdrawalData);
      res.status(201).json(withdrawal);
    } catch (error) {
      res.status(400).json({ message: "Invalid withdrawal data" });
    }
  });
  app2.patch("/api/withdrawals/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const withdrawal = await storage.updateWithdrawalStatus(id, status);
      if (!withdrawal) {
        return res.status(404).json({ message: "Withdrawal not found" });
      }
      res.json(withdrawal);
    } catch (error) {
      res.status(500).json({ message: "Failed to update withdrawal status" });
    }
  });
  app2.get("/api/users", async (req, res) => {
    try {
      const users2 = await storage.getAllUsers();
      res.json(users2);
    } catch (error) {
      res.status(500).json({ message: "Failed to get users" });
    }
  });
  app2.get("/api/users/username/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const user = await storage.getUserByUsername(username);
      if (user) {
        res.status(200).json({ available: false, user });
      } else {
        res.status(404).json({ available: true });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to check username" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
