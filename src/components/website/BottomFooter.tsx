import { Link } from "react-router-dom";
import React from "react";


const BottomFooter: React.FC = () => {
  return (
    <footer className="bg-[#054351] p-4 text-white">
      {/* BOTTOM SECTION - Resources, About us, Get in touch, Social Media and Legal Links */}
      <div className="pt-6 mb-6 max-w-7xl mx-auto px-4 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/faq" className="text-white transition">FAQs</Link></li>
              <li><Link to="#" className="text-white transition">The Home Project Blog</Link></li>
              <li><Link to="#" className="text-white transition">Write a review</Link></li>
              <li><Link to="#" className="text-white transition">Our service guarantee</Link></li>
            </ul>
          </div>

          {/* About us */}
          <div>
            <h3 className="font-semibold text-lg mb-4">About us</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="#" className="text-white transition">About us</Link></li>
              <li><Link to="#" className="text-white transition">Payment and refund policy</Link></li>
              <li><Link to="/careers" className="text-white transition">Careers</Link></li>
              <li><Link to="#" className="text-white transition">Contact us</Link></li>
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Partners</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="#" className="text-white transition">Become a partner</Link></li>
            </ul>
          </div>

          {/* Get in touch */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Get in touch</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#0b5660]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </span>
                <p>1403, Fortune Executive Tower, Cluster T, JLT, Dubai, UAE.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#0b5660]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </span>
                <p>+971 4 506 1500</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#0b5660]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </span>
                <p>support@servicemarket.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section with Social Media, Terms, and Copyright */}
      <div className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Social Media Icons - Centered and Bigger */}
          <div className="flex justify-center mb-6">
              <div className="flex items-center gap-4">
              <Link to="#" className="w-12 h-12 bg-[#006e82] rounded-full flex items-center justify-center hover:bg-white/20 transition">
                <img src="/icons/facebook.svg" alt="Facebook" />
              </Link>
              <Link to="#" className="w-12 h-12 bg-[#006e82] rounded-full flex items-center justify-center hover:bg-white/20 transition">
                <img src="/icons/instagram.svg" alt="Instagram" />
              </Link>
              <Link to="#" className="w-12 h-12 bg-[#006e82] rounded-full flex items-center justify-center hover:bg-white/20 transition">
                <img src="/icons/twitter.svg" alt="Twitter" />
              </Link>
              <Link to="#" className="w-12 h-12 bg-[#006e82] rounded-full flex items-center justify-center hover:bg-white/20 transition">
                  <img src="/icons/linkedin.svg" alt="Linkedin" />
              </Link>
              <Link to="#" className="w-12 h-12 bg-[#006e82] rounded-full flex items-center justify-center hover:bg-white/20 transition">
                  <img src="/icons/google-1.svg" alt="Google" />
              </Link>
              <Link to="#" className="w-12 h-12 bg-[#006e82] rounded-full flex items-center justify-center hover:bg-white/20 transition">
                <img src="/icons/whatsapp.svg" alt="Chat" />
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
    </footer>
  );
};

export default BottomFooter;