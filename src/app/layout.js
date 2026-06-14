import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BlogProvider } from "@/context/BlogContext";
import { Toaster } from "sonner";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
import "antd/dist/reset.css";
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dashboard",
  description: "Plutohub Agency Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden `}
      >
        <BlogProvider>
          {children}
          <Toaster richColors position='bottom-right' />
        </BlogProvider>
      </body>
    </html>
  );
}
