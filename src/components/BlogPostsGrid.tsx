import { Row, Col } from "react-bootstrap";
import BlogPostEntry from "./BlogPostEntry";
import { BlogPost } from "@/models/blogPost";
import styles from "@/styles/BlogPostsGrid.module.css";
interface BlogPostsGridProps {
  posts: BlogPost[];
}

export default function BlogPostsGrid({ posts }: BlogPostsGridProps) {
  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {posts.map((post) => (
        <Col key={post._id}>
          <BlogPostEntry post={post} className={styles.entry} />
        </Col>
      ))}
    </Row>
  );
}