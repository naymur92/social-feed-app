import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Buddy Script",
  icons: { icon: "/assets/images/logo-copy.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8"></meta>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;400;500;600;700;800&display=swap" rel="stylesheet" />

        {/* Bootstrap */}
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />

        {/* Common Css */}
        <link rel="stylesheet" href="/assets/css/common.css" />

        {/* Custom Css */}
        <link rel="stylesheet" href="/assets/css/main.css" />

        {/* Responsive Css */}
        <link rel="stylesheet" href="/assets/css/responsive.css" />
      </head>

      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}