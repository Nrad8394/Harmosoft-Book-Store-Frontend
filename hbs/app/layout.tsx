import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import Header from "./ui/header";
import Footer from "./ui/footer";
import ClientLayout from "./ui/clientLayout";
import { CartProvider } from "./context/CartContext";
import { ItemsProvider } from "./context/itemContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Harmosoft BookStore",
  description: "Created by Harmosoft",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ClientLayout>
            <ItemsProvider>
              <CartProvider>
                <Header />
                  <main className="min-h-screen" >{children}</main>
                <Footer />
              </CartProvider>
            </ItemsProvider>
          </ClientLayout>
       
        </AuthProvider>
      </body>
    </html>
  );
}
