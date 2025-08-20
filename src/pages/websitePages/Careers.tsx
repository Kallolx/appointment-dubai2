import NavbarForContentPage from "@/components/website/NavbarForContentPage";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { buildApiUrl } from "@/config/api";

type Job = {
  job_title: string;
  department?: string;
  location?: string;
  job_type?: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  salary_range?: string;
};

const Careers: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await fetch(buildApiUrl('/api/careers'));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (!mounted) return;

        if (Array.isArray(data)) {
          setJobs(data);
        } else if (data.rows && Array.isArray(data.rows)) {
          setJobs(data.rows);
        } else {
          console.warn('Unexpected /api/careers response shape:', data);
        }
      } catch (err) {
        console.error('Error fetching careers:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchJobs();
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
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 pb-12 pt-8">

      <div className="md:text-center mb-6">
        <Link to={'/'} className="text-sm tracking-widest text-gray-400 uppercase">Home</Link>
        <h1 className="text-3xl font-bold text-gray-800 mt-4">Careers</h1>
      </div>

      <div className="max-w-5xl w-full bg-white rounded-lg shadow-sm p-8 border border-gray-200">
        {loading ? (
          <div className="text-gray-500">Loading job postings...</div>
        ) : (
          <div className="space-y-6">
            {jobs.length === 0 ? (
              <div className="text-gray-600">No job postings available.</div>
            ) : (
              jobs.map((job, idx) => (
                <article key={idx} className="bg-white p-4 md:p-6 rounded-lg border border-gray-100 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="md:flex-1">
                      <h2 className="text-lg md:text-xl font-semibold text-gray-800">{job.job_title}</h2>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {job.department && (
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">{job.department}</span>
                        )}
                        {job.location && (
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">{job.location}</span>
                        )}
                        {job.job_type && (
                          <span className="px-2 py-1 text-xs font-medium bg-sky-100 text-sky-700 rounded-full">{job.job_type}</span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 md:mt-0 md:ml-6 text-sm text-gray-600">
                      {job.salary_range ? <span className="font-medium">Salary:</span> : null} {job.salary_range}
                    </div>
                  </div>

                  <div className="mt-4 prose max-w-none text-gray-700 text-sm md:text-base">
                    {job.description && job.description.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>

                  {(job.requirements || job.benefits) && (
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      {job.requirements && (
                        <div>
                          <h3 className="font-semibold mb-1">Requirements</h3>
                          <div className="text-gray-700 text-sm whitespace-pre-line">{job.requirements}</div>
                        </div>
                      )}

                      {job.benefits && (
                        <div>
                          <h3 className="font-semibold mb-1">Benefits</h3>
                          <div className="text-gray-700 text-sm whitespace-pre-line">{job.benefits}</div>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default Careers;
