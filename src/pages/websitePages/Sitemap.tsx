import NavbarForContentPage from "@/components/website/NavbarForContentPage";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { buildApiUrl } from "@/config/api";

const Sitemap: React.FC = () => {
  const [sitemap, setSitemap] = useState<Record<string, { title: string; url: string }[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchSitemap = async () => {
      try {
        setLoading(true);
        const res = await fetch(buildApiUrl('/api/sitemap'));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (!mounted) return;

        // Backend returns grouped object: { sectionName: [{ title, url }, ...], ... }
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          setSitemap(data);
        } else if (Array.isArray(data)) {
          // Fallback: try to group array by section_name
          const grouped: Record<string, { title: string; url: string }[]> = {};
          data.forEach((item: any) => {
            const section = item.section_name || 'General';
            if (!grouped[section]) grouped[section] = [];
            grouped[section].push({ title: item.page_title || item.title || '', url: item.page_url || item.url || '#' });
          });
          setSitemap(grouped);
        } else {
          console.warn('Unexpected /api/sitemap response shape:', data);
        }
      } catch (err) {
        console.error('Error fetching sitemap:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSitemap();
    return () => { mounted = false; };
  }, []);

    // Always scroll to top when this page is mounted (no button).
    useEffect(() => {
      try {
        if (typeof window !== 'undefined') {
          window.scrollTo(0, 0);
        }
      } catch (e) {
        // ignore in non-browser environments
      }
    }, []);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col md:items-center justify-center px-4 pb-12 pt-8">
      <div className="md:text-center mb-6">
        <Link to={'/'} className="text-sm tracking-widest text-gray-400 uppercase">Home</Link>
        {/* Hard-coded page title as requested */}
        <h1 className="text-3xl font-bold text-gray-800 mt-4">Sitemaps</h1>
      </div>

      <div className="max-w-5xl w-full bg-white rounded-lg shadow-sm p-8 border border-gray-200">
        {loading ? (
          <div className="text-gray-500">Loading sitemap...</div>
        ) : (
          <div className="space-y-6">
            {Object.keys(sitemap).length === 0 ? (
              <div className="text-gray-600">No sitemap entries found.</div>
            ) : (
              <>
                {Object.entries(sitemap).map(([section, items]) => {
                  // Normalize certain section keys to display as "Blog"
                  const keyLower = String(section || '').toLowerCase();
                  const displaySection = (keyLower === 'other' || keyLower.includes('blog')) ? 'Blog' : section;

                  return (
                    <section key={section}>
                      <h2 className="text-xl font-semibold mb-2">{displaySection}</h2>
                      <ul className="list-inside list-disc text-gray-700">
                        {items.map((it, idx) => (
                          <li key={idx} className="mb-1">
                            {/* Use Link when url is internal, otherwise anchor */}
                            {it.url && it.url.startsWith('/') ? (
                              <Link to={it.url} className="text-sky-600 hover:underline">{it.title || it.url}</Link>
                            ) : (
                              <a href={it.url} className="text-sky-600 hover:underline" target="_blank" rel="noreferrer">{it.title || it.url}</a>
                            )}
                          </li>
                        ))}
                      </ul>
                    </section>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default Sitemap;
