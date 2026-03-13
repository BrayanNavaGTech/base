import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createMovie = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    youtubeUrl: v.string(),
    thumbnail: v.string(),
    category: v.string(),
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();

    if (!user || user.role !== "admin") {
      throw new Error("Acceso denegado: Se requieren permisos de administrador");
    }

    return await ctx.db.insert("movies", {
      title: args.title,
      description: args.description,
      youtubeUrl: args.youtubeUrl,
      thumbnail: args.thumbnail,
      category: args.category,
      isPublished: true,
    });
  },
});

export const listPublished = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("movies")
      .filter((q) => q.eq(q.field("isPublished"), true))
      .collect();
  },
});

export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    if (args.category === "Todas") {
      return await ctx.db.query("movies").filter((q) => q.eq(q.field("isPublished"), true)).collect();
    }
    return await ctx.db
      .query("movies")
      .filter((q) => 
        q.and(
          q.eq(q.field("isPublished"), true),
          q.eq(q.field("category"), args.category)
        )
      )
      .collect();
  },
});

export const getAllCategories = query({
  handler: async (ctx) => {
    const movies = await ctx.db.query("movies").collect();
    const categories = Array.from(new Set(movies.map((m) => m.category)));
    return ["Todas", ...categories];
  },
});

export const getById = query({
  args: { id: v.id("movies") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});