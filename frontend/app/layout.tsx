import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://sdk.minepi.com/pi-sdk.js" async />
        <script>var Pi = window.Pi;</script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
