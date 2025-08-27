import BottomFooter from "@/components/website/BottomFooter";
import Footer from "@/components/website/Footer";
import Navbar from "@/components/website/Navbar";
import Tabby from "@/components/website/Tabby";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div>
      <div>
        <Navbar />
        <Tabby />
        <Outlet />
      </div>
      <Footer />
      <BottomFooter />
    </div>
  );
};

export default MainLayout;
