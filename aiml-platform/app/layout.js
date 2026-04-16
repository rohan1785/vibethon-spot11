import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/context/AppProviders";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const space = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata = {
  title: "AIML Nexus",
  description: "All-in-One AIML Learning Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${manrope.variable} ${space.variable}`}>
      <body className="app-shell">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
