import AppDownloadSection from "@/components/website/AppDownloadSection";
import MobileNavbar from "@/components/website/MobileNavbar";
import PromiseSection from "@/components/website/PromiseSection";
import ReviewSlider from "@/components/website/ReviewSlider";
import ServiceCategories from "@/components/website/ServiceCategories";
import ServiceSection from "@/components/website/ServiceSection";
import TopReasons from "@/components/website/TopReasons";
import { useEffect, useState } from 'react';
import { buildApiUrl } from '@/config/api';

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

  // Build sections for the first 4 categories (or fewer)
  const sections = categories.slice(0, 4).map((cat) => {
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
      <MobileNavbar />
      <div>
        <div className="px-5 md:px-0">
          <ServiceCategories />
          {sections.map((s) => (
            <ServiceSection key={s.heading} heading={s.heading} services={s.services} />
          ))}

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
