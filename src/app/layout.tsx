
"use client";
import Providers from "./provider";
import "./globals.css";
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="data" suppressHydrationWarning>
      <body>
         <InitColorSchemeScript attribute="class" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
