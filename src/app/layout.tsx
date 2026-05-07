import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const roca = localFont({
  src: [
    {
      path: "../../public/Fonts/Roca_font_file/fonnts.com-Roca-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/Fonts/Roca_font_file/fonnts.com-Roca-Black.otf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-roca",
  display: "swap",
});

const zeitung = localFont({
  src: [
    {
      path: "../../public/Fonts/zeitung-pro-maisfontes.7ed8/zeitung-pro.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-zeitung",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mmd-mothersday.vercel.app"),
  title: "Mother's Day Yogurt Bowl Maker 🍓",
  description: "Create a delicious, custom yogurt bowl for your Mom and send her a special Mother's Day gift!",
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "Mother's Day Yogurt Bowl Maker 🍓",
    description: "Create a delicious, custom yogurt bowl for your Mom and send her a special Mother's Day gift!",
    url: "https://mmd-mothersday.vercel.app",
    siteName: "Mother's Day Gift",
    images: [
      {
        url: "/images/logo.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mother's Day Yogurt Bowl Maker 🍓",
    description: "Create a delicious, custom yogurt bowl for your Mom and send her a special Mother's Day gift!",
    images: ["/images/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${roca.variable} ${zeitung.variable}`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
