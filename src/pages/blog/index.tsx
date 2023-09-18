import BlogPostsGrid from "@/components/BlogPostsGrid";
import { BlogPost } from "@/models/blogPost";
import * as BlogApi from "@/network/api/blog";
import { GetServerSideProps } from "next";
import Head from "next/head";

export const getServerSideProps: GetServerSideProps<
  BlogPageProps
> = async () => {
  const posts = await BlogApi.getAllBlogPosts();
  return { props: { posts } };
};

interface BlogPageProps {
  posts: BlogPost[];
}

export default function BlogPage({ posts }: BlogPageProps) {
  return (
    <>
      <Head>
        <title>Articles - Blog</title>
        <meta name="description" content="Read the coolest blog posts!" />
      </Head>
      <div>
        <h1>Blog</h1>
        <BlogPostsGrid posts={posts} />
      </div>
    </>
  );
}
