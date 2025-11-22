import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "@/components/layout/Navbar";
import Container from "@/components/layout/Container";
import SocketProvider from "@/providers/SocketProvider";
import { ModalProvider } from "@/context/ModalContext";

export const metadata: Metadata = {
  title: "My video call",
  description: "video call for you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={"relative"}>
          <ModalProvider>
            <SocketProvider>
              <main className="flex flex-col min-h-screen bg-secondary">
                <NavBar />
                <Container>{children}</Container>
              </main>
            </SocketProvider>
          </ModalProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
