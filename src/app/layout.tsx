import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GradientLab - CSS Gradient Generator",
  description:
    "A professional CSS gradient generator tool. Create linear, radial, and conic gradients with an intuitive visual editor. Copy CSS code with one click.",
  keywords: [
    "CSS gradient",
    "gradient generator",
    "linear gradient",
    "radial gradient",
    "conic gradient",
    "CSS tool",
    "web developer tool",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
