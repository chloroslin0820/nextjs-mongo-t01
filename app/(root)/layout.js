import Provider from "@components/Provider";
import Topbar from "@components/Topbar";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Halo Chat App",
  description: "A Next.js 14 Chat App",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-blue-2`}>
        <Provider>
          <Topbar />
          {children}
        </Provider>
      </body>
    </html>
  );
}
