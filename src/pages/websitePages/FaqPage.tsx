import AppDownloadSection from "@/components/website/AppDownloadSection";
import NavbarForContentPage from "@/components/website/NavbarForContentPage";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { buildApiUrl } from "@/config/api";

// Fallback data in case API fails
const fallbackCategories = [
  "Doctor at Home",
  "General",
  "Payment",
  "Booking",
  "My Account",
];

const fallbackFaqs = {
  "Doctor at Home": [
    {
      question: "be covered under my insurance?",
      answer: `The reimbursement for consultation is directly dependent on the terms and conditions provided by your insurance provider. Please check with your insurance provider directly whether this service will be covered or not. Neither Justlife nor its partners are responsible for reimbursement. An invoice can be arranged upon the patient's request.`,
    },
    {
      question: "Can the doctor make a home visit for a consultation?",
      answer:
        "Yes, home consultations are available. You can book a doctor to visit your home through our app or website.",
    },
    {
      question: "Is the service available all over UAE?",
      answer:
        "The service is available in most major cities across the UAE. Please check your location in the app for availability.",
    },
  ],
  General: [
    {
      question: "What is Justlife?",
      answer:
        "Justlife is a platform offering a wide range of at-home services such as healthcare, cleaning, beauty, and wellness services.",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "You can reach our support team via the chat option in our app or website, or by calling our customer service number listed under 'Contact Us'.",
    },
    {
      question: "Are your service providers verified?",
      answer:
        "Yes, all our professionals go through a thorough background check and training process to ensure high-quality service.",
    },
  ],
  Payment: [
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept payments via credit/debit cards, Apple Pay, and other digital wallets. Cash on delivery may be available for select services.",
    },
    {
      question: "Is my payment information secure?",
      answer:
        "Absolutely. All payment data is encrypted and processed through secure, PCI-compliant payment gateways.",
    },
    {
      question: "Can I get a refund if I cancel a booking?",
      answer:
        "Refunds are processed according to our cancellation policy. Please review our refund terms on the app or website.",
    },
  ],
  Booking: [
    {
      question: "How do I book a service?",
      answer:
        "You can book a service by selecting the desired category and provider on our app or website, then choosing your preferred date and time.",
    },
    {
      question: "Can I reschedule or cancel my booking?",
      answer:
        "Yes, you can manage your bookings through the app. Make sure to check the rescheduling and cancellation terms for your selected service.",
    },
    {
      question: "Do I get confirmation after booking?",
      answer:
        "Yes, you will receive a booking confirmation via email and in-app notification once your service is confirmed.",
    },
  ],
  "My Account": [
    {
      question: "How do I create an account?",
      answer:
        "Download the Justlife app or visit our website, and sign up using your email address or mobile number.",
    },
    {
      question: "I forgot my password. What should I do?",
      answer:
        "Go to the login screen and click on 'Forgot Password' to reset it via your registered email or phone number.",
    },
    {
      question: "Can I update my personal information?",
      answer:
        "Yes, you can edit your profile information, address, and preferences from the 'My Account' section in the app or website.",
    },
  ],
};

const FaqPage = () => {
  const [categories, setCategories] = useState(fallbackCategories);
  const [faqs, setFaqs] = useState(fallbackFaqs);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Doctor at Home");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    
    // Fetch FAQ data from API
    fetch(buildApiUrl('/api/faqs'))
      .then((res) => {
        console.log('FAQ API response status:', res.status);
        if (!res.ok) {
          console.log('FAQ API response not ok:', res.status, res.statusText);
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        
        console.log('FAQ data received:', data);
        
        if (data.categories && data.faqs) {
          setCategories(data.categories);
          setFaqs(data.faqs);
          
          // Set active category to first available category
          if (data.categories.length > 0) {
            setActiveCategory(data.categories[0]);
          }
        } else {
          console.log('Invalid FAQ data structure:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching FAQs:', error);
        // Keep fallback data if API fails
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    
    return () => {
      mounted = false;
    };
  }, []);

  // Ensure activeCategory exists in current categories
  useEffect(() => {
    if (categories && !categories.includes(activeCategory) && categories.length > 0) {
      setActiveCategory(categories[0]);
      setOpenIndex(null);
    }
  }, [categories, activeCategory]);

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
    <div>
      <div className="text-center mb-6 px-3 mt-6">
        <Link
          to={"/"}
          className="text-sm tracking-widest text-gray-400 uppercase"
        >
          Home
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-4">
          Frequently asked questions
        </h1>
      </div>
      <div className="px-4 md:px-6 mt-8 max-w-5xl mx-auto">
        <section className="border border-gray-200 mx-auto bg-white p-4 md:p-6 rounded-lg">
          {loading && (
            <div className="text-center py-8">
              <div className="text-gray-500">Loading FAQs...</div>
            </div>
          )}
          
          {!loading && (
            <>
              {/* Category buttons - horizontally scrollable on small screens */}
              <div className="mb-6 pb-2">
                <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      className={`whitespace-nowrap px-3 py-2 rounded-md font-semibold uppercase text-sm md:text-base transition-colors flex-shrink-0 ${
                        activeCategory === cat
                          ? 'text-sky-600 bg-sky-50 ring-1 ring-sky-100'
                          : 'text-gray-600 hover:text-black bg-white'
                      }`}
                      onClick={() => {
                        setActiveCategory(cat);
                        setOpenIndex(null);
                      }}
                      aria-pressed={activeCategory === cat}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* FAQ list */}
              <div className="space-y-4">
                {(faqs[activeCategory] || []).map((faq, idx) => (
                  <div key={idx} className="border-b border-gray-300 pb-4">
                    <button
                      onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                      className="w-full text-left text-base md:text-lg font-medium flex items-start md:items-center gap-3"
                      aria-expanded={openIndex === idx}
                      aria-controls={`faq-answer-${idx}`}
                      id={`faq-question-${idx}`}
                    >
                      <span
                        className="text-gray-400 text-2xl md:text-3xl leading-none mt-0.5 md:mt-0"
                        aria-hidden="true"
                      >
                        {openIndex === idx ? '−' : '+'}
                      </span>
                      <span className="flex-1 break-words">{faq.question}</span>
                    </button>

                    <AnimatePresence initial={false} mode="wait">
                      {openIndex === idx && (
                        <motion.div
                          key="content"
                          id={`faq-answer-${idx}`}
                          role="region"
                          aria-labelledby={`faq-question-${idx}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.28 }}
                          className="overflow-hidden mt-2"
                        >
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
        <AppDownloadSection></AppDownloadSection>
      </div>
    </div>
  );
};

export default FaqPage;
