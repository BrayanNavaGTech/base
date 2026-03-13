import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const toggleFavorite = mutation({
  args: { userId: v.id("users"), movieId: v.id("movies") },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user_movie", (q) => 
        q.eq("userId", args.userId).eq("movieId", args.movieId)
      ).unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return false; // Quitado
    } else {
      await ctx.db.insert("favorites", { userId: args.userId, movieId: args.movieId });
      return true; // Agregado
    }
  },
});

export const getMyFavorites = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const favorites = await ctx.db
      .query("favorites")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    const movieIds = favorites.map((f) => f.movieId);
    const movies = await Promise.all(
      movieIds.map((id) => ctx.db.get(id))
    );
    return movies.filter((m) => m !== null);
  },
});

export const isFavorite = query({
  args: { userId: v.id("users"), movieId: v.id("movies") },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user_movie", (q) => 
        q.eq("userId", args.userId).eq("movieId", args.movieId)
      ).unique();
    return !!existing;
  },
});