import { BlogPost } from "@/models/blogPost";
import { formatDate } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";
import { Card } from "react-bootstrap";

interface BlogPostEntryProps {
  post: BlogPost;
  className?: string;
}
export default function BlogPostEntry({
  post: { slug, title, featuredImageUrl, body, summary, createdAt },
  className,
}: BlogPostEntryProps) {
  const postLink = `/blog/${slug}`;

  return (
    <Card className={className}>
      <article>
        <Card.Body>
          <Image
            src={featuredImageUrl}
            alt="Post image"
            height={300}
            width={450}
          ></Image>
          <Card.Title>
            <Link href={postLink}>{title}</Link>
          </Card.Title>
          <Card.Text>{summary}</Card.Text>
          <Card.Text className="text-muted small">
            <time dateTime={createdAt}>{formatDate(createdAt)}</time>
          </Card.Text>
        </Card.Body>
      </article>
    </Card>
  );
}
