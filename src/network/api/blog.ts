import { BlogPost, BlogPostPage } from "@/models/blogPost";
import api from "@/network/axiosInstance";
import { generateFormData } from "@/utils/utils";

interface CreateBlogPostValues {
  slug: string;
  title: string;
  summary: string;
  body: string;
  featuredImage: File;
}

const baseUrl = "/posts";

export async function createBlogPost(input: CreateBlogPostValues) {
  const formData = generateFormData(input);

  const response = await api.post<BlogPost>(baseUrl, formData);
  return response.data;
}

export async function getAllBlogPosts(page: number = 1) {
  const response = await api.get<BlogPostPage>(baseUrl, { params: { page } });
  return response.data;
}

export async function getBlogPostsByUser(userId: string, page: number = 1) {
  const response = await api.get<BlogPostPage>(baseUrl, {
    params: { userId, page },
  });
  return response.data;
}

export async function getBlogPostBySlug(slug: string) {
  const response = await api.get<BlogPost>(`${baseUrl}/post/${slug}`);
  return response.data;
}

export async function getAllBlogPostsSlugs() {
  const response = await api.get<string[]>(`${baseUrl}/slugs`);
  return response.data;
}
