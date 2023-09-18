import { BlogPost } from "@/models/blogPost";
import api from "@/network/axiosInstance";

interface CreateBlogPostValues {
  slug: string;
  title: string;
  summary: string;
  body: string;
}

const baseURL = "/posts";

export async function createBlogPost(input: CreateBlogPostValues) {
  const response = await api.post<BlogPost>(baseURL, input);
  return response.data;
}

export async function getAllBlogPosts() {
  const response = await api.get<BlogPost[]>(baseURL);
  return response.data;
}
