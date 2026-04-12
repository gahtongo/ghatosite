import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "./components/SiteChrome";

export const metadata: Metadata = {
  title: "GAHTO",
  description: "Global Anti Human Trafficking Organisation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black pb-20">
        <SiteChrome />
        {children}
      </body>
    </html>
  );
}