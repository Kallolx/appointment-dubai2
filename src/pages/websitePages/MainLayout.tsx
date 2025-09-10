import BottomFooter from "@/components/website/BottomFooter";
import Footer from "@/components/website/Footer";
import Navbar from "@/components/website/Navbar";
import Tabby from "@/components/website/Tabby";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      {/* Navbar always on top */}
      <header className="sticky top-0 z-50 w-full">
        <Navbar />
        <Tabby />
      </header>
      
      <main className="w-full overflow-x-hidden">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-8 w-full">
        <Footer />
        <BottomFooter />
      </footer>
    </div>
  );
};

export default MainLayout;
