import Provider from "@components/Provider";
import ToasterContent from "@components/ToasterContent";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Auth Halo Chat",
  description: "Build a Next 14 Chat App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-purple-1`}>
        <Provider>
          <ToasterContent />
          {children}
        </Provider>
      </body>
    </html>
  );
}
