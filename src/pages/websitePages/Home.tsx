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

  // Build sections for all categories
  const sections = categories.map((cat) => {
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
          <ServiceCategories />
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
