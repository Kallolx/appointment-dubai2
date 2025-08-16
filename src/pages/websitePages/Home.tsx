import AppDownloadSection from "@/components/website/AppDownloadSection";
import MobileNavbar from "@/components/website/MobileNavbar";
import PromiseSection from "@/components/website/PromiseSection";
import ReviewSlider from "@/components/website/ReviewSlider";
import ServiceCategories from "@/components/website/ServiceCategories";
import ServiceSection from "@/components/website/ServiceSection";
import TopReasons from "@/components/website/TopReasons";

const generalCleaning = [
  { title: "Home Cleaning",
    image: "./general_cleaning/1.webp" },
  {
    title: "Furniture Cleaning",
    image: "./general_cleaning/4.webp",
  },
  {
    title: "Home Deep Cleaning",
    image: "./general_cleaning/3.webp",
  },
  {
    title: "Kitchen & Bathroom Deep Clean",
    image: "./general_cleaning/5.webp",
  },
  {
    title: "AC Cleaning",
    image: "./general_cleaning/6.webp",
  },
  {
    title: "Laundry & Dry Cleaning",
    image: "./general_cleaning/7.webp",
  },
  {
    title: "Kitchen & Bathroom Deep Clean",
    image: "./general_cleaning/6.webp",
  },
  {
    title: "Car Wash",
    image: "./general_cleaning/8.webp",
  },
  { title: "Shoe Cleaning",
    image: "./general_cleaning/9.webp" },
];

const salonsAndSpa = [
  {
    title: "Women's Salon",
    image: "./salons_and_spa/1.webp",
  },
  {
    title: "Women's Spa",
    image: "./salons_and_spa/2.webp",
  },
  {
    title: "Men's Salon",
    image: "./salons_and_spa/3.webp",
  },
  {
    title: "Hair Salon",
    image: "./salons_and_spa/4.webp",
  },
  {
    title: "Men's Spa",
    image: "./salons_and_spa/5.webp",
  },
  {
    title: "Nail Extensions",
    image: "./salons_and_spa/6.webp",
  },
  {
    title: "Lashes & Brows",
    image: "./salons_and_spa/7.webp",
  },
  {
    title: "Spray Tanning",
    image: "./salons_and_spa/8.webp",
  },
  {
    title: "Makeup",
    image: "./salons_and_spa/9.webp",
  },
];

const healthcareAtHome = [
  {
    title: "Lab Tests at Home",
    image: "./healthcare_at_home/1.webp",
  },
  {
    title: "IV Therapy at Home",
    image: "./healthcare_at_home/2.webp",
  },
  {
    title: "Doctor Consultations",
    image: "./healthcare_at_home/3.webp",
  },
  {
    title: "PCR & Flu Test at Home",
    image: "./healthcare_at_home/4.webp",
  },
  {
    title: "Flu Vaccine at Home",
    image: "./healthcare_at_home/5.webp",
  },
  {
    title: "Nurse Care at Home",
    image: "./healthcare_at_home/6.webp",
  },
  {
    title: "Physiotherapy at Home",
    image: "./healthcare_at_home/7.webp",
  },
  {
    title: "Psychotherapy & Counselling",
    image: "./healthcare_at_home/8.webp",
  },
];

const HandymanMaintenance = [
  {
    title: "Handyman & Maintenance",
    image: "./general_cleaning/1.webp",
  },
  {
    title: "Home Painting",
    image: "./general_cleaning/2.webp",
  },
  {
    title: "Water Tank Cleaning",
    image: "./general_cleaning/3.webp",
  },
];

const Home = () => {
  return (
    <>
      <MobileNavbar />
      <div>
        <div className="px-5 md:px-0">
          <ServiceCategories />
          <ServiceSection
            heading="General Cleaning"
            services={generalCleaning}
          />
          <ServiceSection
            heading="Salon & Spa at Home"
            services={salonsAndSpa}
          />
          <ServiceSection
            heading="Handyman & Maintenance"
            services={HandymanMaintenance}
          />
          <ServiceSection
            heading="Healthcare at Home"
            services={healthcareAtHome}
          />
          <div className="max-w-7xl mx-auto">
            <button className="bg-[#00c3ff] text-white text-xl py-4 px-6 rounded-lg font-semibold focus:outline-none w-full">
              SHOW MORE
            </button>
          </div>
          <TopReasons />
          <ReviewSlider />
        </div>
        <PromiseSection />
        <AppDownloadSection />
      </div>
    </>
  );
};

export default Home;
