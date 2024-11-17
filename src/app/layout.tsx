import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./../styles/globals.css";

import { Providers } from "./providers";
import NavBarComponent from "./components/NavBarMenu";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "SUNSOFT LIBRARY",
  description: "Experience a world of knowledge and inspiration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
          <NavBarComponent />
          {children}
        </Providers>
      </body>
    </html>
  );
}
