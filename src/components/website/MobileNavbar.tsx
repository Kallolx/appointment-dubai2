import { Input } from "@/components/ui/input";
import { LocateFixed, Menu, Search, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import LoginModal from "./LoginModal";

const MobileNavbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCountryDrawerOpen, setIsCountryDrawerOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const toggleCountryDrawer = () => {
    setIsCountryDrawerOpen(!isCountryDrawerOpen);
  };
  return (
    <nav className="w-full bg-white shadow-sm px-4 py-3 md:hidden block">
      {/* Top Row */}
      <div className="flex items-center justify-between mb-3">
        {/* Logo */}
        <div className="text-2xl font-bold text-sky-500">
          <img src="./jl-logo.svg" alt="" />
        </div>

        {/* Right Items */}
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium">العربية</span>
          <img
            src="https://flagcdn.com/w40/ae.png"
            alt="UAE Flag"
            className="w-5 h-5 rounded-full"
          />
          {/* Profile Button */}
          <div className="relative">
            <Button
              variant="outline"
              className="rounded-full px-3 py-2 flex items-center gap-2 w-20 h-12 bg-white hover:bg-gray-50"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <User className="w-6 h-6" />
              <Menu className="w-6 h-6" />
            </Button>

            {isProfileOpen && (
              <div className="absolute flex flex-col justify-between h-screen pb-24 -right-4 top-full mt-2 w-screen bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                <div>
                  <div className="p-4">
                    <button
                      onClick={() => setLoginModalOpen(true)}
                      className="bg-[#FFD03E] text-white py-2 px-4 rounded-full font-bold w-full hover:bg-[#FFC107] transition"
                    >
                      Sign Up or Login
                    </button>
                  </div>
                  <div className="p-2">
                    <div className="flex items-center gap-2 py-2 hover:bg-gray-50 rounded px-2 cursor-pointer">
                      <img
                        width={18}
                        src="https://deax38zvkau9d.cloudfront.net/prod/assets/static/svgs/question-mark-outlined.svg"
                      />
                      <span className="text-sm font-medium">Help</span>
                    </div>
                  </div>
                  <hr className="border-gray-300" />
                </div>
                <div className="flex gap-4 p-5 justify-center ">
                  <Link to="https://www.apple.com/app-store/" target="_blank">
                    <img src="/appstore.webp" className="h-10" />
                  </Link>
                  <Link to="https://play.google.com/store" target="_blank">
                    <img src="/playstore.webp" className="h-10" />
                  </Link>
                </div>
              </div>
            )}
            {isLoginModalOpen && (
              <LoginModal setLoginModalOpen={setLoginModalOpen} />
            )}
          </div>
        </div>
      </div>

      {/* Location Input */}
      <div className="flex items-center bg-blue-100 rounded-lg px-3 py-2 mb-2">
        <LocateFixed className="text-sky-500 w-4 h-4 mr-2" />
        <span className="text-sm font-medium text-gray-800 flex-1">
          Dubai Marina
        </span>
        <LocateFixed className="text-sky-500 w-4 h-4" />
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder='Search for "Home Cleaning"'
          className="pl-9 rounded-lg text-sm placeholder:text-gray-500 border-gray-400"
        />
      </div>
    </nav>
  );
};

export default MobileNavbar;
