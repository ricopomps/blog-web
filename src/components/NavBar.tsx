import Link from "next/link";
import { useRouter } from "next/router";
import { Container, Nav, Navbar } from "react-bootstrap";
import { FiEdit } from "react-icons/fi";
import Image from "next/image";
import logo from "@/assets/images/logo.png";
import styles from "@/styles/NavBar.module.css";

export default function NavBar() {
  const router = useRouter();

  return (
    <Navbar expand="md" collapseOnSelect variant="dark" bg="body" sticky="top">
      <Container>
        <Navbar.Brand
          as={Link}
          href="/"
          className="d-flex align-items-center gap-1"
        >
          <Image src={logo} alt="logo" width={70} height={70} />
          <span className={styles.brandText}>Blog</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav>
            <Nav.Link as={Link} active={router.pathname === "/"} href="/">
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              active={router.pathname === "/blog"}
              href="/blog"
            >
              Articles
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            <Nav.Link
              as={Link}
              href="/blog/new-post"
              className="link-primary d-flex align-items-center gap-1"
            >
              <FiEdit />
              Create post
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
