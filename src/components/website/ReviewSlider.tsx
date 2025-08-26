import React from "react";
import { Star } from "lucide-react";

type Review = {
  initials: string;
  name: string;
  content: string;
  rating: number;
  date: string;
};

const reviews: Review[] = [
  {
    initials: "IZ",
    name: "Ian Zakovorotnyi",
    content: "Great service! The professional was very thorough and cleaned everything perfectly. Will definitely book again.",
    rating: 5,
    date: "01 Dec 2024",
  },
  {
    initials: "DP",
    name: "Diana Per",
    content: "Excellent experience with the cleaning service. The team was professional and the results were outstanding.",
    rating: 5,
    date: "23 May 2024",
  },
  {
    initials: "VK",
    name: "Vadim K",
    content: "Very reliable service. The professional arrived on time and did an amazing job with the deep cleaning.",
    rating: 5,
    date: "10 May 2024",
  },
  {
    initials: "LB",
    name: "Lorna Bancroft",
    content: "Fantastic service quality. The cleaning was thorough and the professional was very friendly and efficient.",
    rating: 5,
    date: "22 Sep 2021",
  },
  {
    initials: "FC",
    name: "Farah Clague",
    content: "Amazing experience! The service exceeded my expectations and I would highly recommend to others.",
    rating: 5,
    date: "12 Apr 2021",
  },
];

const ReviewSlider: React.FC = () => {
  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Verified customer reviews Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Verified customer reviews
          </h2>
          
          <div className="flex gap-4 overflow-x-auto pb-4">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-w-[220px] max-w-[220px] h-[200px] flex-shrink-0 flex flex-col"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                    {review.initials}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{review.name}</h3>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-3 flex-grow">
                  {review.content}
                </p>
                
                <div className="flex justify-between items-center mt-auto">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 text-orange-500 fill-orange-500"
                      />
                    ))}
                  </div>
                  <p className="text-gray-500 text-xs">{review.date}</p>
                </div>
              </div>
            ))}
            
            {/* Navigation button */}
            <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 self-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom Section with Google Reviews and App Download */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Google Reviews Summary */}
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="flex flex-col items-center mb-4">
              <div className="text-2xl font-bold text-blue-500 mb-2">Google</div>
              <div className="flex items-center gap-2">
                <div className="text-gray-600">Reviews</div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-orange-500 fill-orange-500"
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              What do customers say about ServiceMarket?
            </h3>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="w-8 h-8 text-orange-500 fill-orange-500" />
              <span className="text-2xl font-bold text-gray-800">4.7/5.0</span>
            </div>
            
            <p className="text-gray-600">
              12278 reviews as of August 2025
            </p>
          </div>

          {/* App Download Promotional Banner */}
          <div className="bg-cover bg-center rounded-xl p-8 text-white relative overflow-hidden" style={{ backgroundImage: 'url("/app.png")' }}>
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-semibold mb-2">
                Download the app and enjoy
              </h3>
              <div className="text-4xl font-bold mb-2">20% off</div>
              <p className="text-lg mb-6">on your first booking</p>
              
              <div className="flex gap-3">
                <button className="bg-white text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  Download on the App Store
                </button>
                <button className="bg-white text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  Get it on Play Store
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Read all customer reviews button */}
        <div className="text-center mt-12">
          <button className="border-2 border-primary text-primary text-md bg-white px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
            Read all customer reviews
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewSlider;
