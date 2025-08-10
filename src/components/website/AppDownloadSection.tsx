import React from "react";

const AppDownloadSection: React.FC = () => {
  return (
    <section className="bg-white pt-10 px-4 ">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Left Side */}
        <div className="flex-1 text-center md:text-start mb-10">
          <h2 className="text-3xl font-bold mb-4">DOWNLOAD OUR SUPER APP!</h2>
          <p className="text-xl text-gray-700 mb-6">
            Manage all to-dos with a single tap! Book and manage your
            appointments, view your professional’s profile and ratings, get the
            latest offers, and much more.
          </p>
          <div className="flex gap-4">
            {/* App Store Button */}
            <a
              href="#"
              className="flex items-center justify-center text-white bg-black py-2 px-6 rounded-md"
            >
              <img src="./appstore.webp" alt="App Store" className="h-8 mr-2" />
            </a>
            {/* Google Play Button */}
            <a
              href="#"
              className="flex items-center justify-center text-white bg-black py-2 px-6 rounded-md"
            >
              <img
                src="playstore.webp"
                alt="Google Play"
                className="h-8 mr-2"
              />
            </a>
          </div>
        </div>

        {/* Right Side: Phone Preview */}
        <div className="flex-1">
          <img
            src="./apps.webp"
            alt="App Preview"
            className="md:w-[350px] md:h-[350px] mx-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default AppDownloadSection;
