import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Author schema
export const authors = pgTable("authors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  avatar: text("avatar").notNull(),
  bio: text("bio").notNull(),
  role: text("role").notNull(),
  articleCount: integer("article_count").notNull().default(0),
  followerCount: integer("follower_count").notNull().default(0),
  social: jsonb("social").$type<{
    twitter?: string;
    linkedin?: string;
    website?: string;
    email?: string;
  }>(),
});

// Category schema
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
});

// Article schema
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  coverImage: text("cover_image").notNull(),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  authorId: integer("author_id").notNull().references(() => authors.id),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  readingTime: integer("reading_time").notNull(),
  viewCount: integer("view_count").notNull().default(0),
  isFeatured: boolean("is_featured").notNull().default(false),
});

// Comment schema
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  articleId: integer("article_id").notNull().references(() => articles.id),
  authorId: integer("author_id").notNull().references(() => authors.id),
  likes: integer("likes").notNull().default(0),
});

// Insert schemas
export const insertAuthorSchema = createInsertSchema(authors);
export const insertCategorySchema = createInsertSchema(categories);
export const insertArticleSchema = createInsertSchema(articles);
export const insertCommentSchema = createInsertSchema(comments);

// Model types
export type Author = typeof authors.$inferSelect & {
  social?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
    email?: string;
  };
};

export type Category = typeof categories.$inferSelect;

export type Article = typeof articles.$inferSelect & {
  author: Author;
  category: Category;
};

export type Comment = typeof comments.$inferSelect & {
  author: Author;
};

// Insert types
export type InsertAuthor = z.infer<typeof insertAuthorSchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type InsertComment = z.infer<typeof insertCommentSchema>;
