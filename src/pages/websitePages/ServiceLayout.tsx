import Footer from "@/components/website/Footer";
import { Navbar } from "@/components/website/Navbar";
import { useParams } from "react-router-dom";
import CheckoutService from "./CheckoutService";

const ServiceLayout = () => {
  const { category, serviceSlug } = useParams();
  return (
    <div>
      <Navbar></Navbar>

      <CheckoutService category={category} serviceSlug={serviceSlug} />
      <div className="hidden md:block">
        <Footer></Footer>
      </div>
    </div>
  );
};

export default ServiceLayout;
