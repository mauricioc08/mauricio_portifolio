import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import { I18nProvider } from "@/lib/i18n/context";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mauriciocassiano.dev"),
  title: {
    default: "Mauricio Cassiano — Desenvolvedor FullStack",
    template: "%s · mauricio.dev",
  },
  description:
    "Portfólio de Mauricio Cassiano, Desenvolvedor FullStack — React, Next.js, Ruby on Rails, Node.js e mais.",
  authors: [{ name: "Mauricio Cassiano" }],
  keywords: [
    "desenvolvedor",
    "fullstack",
    "next.js",
    "react",
    "ruby on rails",
    "node.js",
    "portfolio",
  ],
  openGraph: {
    type: "website",
    title: "Mauricio Cassiano — Desenvolvedor FullStack",
    description: "Portfólio de Mauricio Cassiano, Desenvolvedor FullStack.",
    images: ["/images/me.webp"],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0b0f",
  colorScheme: "dark light",
};

// evita flash de tema errado: aplica data-theme antes da pintura
const themeScript = `
(function(){try{
  var t=localStorage.getItem('portfolio-theme');
  if(!t){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}
  document.documentElement.setAttribute('data-theme',t);
}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      data-theme="dark"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full">
        <ThemeProvider>
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
