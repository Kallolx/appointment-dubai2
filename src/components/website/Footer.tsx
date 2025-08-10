import { Link } from "react-router-dom";

const services = [
  "Maid Service",
  "Carpet Cleaning",
  "Mattress Cleaning",
  "Sofa Cleaning",
  "Curtain Cleaning",
  "Deep Cleaning",
  "Move In & Out Cleaning Services",
  "House Cleaning",
  "Laundry & Dry Cleaning",
  "AC Cleaning Service",
  "Disinfection Service",
  "Covid-19 PCR Test at Home",
  "Women's Salon",
  "Women's Spa",
  "Furniture Cleaning",
  "Men's Salon",
  "Lab Tests at Home",
  "Pest Control Service",
  "Men's Spa",
  "Men's Grooming",
  "Hair Salon",
  "Pet Grooming",
  "IV Therapy",
  "Babysitting At Home",
  "Car Wash At Home",
  "Plumber Services",
  "Handyman Services",
  "Electrician Services",
  "Home Painting",
  "Personal Trainer",
  "Nail Couture",
  "Packers and Movers",
  "Physiotherapy at Home",
  "Body Adjustment",
  "Personal Nutritionist",
  "Part Time Maid Services",
  "Psychotherapy & Counselling",
  "Nurse Care at Home",
  "Mobile Ice Bath",
  "Lashes and Brows at Home",
  "Vaccines at Home",
  "Spray Tanning",
  "Commercial Cleaning",
  "Office Cleaning",
  "Villa Cleaning",
  "Henna Service",
  "Housekeeping Services",
  "Floor Cleaning",
  "Waxing Service",
  "Doctor on Call",
  "Facial Treatment Service",
  "Eyebrow Threading",
  "Flu Vaccine",
  "Apartment Cleaning",
  "Oxygen Therapy",
  "Cat Grooming",
];

const uaeCities = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman"];
const saudiCities = ["Jeddah", "Riyadh"];
const qatarCities = ["Doha"];

const Footer = () => {
  return (
    <footer className="bg-zinc-900 text-white px-4 md:px-16 py-10 text-sm">
      <div className="max-w-7xl mx-auto">
        {/* Services */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Services</h2>
          <div className="flex flex-wrap gap-2">
            {services.map((service, idx) => (
              <span
                key={idx}
                className="bg-black px-3 py-1 rounded-full text-white whitespace-nowrap hover:bg-white hover:text-black transition"
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        {/* Regions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
          <div>
            <h3 className="font-semibold mb-2">United Arab Emirates</h3>
            <div className="flex flex-wrap gap-2">
              {uaeCities.map((city) => (
                <span key={city} className="bg-black px-3 py-1 rounded-full">
                  {city}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Saudi Arabia</h3>
            <div className="flex flex-wrap gap-2">
              {saudiCities.map((city) => (
                <span key={city} className="bg-black px-3 py-1 rounded-full">
                  {city}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Qatar</h3>
            <div className="flex flex-wrap gap-2">
              {qatarCities.map((city) => (
                <span key={city} className="bg-black px-3 py-1 rounded-full">
                  {city}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* App Store + Social Icons */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-10 border-t border-zinc-700 pt-6 gap-6">
          {/* App buttons */}
          <div className="flex items-center gap-4">
            <img src="./appstore.webp" alt="App Store" className="h-10" />
            <img src="./playstore.webp" alt="Google Play" className="h-10" />
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-4 text-white">
            <Link to="">
              <img src="./facebookicon.webp" alt="" className="w-8 h-8" />
            </Link>
            <Link to="">
              <img src="./twitter-logo.svg" alt="" className="w-8 h-8" />
            </Link>
            <Link to="">
              <img src="./instagram-logo.svg" alt="" className="w-8 h-8" />
            </Link>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
            <Link to={"faq"}>F.A.Q</Link>
            <Link to={"terms"}>Terms</Link>
            <Link to={"privacy-policy"}>Privacy</Link>
            <a href="#">Sitemap</a>
            <a href="#">Career</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
