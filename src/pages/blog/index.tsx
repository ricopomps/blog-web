import BlogPostsGrid from "@/components/BlogPostsGrid";
import PaginationBar from "@/components/PaginationBar";
import { BlogPost, BlogPostPage } from "@/models/blogPost";
import * as BlogApi from "@/network/api/blog";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { stringify } from "querystring";

export const getServerSideProps: GetServerSideProps<BlogPageProps> = async ({
  query,
}) => {
  const page = parseInt(query.page?.toString() || "1");

  if (page < 1) {
    query.page = "1";
    return {
      redirect: {
        destination: "/blog?" + stringify(query),
        permanent: false,
      },
    };
  }

  const data = await BlogApi.getAllBlogPosts(page);

  if (data.totalPages > 0 && page > data.totalPages) {
    query.page = data.totalPages.toString();
    return {
      redirect: {
        destination: "/blog?" + stringify(query),
        permanent: false,
      },
    };
  }

  return { props: { data } };
};

interface BlogPageProps {
  data: BlogPostPage;
}

export default function BlogPage({
  data: { blogPosts, page, totalPages },
}: BlogPageProps) {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Articles - Blog</title>
        <meta name="description" content="Read the coolest blog posts!" />
      </Head>
      <div>
        <h1>Blog</h1>
        {blogPosts.length > 0 && <BlogPostsGrid posts={blogPosts} />}
        <div className="d-flex flex-column align-items-center">
          {blogPosts.length === 0 && <p>No blog posts found</p>}
          {blogPosts.length > 0 && (
            <PaginationBar
              currentPage={page}
              pageCount={totalPages}
              onPageItemClicked={(page) => {
                router.push({ query: { ...router.query, page } });
              }}
              className="mt-4"
            />
          )}
        </div>
      </div>
    </>
  );
}
