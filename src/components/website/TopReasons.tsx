import React from "react";

const TopReasons: React.FC = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Why ServiceMarket Section */}
        <div className="mb-16">
          <div className="text-left mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Why ServiceMarket
            </h2>
            <p className="text-gray-600">
              We are a leading home services marketplace in the Middle East with a large and growing customer base.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Everything your home needs */}
            <div className="bg-white flex flex-col items-start rounded-xl shadow-sm px-6 py-9 text-left transition hover:shadow-md">
              <div className="w-16 h-16 mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-800">
                Everything your home needs
              </h3>
              <p className="text-gray-600">
                We have made it our business to make it easy for you to get any help you might need for your home in one place.
              </p>
            </div>

            {/* Card 2: The best professionals for your job */}
            <div className="bg-white flex flex-col items-start rounded-xl shadow-sm px-6 py-9 text-left transition hover:shadow-md">
              <div className="w-16 h-16 mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-800">
                The best professionals for your job
              </h3>
              <p className="text-gray-600">
                We measure and manage our service partners on their service quality to make sure our service is great.
              </p>
            </div>

            {/* Card 3: Great customer service */}
            <div className="bg-white flex flex-col items-start rounded-xl shadow-sm px-6 py-9 text-left transition hover:shadow-md">
              <div className="w-16 h-16 mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-800">
                Great customer service
              </h3>
              <p className="text-gray-600">
                We take customer service seriously. Our contact center is open 7 days per week to help you out with anything you need.
              </p>
            </div>
          </div>
        </div>

        {/* How it works Section */}
        <div>
          <div className="text-left mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              How it works
            </h2>
            <p className="text-gray-600">
              We have partnered with Dubai's best companies to get you the service you deserve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Tell us what you need */}
            <div className="bg-white flex flex-col items-center rounded-xl shadow-sm px-6 py-9 text-center transition hover:shadow-md border border-blue-100">
              <div className="w-16 h-16 mb-4 flex items-center justify-center relative">
                <div className="w-16 h-16 bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center">
                  <div className="relative">
                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-800">
                Tell us what you need
              </h3>
              <p className="text-gray-600">
                Let us know what service you are looking for. We offer more than 25 different home services, and we are here to help!
              </p>
            </div>

            {/* Card 2: We will find the right professional */}
            <div className="bg-white flex flex-col items-center rounded-xl shadow-sm px-6 py-9 text-center transition hover:shadow-md border border-blue-100">
              <div className="w-16 h-16 mb-4 flex items-center justify-center relative">
                <div className="w-16 h-16 bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center">
                  <div className="relative">
                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-800">
                We will find the right professional
              </h3>
              <p className="text-gray-600">
                Book your service directly with us online, or request quotes from our service partners. All our partners are licensed, vetted and reviewed by our users
              </p>
            </div>

            {/* Card 3: Sit back and relax */}
            <div className="bg-white flex flex-col items-center rounded-xl shadow-sm px-6 py-9 text-center transition hover:shadow-md border border-blue-100">
              <div className="w-16 h-16 mb-4 flex items-center justify-center relative">
                <div className="w-16 h-16 bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center">
                  <div className="relative">
                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-800">
                Sit back and relax
              </h3>
              <p className="text-gray-600">
                Let our professionals do the work while you focus on doing what you love. Our contact center is open 7 days a week to help you along the way
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopReasons;
