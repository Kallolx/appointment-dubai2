import NavbarForContentPage from "@/components/website/NavbarForContentPage";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { buildApiUrl } from "@/config/api";

const fallbackTerms = [
	{
		title: "General",
		content:
			"The content of the website is for the explanation and implementation of our services. It is subject to change without notice.",
	},
	{
		title: "Cookies",
		content:
			"We use cookies to monitor browsing preferences. If you allow cookies to be used, the relevant personal information may be stored by us for use by third parties.",
	},
	{
		title: "Acceptance",
		content:
			"By using our services, you acknowledge that you accept the terms and conditions.",
	},
];

const Terms: React.FC = () => {
	const [terms, setTerms] = useState<{ title: string; content: string }[]>(
		fallbackTerms
	);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		let mounted = true;

		const fetchTerms = async () => {
			try {
				setLoading(true);
				const res = await fetch(buildApiUrl("/api/terms"));
				if (!res.ok) {
					throw new Error(`HTTP ${res.status}`);
				}

				const data = await res.json();
				if (!mounted) return;

				// Normalize shapes: backend returns array of { section_title, content, ... }
				if (Array.isArray(data)) {
					const normalized = data.map((r: any) => ({
						title: r.section_title || r.title || "",
						content: r.content || r.body || "",
					}));

					if (normalized.length > 0) setTerms(normalized);
				} else if (data.rows && Array.isArray(data.rows)) {
					const normalized = data.rows.map((r: any) => ({
						title: r.section_title || r.title || "",
						content: r.content || r.body || "",
					}));
					if (normalized.length > 0) setTerms(normalized);
				} else {
					// unexpected shape — keep fallback
					console.warn("Unexpected /api/terms response shape:", data);
				}
			} catch (err) {
				console.error("Error fetching terms:", err);
				// keep fallback
			} finally {
				if (mounted) setLoading(false);
			}
		};

		fetchTerms();

		return () => {
			mounted = false;
		};
	}, []);

	return (
		<main className="min-h-screen flex flex-col md:items-center justify-center px-4 pb-12 pt-8">

			<div className="md:text-center mb-6">
				<Link
					to={"/"}
					className="text-sm tracking-widest text-gray-400 uppercase"
				>
					Home
				</Link>
				<h1 className="text-3xl font-bold text-gray-800 mt-4">Terms</h1>
			</div>

			<div className="max-w-5xl w-full bg-white rounded-lg shadow-sm md:p-8 border border-gray-200">
				<div className="text-gray-800">
					<div className="space-y-6">
						{loading ? (
							<div className="text-gray-500">Loading terms...</div>
						) : (
							<div className="grid gap-6 grid-cols-1 md:grid-cols-2">
								{terms.map((t, idx) => (
									<article
										key={idx}
										className="bg-white p-4 md:p-6 rounded-lg border border-gray-100 shadow-sm"
									>
										<h2 className="text-lg md:text-xl font-semibold mb-2">{t.title}</h2>
										<div className="prose max-w-none text-gray-700 text-sm md:text-base">
											{t.content.split("\n").map((line, i) => (
												<p key={i}>{line}</p>
											))}
										</div>
									</article>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</main>
	);
};

export default Terms;
