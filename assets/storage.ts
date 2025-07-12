import { 
  users, videos, comments, follows, likes, music, monetization,
  type User, type InsertUser, type Video, type InsertVideo, 
  type Comment, type InsertComment, type Follow, type InsertFollow,
  type Like, type InsertLike, type Music, type InsertMusic,
  type Monetization, type InsertMonetization
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUid(uid: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Videos
  getVideo(id: number): Promise<Video | undefined>;
  getVideosByUser(userId: number): Promise<Video[]>;
  getFeedVideos(userId?: number, limit?: number): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideoStats(id: number, field: 'views' | 'likes' | 'comments' | 'shares'): Promise<void>;

  // Comments
  getCommentsByVideo(videoId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;

  // Follows
  isFollowing(followerId: number, followingId: number): Promise<boolean>;
  createFollow(follow: InsertFollow): Promise<Follow>;
  deleteFollow(followerId: number, followingId: number): Promise<void>;

  // Likes
  isLiked(userId: number, videoId: number): Promise<boolean>;
  createLike(like: InsertLike): Promise<Like>;
  deleteLike(userId: number, videoId: number): Promise<void>;

  // Music
  getMusic(id: number): Promise<Music | undefined>;
  getAllMusic(): Promise<Music[]>;
  createMusic(music: InsertMusic): Promise<Music>;

  // Monetization
  getMonetization(userId: number): Promise<Monetization | undefined>;
  createMonetization(monetization: InsertMonetization): Promise<Monetization>;
  updateMonetization(userId: number, updates: Partial<Monetization>): Promise<Monetization | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private videos: Map<number, Video> = new Map();
  private comments: Map<number, Comment> = new Map();
  private follows: Map<string, Follow> = new Map();
  private likes: Map<string, Like> = new Map();
  private music: Map<number, Music> = new Map();
  private monetization: Map<number, Monetization> = new Map();
  private currentId = 1;

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample music tracks
    const sampleMusic = [
      {
        title: "Upbeat Summer",
        artist: "DJ Audio",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 30,
      },
      {
        title: "Chill Vibes",
        artist: "Lo-Fi Master",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        duration: 45,
      },
    ];

    for (const musicData of sampleMusic) {
      const music: Music = {
        ...musicData,
        id: this.currentId++,
        createdAt: new Date(),
      };
      this.music.set(music.id, music);
    }

    // Sample users
    const sampleUsers = [
      {
        uid: "demo-user-1",
        username: "dancer_pro",
        displayName: "Pro Dancer",
        email: "dancer@example.com",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=dancer_pro",
        bio: "Professional dancer and choreographer 💃",
        followers: 15420,
        following: 892,
        totalLikes: 234560,
        isVerified: true,
      },
      {
        uid: "demo-user-2",
        username: "music_lover",
        displayName: "Music Lover",
        email: "music@example.com",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=music_lover",
        bio: "Creating beats and vibes 🎵",
        followers: 8934,
        following: 1245,
        totalLikes: 89450,
        isVerified: false,
      },
      {
        uid: "demo-user-3",
        username: "creative_soul",
        displayName: "Creative Soul",
        email: "creative@example.com",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=creative_soul",
        bio: "Art meets technology ✨",
        followers: 23150,
        following: 567,
        totalLikes: 156780,
        isVerified: true,
      },
    ];

    for (const userData of sampleUsers) {
      const user: User = {
        ...userData,
        id: this.currentId++,
        createdAt: new Date(),
      };
      this.users.set(user.id, user);
    }

    // Sample videos
    const sampleVideos = [
      {
        userId: 1,
        title: "Amazing Dance Moves",
        description: "Check out these sick dance moves! 🔥 #dance #viral #trending #foryou",
        videoUrl: "",
        thumbnailUrl: "",
        musicId: 1,
        views: 125340,
        likes: 23450,
        comments: 1234,
        shares: 567,
        isPublic: true,
      },
      {
        userId: 2,
        title: "Beat Drop Challenge",
        description: "When the beat drops 🎵 Can you handle it? #music #challenge #beatdrop",
        videoUrl: "",
        thumbnailUrl: "",
        musicId: 2,
        views: 89234,
        likes: 15678,
        comments: 892,
        shares: 234,
        isPublic: true,
      },
      {
        userId: 3,
        title: "Creative Art Process",
        description: "Watch me create magic ✨ Art is life! #art #creative #process #satisfying",
        videoUrl: "",
        thumbnailUrl: "",
        musicId: 1,
        views: 67890,
        likes: 12345,
        comments: 678,
        shares: 123,
        isPublic: true,
      },
      {
        userId: 1,
        title: "Quick Tutorial",
        description: "Learn this move in 30 seconds! 💪 #tutorial #dance #learn #quick",
        videoUrl: "",
        thumbnailUrl: "",
        musicId: 2,
        views: 234567,
        likes: 45678,
        comments: 2345,
        shares: 890,
        isPublic: true,
      },
    ];

    for (const videoData of sampleVideos) {
      const video: Video = {
        ...videoData,
        id: this.currentId++,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time within last week
      };
      this.videos.set(video.id, video);
    }

    // Sample comments
    const sampleComments = [
      {
        videoId: 3,
        userId: 2,
        content: "This is incredible! How did you learn to do this?",
        likes: 23,
      },
      {
        videoId: 3,
        userId: 1,
        content: "Amazing work! 🔥",
        likes: 45,
      },
      {
        videoId: 4,
        userId: 3,
        content: "I tried this and it worked perfectly! Thanks!",
        likes: 67,
      },
      {
        videoId: 5,
        userId: 2,
        content: "The creativity is off the charts! 🎨",
        likes: 34,
      },
    ];

    for (const commentData of sampleComments) {
      const comment: Comment = {
        ...commentData,
        id: this.currentId++,
        parentId: null,
        createdAt: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000), // Random time within last 3 days
      };
      this.comments.set(comment.id, comment);
    }

    // Sample monetization data
    for (let i = 1; i <= 3; i++) {
      const monetization: Monetization = {
        id: this.currentId++,
        userId: i,
        totalEarnings: Math.floor(Math.random() * 500000) + 10000, // $100-$5000
        monthlyEarnings: Math.floor(Math.random() * 100000) + 5000, // $50-$1000
        weeklyEarnings: Math.floor(Math.random() * 25000) + 1000, // $10-$250
        engagementRate: Math.floor(Math.random() * 1000) + 500, // 5-15%
        creatorFundEnabled: true,
        virtualGiftsEnabled: Math.random() > 0.5,
        brandPartnershipsEnabled: i <= 2, // Only first two users
        paymentMethod: "PayPal",
        updatedAt: new Date(),
      };
      this.monetization.set(i, monetization);
    }
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUid(uid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.uid === uid);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      ...insertUser,
      id,
      followers: 0,
      following: 0,
      totalLikes: 0,
      isVerified: false,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Videos
  async getVideo(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async getVideosByUser(userId: number): Promise<Video[]> {
    return Array.from(this.videos.values()).filter(video => video.userId === userId);
  }

  async getFeedVideos(userId?: number, limit = 20): Promise<Video[]> {
    return Array.from(this.videos.values())
      .filter(video => video.isPublic)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = this.currentId++;
    const video: Video = {
      ...insertVideo,
      id,
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: new Date(),
    };
    this.videos.set(id, video);
    return video;
  }

  async updateVideoStats(id: number, field: 'views' | 'likes' | 'comments' | 'shares'): Promise<void> {
    const video = this.videos.get(id);
    if (video) {
      video[field] = (video[field] || 0) + 1;
      this.videos.set(id, video);
    }
  }

  // Comments
  async getCommentsByVideo(videoId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.videoId === videoId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.currentId++;
    const comment: Comment = {
      ...insertComment,
      id,
      likes: 0,
      createdAt: new Date(),
    };
    this.comments.set(id, comment);

    // Update video comment count
    if (insertComment.videoId) {
      await this.updateVideoStats(insertComment.videoId, 'comments');
    }

    return comment;
  }

  // Follows
  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    return this.follows.has(`${followerId}-${followingId}`);
  }

  async createFollow(insertFollow: InsertFollow): Promise<Follow> {
    const id = this.currentId++;
    const follow: Follow = {
      ...insertFollow,
      id,
      createdAt: new Date(),
    };
    this.follows.set(`${insertFollow.followerId}-${insertFollow.followingId}`, follow);

    // Update follower counts
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

  async deleteFollow(followerId: number, followingId: number): Promise<void> {
    this.follows.delete(`${followerId}-${followingId}`);

    // Update follower counts
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
  async isLiked(userId: number, videoId: number): Promise<boolean> {
    return this.likes.has(`${userId}-${videoId}`);
  }

  async createLike(insertLike: InsertLike): Promise<Like> {
    const id = this.currentId++;
    const like: Like = {
      ...insertLike,
      id,
      createdAt: new Date(),
    };
    this.likes.set(`${insertLike.userId}-${insertLike.videoId}`, like);

    // Update video like count
    if (insertLike.videoId) {
      await this.updateVideoStats(insertLike.videoId, 'likes');
    }

    return like;
  }

  async deleteLike(userId: number, videoId: number): Promise<void> {
    this.likes.delete(`${userId}-${videoId}`);

    // Update video like count
    const video = this.videos.get(videoId);
    if (video) {
      video.likes = Math.max(0, (video.likes || 0) - 1);
      this.videos.set(videoId, video);
    }
  }

  // Music
  async getMusic(id: number): Promise<Music | undefined> {
    return this.music.get(id);
  }

  async getAllMusic(): Promise<Music[]> {
    return Array.from(this.music.values());
  }

  async createMusic(insertMusic: InsertMusic): Promise<Music> {
    const id = this.currentId++;
    const music: Music = {
      ...insertMusic,
      id,
      createdAt: new Date(),
    };
    this.music.set(id, music);
    return music;
  }

  // Monetization
  async getMonetization(userId: number): Promise<Monetization | undefined> {
    return this.monetization.get(userId);
  }

  async createMonetization(insertMonetization: InsertMonetization): Promise<Monetization> {
    const id = this.currentId++;
    const monetization: Monetization = {
      ...insertMonetization,
      id,
      totalEarnings: 0,
      monthlyEarnings: 0,
      weeklyEarnings: 0,
      engagementRate: 0,
      updatedAt: new Date(),
    };
    this.monetization.set(insertMonetization.userId!, monetization);
    return monetization;
  }

  async updateMonetization(userId: number, updates: Partial<Monetization>): Promise<Monetization | undefined> {
    const monetization = this.monetization.get(userId);
    if (!monetization) return undefined;
    const updated = { ...monetization, ...updates, updatedAt: new Date() };
    this.monetization.set(userId, updated);
    return updated;
  }
}

export const storage = new MemStorage();
