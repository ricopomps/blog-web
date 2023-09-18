import { BlogPost } from "@/models/blogPost";
import api from "@/network/axiosInstance";

interface CreateBlogPostValues {
  slug: string;
  title: string;
  summary: string;
  body: string;
  featuredImage: File;
}

const baseURL = "/posts";

export async function createBlogPost(input: CreateBlogPostValues) {
  const formData = new FormData();

  Object.entries(input).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const response = await api.post<BlogPost>(baseURL, formData);
  return response.data;
}

export async function getAllBlogPosts() {
  const response = await api.get<BlogPost[]>(baseURL);
  return response.data;
}
