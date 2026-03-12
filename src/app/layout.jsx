import "./globals.css";

export const metadata = {
  title: "TFR — Admin Panel",
  description: "Admin Panel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}