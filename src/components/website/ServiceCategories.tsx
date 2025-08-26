import { Link } from "react-router-dom";
import ServiceHero from "./ServiceHero";

interface Service {
  name: string;
  icon: string;
}

const ServiceCategories: React.FC = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <ServiceHero />
    </div>
  );
};

export default ServiceCategories;
