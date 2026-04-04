import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
