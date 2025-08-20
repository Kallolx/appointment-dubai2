import NavbarForContentPage from "@/components/website/NavbarForContentPage";
import React, { useEffect, useState } from "react";
import { buildApiUrl } from "@/config/api";
import { Link } from "react-router-dom";

const PrivacyPolicy: React.FC = () => {
  const [sections, setSections] = useState<
    Array<{ section_title?: string; title?: string; content?: string }>
  >([]);
  const [pageTitle, setPageTitle] = useState<string>("Privacy");

  useEffect(() => {
    window.scrollTo(0, 0);

    // Fetch privacy sections from the backend and use only backend-provided data.
    // Do not fall back to any static text.
    (async () => {
      try {
        const res = await fetch(buildApiUrl("/api/privacy-policy"));
        if (!res.ok) {
          console.error("Failed to fetch privacy policy, status:", res.status);
          setSections([]);
          return;
        }

        const data = await res.json();

        // Support a few possible response shapes: an array of rows, or an object
        // with properties like `privacy`, `sections`, or `rows`.
        let rows: any[] = [];
        if (Array.isArray(data)) {
          rows = data;
        } else if (data && Array.isArray(data.privacy)) {
          rows = data.privacy;
        } else if (data && Array.isArray(data.sections)) {
          rows = data.sections;
        } else if (data && Array.isArray(data.rows)) {
          rows = data.rows;
        }

        setSections(rows || []);

        // If the response contains a page-level title, use it.
        if (data && typeof data.title === "string") {
          setPageTitle(data.title);
        }
      } catch (err) {
        console.error("Error fetching privacy policy:", err);
        setSections([]);
      }
    })();
  }, []);
  // Always scroll to top when this page is mounted (no button).
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.scrollTo(0, 0);
      }
    } catch (e) {
      // ignore in non-browser environments
    }
  }, []);
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col md:items-center justify-center px-4 pb-12 pt-8">
      <div className="md:text-center mb-6">
        <Link
          to={"/"}
          className="text-sm tracking-widest text-gray-400 uppercase"
        >
          Home
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mt-4">{pageTitle}</h1>
      </div>
      <div className="max-w-5xl w-full bg-white rounded-lg shadow-sm md:p-8 border border-gray-200">
        {sections && sections.length > 0 ? (
          // Render sections fetched from the DB
          sections.map((s, idx) => {
            const title = s.section_title ?? s.title ?? `Section ${idx + 1}`;
            const content =
              typeof s.content === "string"
                ? s.content
                : String(s.content ?? "");
            const paragraphs = content.split(/\n\n+/).filter(Boolean);
            return (
              <div key={idx} className={idx !== 0 ? "mt-6" : ""}>
                <h2 className="font-semibold text-lg mb-2">{title}</h2>
                {paragraphs.map((p, i) => (
                  <p key={i} className="text-gray-700 mb-4">
                    {p}
                  </p>
                ))}
              </div>
            );
          })
        ) : (
          <></>
        )}
      </div>
    </main>
  );
};

export default PrivacyPolicy;
