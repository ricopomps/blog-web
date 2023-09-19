import logo from "@/assets/images/logo.png";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import { User } from "@/models/user";
import * as UsersApi from "@/network/api/user";
import styles from "@/styles/NavBar.module.css";
import { AxiosError, isAxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { FiEdit } from "react-icons/fi";
import { toast } from "react-toastify";
import ProfileImage from "./ProfileImage";
import LoginModal from "./auth/LoginModal";
import SingUpModal from "./auth/SignUpModal";
import { handleError } from "@/utils/utils";

export default function NavBar() {
  const { user } = useAuthenticatedUser();
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
          {user ? <LoggedInView user={user} /> : <LoggedOutView />}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

interface LoggedInViewProps {
  user: User;
}

function LoggedInView({ user }: LoggedInViewProps) {
  const { mutateUser } = useAuthenticatedUser();

  async function logout() {
    try {
      await UsersApi.logout();
      mutateUser(null);
    } catch (error) {
      handleError(error);
    }
  }

  return (
    <Nav className="ms-auto">
      <Nav.Link
        as={Link}
        href="/blog/new-post"
        className="link-primary d-flex align-items-center gap-1"
      >
        <FiEdit />
        Create post
      </Nav.Link>
      <Navbar.Text className="ms-md-3">
        Hey, {user.displayName || "User"}!
      </Navbar.Text>
      <NavDropdown
        className={styles.accountDropdown}
        title={<ProfileImage src={user.profilePicUrl} />}
      >
        {user.username && (
          <>
            <NavDropdown.Item as={Link} href={`/users/${user.username}`}>
              Profile
            </NavDropdown.Item>
            <NavDropdown.Divider />
          </>
        )}

        <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
      </NavDropdown>
    </Nav>
  );
}

function LoggedOutView() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  return (
    <>
      <Nav className="ms-auto">
        <Button
          variant="outline-primary"
          onClick={() => setShowLoginModal(true)}
          className="ms-md-2 mt-2 mt-md-0"
        >
          Log In
        </Button>

        <Button
          onClick={() => setShowSignUpModal(true)}
          className="ms-md-2 mt-2 mt-md-0"
        >
          Sign Up
        </Button>
      </Nav>
      {showLoginModal && (
        <LoginModal
          onDismiss={() => setShowLoginModal(false)}
          onSignUpInsteadClicked={() => {
            setShowLoginModal(false);
            setShowSignUpModal(true);
          }}
          onForgotPasswordClicked={() => {}}
        />
      )}
      {showSignUpModal && (
        <SingUpModal
          onDismiss={() => setShowSignUpModal(false)}
          onLoginInsteadClicked={() => {
            setShowSignUpModal(false);
            setShowLoginModal(true);
          }}
        />
      )}
    </>
  );
}
