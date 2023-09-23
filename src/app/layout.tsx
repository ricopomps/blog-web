import OnBoardingRedirect from "@/components/OnBoardingRedirect";
import { Container } from "@/components/bootstrap";
import { Metadata } from "next";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import AuthModalsProvider from "./AuthModalsProvider";
import Footer from "./Footer/Footer";
import NavBar from "./NavBar/NavBar";
import "./globals.scss";
import "./utils.css";

export const metadata: Metadata = {
  title: "Blog",
  description: "A full-stack NextJS course by Coding in Flow",
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthModalsProvider>
          <NavBar />
          <main>
            <Container className="py-4">{children}</Container>
          </main>
          <Footer />
          <Suspense>
            <OnBoardingRedirect />
          </Suspense>
        </AuthModalsProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
