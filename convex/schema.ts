import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.string(),
    role: v.union(v.literal("user"), v.literal("admin")),
    plan: v.union(v.literal("free"), v.literal("basic"), v.literal("premium")),
    avatarUrl: v.optional(v.string()),
  }).index("by_email", ["email"]),

  movies: defineTable({
    title: v.string(),
    description: v.string(),
    youtubeUrl: v.string(),
    thumbnail: v.string(),
    category: v.string(),
    isPublished: v.boolean(),
  }),

  favorites: defineTable({
    userId: v.id("users"),
    movieId: v.id("movies"),
  }).index("by_user_movie", ["userId", "movieId"]),
});