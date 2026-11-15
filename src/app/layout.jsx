import "./globals.css";
import { Outfit } from "next/font/google";
import AppToaster from "@/components/common/AppToaster";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata = {
  title: "Flow Guard | Precision Flow Control & Industrial Monitoring",
  description:
    "Next-generation flow sensors, valves, and industrial monitoring systems powered by Next.js and Supabase.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`h-full antialiased ${outfit.variable}`}>
      <body className={`min-h-full flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 ${outfit.className}`}>
        <AppToaster />
        {children}
      </body>
    </html>
  );
}