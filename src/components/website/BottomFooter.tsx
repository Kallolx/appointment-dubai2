import { Link } from "react-router-dom";
import React from "react";
import { useWebsiteSettings } from "@/hooks/useWebsiteSettings";

const BottomFooter: React.FC = () => {
  const { settings } = useWebsiteSettings();

  // Helper function to determine if a URL should be shown
  const shouldShowSocialLink = (url: string) => url && url.trim() !== '';

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
                <p>{settings.contact_address || "1403, Fortune Executive Tower, Cluster T, JLT, Dubai, UAE."}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#0b5660]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </span>
                <p>{settings.contact_phone || "+971 4 506 1500"}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#0b5660]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </span>
                <p>{settings.contact_email || "support@servicemarket.com"}</p>
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
              {/* Allow icons to wrap and scale on small screens to avoid overflow */}
              <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 max-w-full">
              {shouldShowSocialLink(settings.facebook_url) && (
                <a 
                  href={settings.facebook_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-[#006e82] rounded-full flex items-center justify-center hover:bg-white/20 transition shrink-0"
                >
                  <img src="/icons/facebook.svg" alt="Facebook" />
                </a>
              )}
              {shouldShowSocialLink(settings.instagram_url) && (
                <a 
                  href={settings.instagram_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-[#006e82] rounded-full flex items-center justify-center hover:bg-white/20 transition shrink-0"
                >
                  <img src="/icons/instagram.svg" alt="Instagram" />
                </a>
              )}
              {shouldShowSocialLink(settings.twitter_url) && (
                <a 
                  href={settings.twitter_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-[#006e82] rounded-full flex items-center justify-center hover:bg-white/20 transition shrink-0"
                >
                  <img src="/icons/twitter.svg" alt="Twitter" />
                </a>
              )}
              {shouldShowSocialLink(settings.linkedin_url) && (
                <a 
                  href={settings.linkedin_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-[#006e82] rounded-full flex items-center justify-center hover:bg-white/20 transition shrink-0"
                >
                    <img src="/icons/linkedin.svg" alt="Linkedin" />
                </a>
              )}
              {shouldShowSocialLink(settings.google_url) && (
                <a 
                  href={settings.google_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-[#006e82] rounded-full flex items-center justify-center hover:bg-white/20 transition shrink-0"
                >
                    <img src="/icons/google-1.svg" alt="Google" />
                </a>
              )}
              {shouldShowSocialLink(settings.whatsapp_url) && (
                <a 
                  href={settings.whatsapp_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-[#006e82] rounded-full flex items-center justify-center hover:bg-white/20 transition shrink-0"
                >
                  <img src="/icons/whatsapp.svg" alt="WhatsApp" />
                </a>
              )}
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

          {/* Tagline - Centered */}
          <div className="text-center mb-4 px-2">
            <p className="text-gray-200 text-xs sm:text-sm">
              {settings.tagline}
            </p>
          </div>

          {/* Copyright and Developer - Responsive Layout */}
          <div className="border-t border-gray-600 pt-4 flex w-full flex-col sm:flex-row justify-between items-center gap-3 sm:gap-2 text-sm sm:text-base px-2">
            {/* Left side - Copyright */}
            <div className="flex-1 text-center sm:text-left order-2 sm:order-1 w-full sm:w-auto">
              <p className="text-gray-300">
                {settings.copyright_text || '© 2025 JL Services. All rights reserved.'}
              </p>
            </div>

            {/* Vertical separator for larger screens */}
            <div className="hidden sm:block w-px h-5 bg-gray-600 mx-4" aria-hidden="true" />

            {/* Right side - Developed by */}
            <div className="flex-none text-center sm:text-right order-1 sm:order-2">
              <p className="text-gray-300">
                Developed by{' '}
                <a 
                  href={settings.developer_url || 'https://webbyte.com'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#FFD03E] transition-colors underline font-medium"
                >
                  {settings.developer_name || 'WebByte Solutions'}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default BottomFooter;