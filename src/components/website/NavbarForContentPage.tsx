import { ArrowLeft, Menu, User } from "lucide-react";

const NavbarForContentPage = () => {
  return (
    <div className="md:hidden ">
      {/* temporary nav for blog page */}
      {/* Top Row */}
      <div className="flex items-center justify-between mb-3">
        {/* Logo */}
        <div className="flex">
          <ArrowLeft size={35} className="" />
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
          <User className="w-5 h-5" />
          <Menu className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default NavbarForContentPage;
