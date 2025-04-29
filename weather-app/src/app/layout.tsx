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
  title: "Weather App",
  description: "See the weather, anywhere in the world",
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
        <section className="h-screen">
          <div className="container mx-auto py-5 h-full">
            <div className="flex justify-center items-center h-full">
              <div className="w-full md:w-3/4 px-4">{children}</div>
            </div>
          </div>
        </section>
      </body>
    </html>
  );
}
