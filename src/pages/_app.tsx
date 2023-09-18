import "@/styles/globals.css";
import { Inter } from "next/font/google";
import Head from "next/head";
import type { AppProps } from "next/app";

const inter = Inter({ subsets: ["latin"] });

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
      <div className={inter.className}>
        <main>
          <Component {...pageProps} />
        </main>
      </div>
    </>
  );
}
