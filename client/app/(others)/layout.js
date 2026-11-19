import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function OthersLayout({ children }) {
  return (
    <div className="site-shell min-h-screen flex flex-col bg-white">
      <Navbar />
      <main id="main-content" className="flex-1 w-full py-4 sm:py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
