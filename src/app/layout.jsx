import "./globals.css";

export const metadata = {
  title: "Mex Tanim — Official Promotion & Media Agency",
  description: "Official promotional service booking platform for creators, brands, and digital media campaigns.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#F4F6F1" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#070806" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700;800&family=Geist:wght@400;500;600;700;800;900&family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=localStorage.getItem('mex-theme')||'dark';document.documentElement.setAttribute('data-theme',p==='light'?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`,
          }}
        />
      </head>
      <body className="min-h-screen antialiased selection:bg-[#FF2A3A] selection:text-black">
        {children}
      </body>
    </html>
  );
}
