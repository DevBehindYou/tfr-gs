import "./globals.css";

export const metadata = {
  title: "Blog Search",
  description: "Search and discover blogs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}