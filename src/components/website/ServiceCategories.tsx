import { Link } from "react-router-dom";
import ServiceHero from "./ServiceHero";

interface Service {
  name: string;
  icon: string;
}

interface ServiceCategoriesProps {
  updateCity?: (city: string) => void;
}

const ServiceCategories: React.FC<ServiceCategoriesProps> = ({ updateCity }) => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <ServiceHero updateCity={updateCity} />
    </div>
  );
};

export default ServiceCategories;
