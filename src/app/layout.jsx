import "./globals.css";

export const metadata = {
  title: "TFR — Admin Panel",
  description: "Admin Panel",
  icons: {
    icon: '/favicon.svg', // Points to public/favicon.ico
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}