import AppDownloadSection from "@/components/website/AppDownloadSection";
import MobileNavbar from "@/components/website/MobileNavbar";
import PromiseSection from "@/components/website/PromiseSection";
import ReviewSlider from "@/components/website/ReviewSlider";
import ServiceCategories from "@/components/website/ServiceCategories";
import ServiceSection from "@/components/website/ServiceSection";
import TopReasons from "@/components/website/TopReasons";
import { useEffect, useState } from 'react';
import { buildApiUrl } from '@/config/api';

// Simple city mapping
const cityMapping = {
  "dubai": "Most Popular Services in Dubai",
  "abu-dhabi": "Most Popular Services in Abu Dhabi", 
  "sharjah": "Most Popular Services in Sharjah"
};

type Cat = { id: number; name: string; slug: string; image_url?: string | null };
type SI = { id: number; name: string; slug: string; category_id?: number | null; image_url?: string | null };

const Home = () => {
  const [categories, setCategories] = useState<Cat[]>([]);
  const [serviceItems, setServiceItems] = useState<SI[]>([]);

  useEffect(() => {
    // fetch categories
    fetch(buildApiUrl('/api/service-categories'))
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));

    // fetch service items
    fetch(buildApiUrl('/api/service-items'))
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setServiceItems(Array.isArray(data) ? data : []))
      .catch(() => setServiceItems([]));
  }, []);

  // Get selected city from ServiceHero (you can pass this as a prop or use a simple state)
  const [selectedCity, setSelectedCity] = useState("dubai");

  // Function to update city (can be called from ServiceHero)
  const updateCity = (city: string) => {
    setSelectedCity(city);
  };

  // Build sections for all categories, but filter "Most Popular Services" based on city
  const sections = categories
    .filter(cat => {
      // If it's a "Most Popular Services" category, only show the one for selected city
      if (cat.name.toLowerCase().includes("most popular services")) {
        return cat.name === cityMapping[selectedCity as keyof typeof cityMapping];
      }
      // Show all other categories
      return true;
    })
    .map((cat) => {
      const services = serviceItems
        .filter((si) => si.category_id === cat.id)
        .map((si) => ({ 
          title: si.name, 
          image: si.image_url || '/placeholder.svg',
          slug: si.slug,
          isServiceItem: true
        }));
      return { heading: cat.name, services };
    });

  return (
    <>
      <div>
          <ServiceCategories updateCity={updateCity} />
          {sections.map((s) => (
            <ServiceSection key={s.heading} heading={s.heading} services={s.services} />
          ))}
          <TopReasons />
          <ReviewSlider />
        <PromiseSection />
      </div>
    </>
  );
};

export default Home;
