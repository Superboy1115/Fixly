import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import { AuthProvider } from "../components/AuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FIXLY | AI Construction Safety",
  description: "AI-Powered Construction Hazard Detection & Remediation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased relative min-h-screen selection:bg-primary selection:text-primary-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <AuthProvider>
            {/* Ambient Background Orbs */}
            <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
              <div className="absolute top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px] dark:bg-primary/30 transition-colors duration-500" />
              <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-secondary/30 blur-[150px] dark:bg-purple-600/20 transition-colors duration-500" />
            </div>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
