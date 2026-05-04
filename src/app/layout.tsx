import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mother's Day Yogurt Bowl Maker 🍓",
  description: "Create a delicious, custom yogurt bowl for your Mom and send her a special Mother's Day gift!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
