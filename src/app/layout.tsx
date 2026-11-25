import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AudioAtmosphereProvider } from "@/context/AudioAtmosphereContext";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0B0F19",
};

export const metadata: Metadata = {
  title: "RAVANA TRAIL — The Chronicle of Lanka",
  description: "Cinematic, interactive tourism and historical storytelling trail mapping King Ravana's life journey to modern-day locations in Sri Lanka.",
  keywords: ["Ravana", "Sri Lanka", "Tourism", "Ramayana", "Sigiriya", "Laggala", "Yahangala", "History"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800;900&family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Sinhala:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-obsidian text-slate-100 antialiased selection:bg-amber-500/30 selection:text-amber-200">
        <LanguageProvider>
          <AudioAtmosphereProvider>
            {children}
          </AudioAtmosphereProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
