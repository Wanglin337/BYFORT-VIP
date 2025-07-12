import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(), // Firebase UID
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  email: text("email").notNull().unique(),
  profileImage: text("profile_image"),
  bio: text("bio"),
  followers: integer("followers").default(0),
  following: integer("following").default(0),
  totalLikes: integer("total_likes").default(0),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const videos = pgTable("videos", {
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
  createdAt: timestamp("created_at").defaultNow(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").references(() => videos.id),
  userId: integer("user_id").references(() => users.id),
  content: text("content").notNull(),
  likes: integer("likes").default(0),
  parentId: integer("parent_id"), // For replies
  createdAt: timestamp("created_at").defaultNow(),
});

export const follows = pgTable("follows", {
  id: serial("id").primaryKey(),
  followerId: integer("follower_id").references(() => users.id),
  followingId: integer("following_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  videoId: integer("video_id").references(() => videos.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const music = pgTable("music", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  audioUrl: text("audio_url").notNull(),
  duration: integer("duration"), // in seconds
  createdAt: timestamp("created_at").defaultNow(),
});

export const monetization = pgTable("monetization", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  totalEarnings: integer("total_earnings").default(0), // in cents
  monthlyEarnings: integer("monthly_earnings").default(0),
  weeklyEarnings: integer("weekly_earnings").default(0),
  engagementRate: integer("engagement_rate").default(0), // percentage * 100
  creatorFundEnabled: boolean("creator_fund_enabled").default(false),
  virtualGiftsEnabled: boolean("virtual_gifts_enabled").default(false),
  brandPartnershipsEnabled: boolean("brand_partnerships_enabled").default(false),
  paymentMethod: text("payment_method"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  uid: true,
  username: true,
  displayName: true,
  email: true,
  profileImage: true,
  bio: true,
});

export const insertVideoSchema = createInsertSchema(videos).pick({
  userId: true,
  title: true,
  description: true,
  videoUrl: true,
  thumbnailUrl: true,
  musicId: true,
  isPublic: true,
});

export const insertCommentSchema = createInsertSchema(comments).pick({
  videoId: true,
  userId: true,
  content: true,
  parentId: true,
});

export const insertFollowSchema = createInsertSchema(follows).pick({
  followerId: true,
  followingId: true,
});

export const insertLikeSchema = createInsertSchema(likes).pick({
  userId: true,
  videoId: true,
});

export const insertMusicSchema = createInsertSchema(music).pick({
  title: true,
  artist: true,
  audioUrl: true,
  duration: true,
});

export const insertMonetizationSchema = createInsertSchema(monetization).pick({
  userId: true,
  creatorFundEnabled: true,
  virtualGiftsEnabled: true,
  brandPartnershipsEnabled: true,
  paymentMethod: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertFollow = z.infer<typeof insertFollowSchema>;
export type Follow = typeof follows.$inferSelect;
export type InsertLike = z.infer<typeof insertLikeSchema>;
export type Like = typeof likes.$inferSelect;
export type InsertMusic = z.infer<typeof insertMusicSchema>;
export type Music = typeof music.$inferSelect;
export type InsertMonetization = z.infer<typeof insertMonetizationSchema>;
export type Monetization = typeof monetization.$inferSelect;
