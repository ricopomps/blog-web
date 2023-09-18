import { BlogPost } from "@/models/blogPost";
import { GetStaticPaths, GetStaticProps } from "next";
import * as BlogApi from "@/network/api/blog";

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await BlogApi.getAllBlogPostsSlugs();

  const paths = slugs.map((slug) => ({ params: { slug } }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async ({
  params,
}) => {
  const slug = params?.slug?.toString();
  if (!slug) throw Error("Slug missing");

  const post = await BlogApi.getBlogPostBySlug(slug);
  return { props: { post } };
};

interface BlogPostPageProps {
  post: BlogPost;
}

export default function BlogPostPage({ post }: BlogPostPageProps) {
  return <>{JSON.stringify(post)}</>;
}
