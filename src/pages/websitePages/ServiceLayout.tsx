import Footer from "@/components/website/Footer";
import Navbar from "@/components/website/Navbar";
import { useParams } from "react-router-dom";
import CheckoutService from "./CheckoutService";

const ServiceLayout = () => {
  const { category, serviceSlug } = useParams();
  return (
    <div>
      <header className="fixed top-0 left-0 right-0 z-[200] w-full">
        <Navbar />
      </header>

      {/* Add top padding equal to navbar height so content is not hidden behind the fixed navbar */}
      <div className="pt-16">
        <CheckoutService category={category} serviceSlug={serviceSlug} />
        <div className="hidden md:block">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ServiceLayout;
