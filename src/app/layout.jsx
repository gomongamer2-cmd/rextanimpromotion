import "./globals.css";

export const metadata = {
  title: "Mex Tanim Esports — Promotion & Advertising Booking",
  description: "Official promotional service booking platform for games, tournament platforms, and brands.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-canvas text-neutral-200 antialiased selection:bg-brand selection:text-white">
        {children}
      </body>
    </html>
  );
}
