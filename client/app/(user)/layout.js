import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function UserLayout({ children }) {
  return (
    <div className="site-shell min-h-screen flex flex-col bg-white">
      <Navbar />
      <main id="main-content" className="flex-1 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
