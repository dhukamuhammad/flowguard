import Navbar from "@/components/client/Navbar";
import Footer from "@/components/client/Footer";

export default function ClientLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#1A1A1A] text-[#F8FAFC] antialiased selection:bg-[#E53935] selection:text-white">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
