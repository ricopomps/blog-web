import "@/styles/globals.scss";
import "@/styles/utils.css";
import { Raleway } from "next/font/google";
import Head from "next/head";
import type { AppProps } from "next/app";
import { Container, SSRProvider } from "react-bootstrap";
import styles from "@/styles/App.module.css";
import { ToastContainer } from "react-toastify";
import NextNProgress from "nextjs-progressbar";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SingUpModal from "@/components/auth/SignUpModal";
import LoginModal from "@/components/auth/LoginModal";

const raleway = Raleway({ weight: "300", subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Blog</title>
        <meta
          name="description"
          content="A full-stack NextJS course by Coding in Flow"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SSRProvider>
        <div className={raleway.className}>
          <NextNProgress color="#21fa90" />
          <NavBar />
          <main>
            <Container className={styles.pageContainer}>
              <Component {...pageProps} />
            </Container>
          </main>
          <ToastContainer />
          <Footer />
          <SingUpModal onDismiss={() => {}} onLoginInsteadClicked={() => {}} />
          <LoginModal
            onDismiss={() => {}}
            onForgotPasswordClicked={() => {}}
            onSignUpInsteadClicked={() => {}}
          />
        </div>
      </SSRProvider>
    </>
  );
}
