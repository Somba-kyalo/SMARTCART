import type { Metadata, Viewport } from "next";
import { CartProvider } from "@/components/cart-provider";
import "./styles.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "SmartCart Africa | Shop smart. Live better.",
  description: "Useful, thoughtful finds for everyday life. Shop SmartCart Africa in Kenya.",
  applicationName: "SmartCart Africa",
  alternates: { canonical: "/" },
  keywords: ["Kenya online shopping", "everyday essentials", "SmartCart Africa"],
  robots: { index: true, follow: true },
  openGraph: {
    title: "SmartCart Africa",
    description: "Good finds for the way you live.",
    type: "website",
    siteName: "SmartCart Africa",
    locale: "en_KE",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartCart Africa",
    description: "Good finds for the way you live.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#101B2D",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to content</a><CartProvider>{children}</CartProvider></body></html>;
}
