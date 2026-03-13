import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// REGISTRO (Create)
export const register = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existing) throw new Error("El email ya está registrado");

    return await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      password: args.password,
      role: "user",
      plan: "free",
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${args.name}`,
    });
  },
});

// LOGIN
export const login = query({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!user || user.password !== args.password) {
      return null;
    }
    return user;
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    if (!args.email) return null;
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});

export const updatePlan = mutation({
  args: { 
    email: v.string(), 
    newPlan: v.union(v.literal("free"), v.literal("basic"), v.literal("premium")) 
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!user) throw new Error("Usuario no encontrado");

    await ctx.db.patch(user._id, { plan: args.newPlan });
    return { success: true };
  },
});