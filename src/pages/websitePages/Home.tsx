import AppDownloadSection from "@/components/website/AppDownloadSection";
import MobileNavbar from "@/components/website/MobileNavbar";
import PromiseSection from "@/components/website/PromiseSection";
import ReviewSlider from "@/components/website/ReviewSlider";
import ServiceCategories from "@/components/website/ServiceCategories";
import ServiceSection from "@/components/website/ServiceSection";
import TopReasons from "@/components/website/TopReasons";

const generalCleaning = [
  { title: "Home Cleaning", image: "./general_cleaning/homecleaning.webp" },
  {
    title: "Furniture Cleaning",
    image: "./general_cleaning/homecleaning.webp",
  },
  {
    title: "Home Deep Cleaning",
    image: "./general_cleaning/deepcleaning.webp",
  },
  {
    title: "Kitchen & Bathroom Deep Clean",
    image: "./general_cleaning/homepageimages_furniturecleaning.webp",
  },
  {
    title: "Kitchen & Bathroom Deep Clean",
    image: "./general_cleaning/homecleaning.webp",
  },
  {
    title: "Kitchen & Bathroom Deep Clean",
    image: "./general_cleaning/homecleaning.webp",
  },
  {
    title: "Kitchen & Bathroom Deep Clean",
    image: "./general_cleaning/homecleaning.webp",
  },
  {
    title: "Kitchen & Bathroom Deep Clean",
    image: "./general_cleaning/homecleaning.webp",
  },
  { title: "AC Cleaning", image: "./general_cleaning/homecleaning.webp" },
];

const HandymanMaintenance = [
  {
    title: "Handyman & Maintenance",
    image: "./general_cleaning/homecleaning.webp",
  },
  {
    title: "Home Painting",
    image: "./general_cleaning/homecleaning.webp",
  },
  {
    title: "Water Tank Cleaning",
    image: "./general_cleaning/homecleaning.webp",
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
            services={generalCleaning}
          />
          <ServiceSection
            heading="Handyman & Maintenance"
            services={HandymanMaintenance}
          />
          <ServiceSection
            heading="Healthcare at Home"
            services={generalCleaning}
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
