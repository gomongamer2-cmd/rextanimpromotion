import "./globals.css";

export const metadata = {
  title: "Mex Tanim Esports — Promotion & Advertising Booking",
  description: "Official promotional service booking platform for games, tournament platforms, and brands.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700;800&family=Geist:wght@400;500;600;700;800;900&family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#070806] text-[#f4f6f1] antialiased selection:bg-[#FF2A3A] selection:text-black">
        {children}
      </body>
    </html>
  );
}
