import React from "react";

const TopReasons: React.FC = () => {
  return (
    <section className="bg-gray-100 py-10">
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

          <div className="md:grid md:grid-cols-3 gap-6 flex md:flex-row overflow-x-auto md:overflow-visible space-x-4 md:space-x-0 pb-4 md:pb-0">
            {/* Card 1: Everything your home needs */}
            <div className="bg-white flex flex-col items-start rounded-xl px-4 py-6 md:px-6 md:py-9 text-left transition hover:shadow-md w-64 sm:w-72 md:w-auto flex-shrink-0">
              <div className="w-16 h-16 mb-4 flex items-center justify-center">
                <img src="/icons/home.svg" alt="home" />
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-800">
                Everything your home needs
              </h3>
              <p className="text-gray-600">
                We have made it our business to make it easy for you to get any help you might need for your home in one place.
              </p>
            </div>

            {/* Card 2: The best professionals for your job */}
            <div className="bg-white flex flex-col items-start rounded-xl px-4 py-6 md:px-6 md:py-9 text-left transition hover:shadow-md w-64 sm:w-72 md:w-auto flex-shrink-0">
              <div className="w-16 h-16 mb-4 flex items-center justify-center">
                <img src="/icons/doc.svg" alt="home" />
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-800">
                The best professionals for your job
              </h3>
              <p className="text-gray-600">
                We measure and manage our service partners on their service quality to make sure our service is great.
              </p>
            </div>

            {/* Card 3: Great customer service */}
            <div className="bg-white flex flex-col items-start rounded-xl px-4 py-6 md:px-6 md:py-9 text-left transition hover:shadow-md w-64 sm:w-72 md:w-auto flex-shrink-0">
              <div className="w-16 h-16 mb-4 flex items-center justify-center">
                <img src="/icons/headphone.svg" alt="home" />
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

          <div className="md:grid md:grid-cols-3 gap-6 flex md:flex-row overflow-x-auto md:overflow-visible space-x-4 md:space-x-0 pb-4 md:pb-0">
            {/* Card 1: Tell us what you need */}
            <div className="bg-white flex flex-col items-center rounded-xl shadow-sm px-4 py-6 md:px-6 md:py-9 text-center transition hover:shadow-md w-64 sm:w-72 md:w-auto flex-shrink-0">
              <div className="w-16 h-16 mb-4 flex items-center justify-center relative">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                  <div className="relative">
                    <img src="/icons/1.svg" alt="home" />
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
            <div className="bg-white flex flex-col items-center rounded-xl shadow-sm px-4 py-6 md:px-6 md:py-9 text-center transition hover:shadow-md border border-blue-100 w-64 sm:w-72 md:w-auto flex-shrink-0">
              <div className="w-16 h-16 mb-4 flex items-center justify-center relative">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                  <div className="relative">
                    <img src="/icons/2.svg" alt="home" />
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
            <div className="bg-white flex flex-col items-center rounded-xl shadow-sm px-4 py-6 md:px-6 md:py-9 text-center transition hover:shadow-md border border-blue-100 w-64 sm:w-72 md:w-auto flex-shrink-0">
              <div className="w-16 h-16 mb-4 flex items-center justify-center relative">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                  <div className="relative">
                    <img src="/icons/3.svg" alt="home" />
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
