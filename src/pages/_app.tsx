import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import AuthModalsProvider from "@/components/auth/AuthModalsProvider";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import styles from "@/styles/App.module.css";
import "@/styles/globals.scss";
import "@/styles/utils.css";
import type { AppProps } from "next/app";
import { Raleway } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Container, SSRProvider } from "react-bootstrap";
import { ToastContainer } from "react-toastify";

const raleway = Raleway({ weight: "300", subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  useOnboardingRedirect();
  return (
    <>
      <Head>
        <title>Blog</title>
        <meta
          name="description"
          content="A full-stack NextJS course by Coding in Flow"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.ico" />
        <meta
          property="og:image"
          key="og:image"
          content="http://url.com/social_media_preview_image.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <SSRProvider>
        <AuthModalsProvider>
          <div className={raleway.className}>
            <NavBar />
            <main>
              <Container className={styles.pageContainer}>
                <Component {...pageProps} />
              </Container>
            </main>
            <ToastContainer />
            <Footer />
          </div>
        </AuthModalsProvider>
      </SSRProvider>
    </>
  );
}

function useOnboardingRedirect() {
  const { user } = useAuthenticatedUser();
  const router = useRouter();

  useEffect(() => {
    if (user && !user.username && router.pathname !== "/onboarding")
      router.push(`/onboarding?returnTo=${router.asPath}`);
  }, [user, router]);
}
