import Head from "next/head";
import { Button } from "react-bootstrap";

export default function BlogPage() {
  return (
    <>
      <Head>
        <title>Articles - Blog</title>
        <meta name="description" content="Read the coolest blog posts!" />
      </Head>
      <div>
        <div>blog</div>
        <div>
          <Button>Button</Button>
        </div>
      </div>
    </>
  );
}
