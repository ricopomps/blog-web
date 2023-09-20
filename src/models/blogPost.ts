import { User } from "./user";

export interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  summary: string;
  featuredImageUrl: string;
  body: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostPage {
  blogPosts: BlogPost[];
  page: number;
  totalPages: number;
}
