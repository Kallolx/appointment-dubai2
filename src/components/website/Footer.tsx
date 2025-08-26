import { Link } from "react-router-dom";

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

        {/* BOTTOM SECTION - Resources, About us, Get in touch, Social Media and Legal Links */}
        <div className="pt-6 mb-6 ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Resources */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/faq" className="hover:text-white transition">FAQs</Link></li>
                <li><Link to="#" className="hover:text-white transition">The Home Project Blog</Link></li>
                <li><Link to="#" className="hover:text-white transition">Write a review</Link></li>
                <li><Link to="#" className="hover:text-white transition">Our service guarantee</Link></li>
              </ul>
            </div>

            {/* About us */}
            <div>
              <h3 className="font-semibold text-lg mb-4">About us</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="#" className="hover:text-white transition">About us</Link></li>
                <li><Link to="#" className="hover:text-white transition">Payment and refund policy</Link></li>
                <li><Link to="/careers" className="hover:text-white transition">Careers</Link></li>
                <li><Link to="#" className="hover:text-white transition">Contact us</Link></li>
              </ul>
            </div>

            {/* Partners */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Partners</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="#" className="hover:text-white transition">Become a partner</Link></li>
              </ul>
            </div>

            {/* Get in touch */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Get in touch</h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <p>1403, Fortune Executive Tower, Cluster T, JLT, Dubai, UAE.</p>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <p>+971 4 506 1500</p>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <p>support@servicemarket.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Darker Bottom Section with Social Media, Terms, and Copyright */}
        <div className="md:-mx-16 px-4 md:px-16 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Social Media Icons - Centered and Bigger */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-4">
                <Link to="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
                  <span className="text-white font-bold text-lg">f</span>
                </Link>
                <Link to="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </Link>
                <Link to="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </Link>
                <Link to="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
                  <span className="text-white font-bold text-lg">in</span>
                </Link>
                <Link to="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
                  <span className="text-white font-bold text-lg">G</span>
                </Link>
                <Link to="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Terms and Conditions - Underneath Social Icons */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-4 text-gray-300">
                <Link to="/terms" className="hover:text-white transition">Terms and Conditions</Link>
                <span className="text-gray-500">|</span>
                <Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
              </div>
            </div>

            {/* Copyright - Underneath Terms */}
            <div className="text-center">
              <p className="text-gray-200 text-sm">
                Service Souk DMCC is licensed by Dubai Health Authority (DHA) under License No. 8357061. Copyright © 2013-2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
