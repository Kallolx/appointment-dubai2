import { Link } from "react-router-dom";
import BottomFooter from "./BottomFooter";

const Footer = () => {
  return (
    <footer className="bg-[#01788e] text-white px-4 md:px-16 py-10 text-md">
      <div className="max-w-7xl mx-auto">
        {/* TOP SECTION - Service Links (4 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Moving & Storage */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Moving & Storage</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="hover:text-white transition">Local Moving In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">International Moving From Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Villa Moving In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Furniture Moving In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Office Moving In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Storage In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Furniture Storage In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Self Storage In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Car Shipping In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Moving To Australia From Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Moving To Canada From Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Moving To India From Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Moving To Lebanon From Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Moving To The UK From Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Moving To The USA From Dubai</Link></li>
            </ul>
            
            <h4 className="font-semibold mt-6 mb-3">Cleaning Services</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="hover:text-white transition">Home Cleaning Services In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Laundry Services In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Sofa Cleaning In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Car Wash At Home In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Deep Cleaning In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Carpet Cleaning In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Mattress Cleaning In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Curtain Cleaning In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Office Cleaning Services In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Water Tank Cleaning In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Window Cleaning For Villas In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Holiday Home Cleaning In Dubai</Link></li>
            </ul>
          </div>

          {/* Maintenance & Handyman */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Maintenance & Handyman</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="hover:text-white transition">Handyman In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Annual Maintenance Contracts In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Building And Flooring In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Carpentry In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Curtain And Blinds Hanging In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Curtains And Blinds In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Electrician In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Furniture Assembly In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Light Bulbs And Spotlights In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Locksmiths In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Plumber In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">TV Mounting In Dubai</Link></li>
            </ul>
            
            <h4 className="font-semibold mt-6 mb-3">Gardening</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="hover:text-white transition">Annual Gardening Contract In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Gardening In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Gazebos, Decks And Porches In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Grass Lawns In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Landscaping In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Swimming Pools And Water Features In Dubai</Link></li>
            </ul>
          </div>

          {/* Salon at Home */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Salon at Home</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="hover:text-white transition">Women's Salon At Home In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Spa At Home In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Men's Salon At Home In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Nails At Home In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Waxing At Home In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Hair At Home In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Luxury Salon At Home In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Lashes And Brows At Home In Dubai</Link></li>
            </ul>
            
            <h4 className="font-semibold mt-6 mb-3">Health at Home</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="hover:text-white transition">Doctor On Call In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Nurse At Home In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">IV Drip At Home In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Blood Tests At Home In Dubai</Link></li>
            </ul>
            
            <h4 className="font-semibold mt-6 mb-3">Nannies and Maids</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="hover:text-white transition">Babysitters And Nannies In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Full-Time Maids In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Part-Time Maids In Dubai</Link></li>
            </ul>
          </div>

          {/* AC Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">AC Services</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="hover:text-white transition">AC Cleaning In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">AC Duct Cleaning In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">AC Installation In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">AC Maintenance In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">AC Repair In Dubai</Link></li>
            </ul>
            
            <h4 className="font-semibold mt-6 mb-3">Pest Control</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="hover:text-white transition">Pest Control In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Mosquitoes Pest Control In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Ants Pest Control In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Bed Bugs Pest Control In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Cockroach Pest Control In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Rats And Mice Pest Control In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Termites Pest Control In Dubai</Link></li>
            </ul>
            
            <h4 className="font-semibold mt-6 mb-3">Painting</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="hover:text-white transition">Painting In Dubai</Link></li>
              <li><Link to="#" className="hover:text-white transition">Exterior Painting In Dubai</Link></li>
            </ul>
            
            <h4 className="font-semibold mt-6 mb-3">Pet Services</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="hover:text-white transition">Pet Grooming</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
