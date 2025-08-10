import AppDownloadSection from "@/components/website/AppDownloadSection";
import NavbarForContentPage from "@/components/website/NavbarForContentPage";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

const categories = [
  "Doctor at Home",
  "General",
  "Payment",
  "Booking",
  "My Account",
];

const faqs = {
  "Doctor at Home": [
    {
      question: "Will the doctor’s visit be covered under my insurance?",
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
  const [activeCategory, setActiveCategory] = useState("Doctor at Home");
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <div>
      <NavbarForContentPage />
      <div className="md:text-center mb-6 px-3 mt-6">
        <Link
          to={"/"}
          className="text-sm tracking-widest text-gray-400 uppercase"
        >
          Home
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mt-4">
          Frequently asked questions
        </h1>
      </div>
      <div className="md:px-4 mt-10 max-w-6xl mx-auto">
        <section className=" border border-gray-200 mx-auto bg-white p-4 rounded-lg  ">
          {/* Category buttons */}
          <div className="flex justify-between space-x-6 mb-6 pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`relative pb-2 font-semibold uppercase transition-all
                ${
                  activeCategory === cat
                    ? "text-sky-400 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-sky-300"
                    : "text-gray-500 hover:text-black"
                }`}
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenIndex(null);
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ list */}
          <div className="space-y-4">
            {(faqs[activeCategory] || []).map((faq, idx) => (
              <div key={idx} className="border-b border-gray-300 pb-4">
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full text-left text-lg font-medium flex items-center"
                  aria-expanded={openIndex === idx}
                  aria-controls={`faq-answer-${idx}`}
                  id={`faq-question-${idx}`}
                >
                  <span
                    className="text-gray-400 text-3xl mr-3"
                    aria-hidden="true"
                  >
                    {openIndex === idx ? "−" : "+"}
                  </span>
                  <span className="flex-1">{faq.question}</span>
                </button>

                <AnimatePresence initial={false} mode="wait">
                  {openIndex === idx && (
                    <motion.div
                      key="content"
                      id={`faq-answer-${idx}`}
                      role="region"
                      aria-labelledby={`faq-question-${idx}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-2 text-gray-600">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>
        <AppDownloadSection></AppDownloadSection>
      </div>
    </div>
  );
};

export default FaqPage;
