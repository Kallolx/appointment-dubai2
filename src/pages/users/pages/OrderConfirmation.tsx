import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Loader2,
  Gift,
  Phone,
  Mail,
  CreditCard,
  Search,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";

interface OrderData {
  payment_success: any;
  id: number;
  service: string;
  appointment_date: string;
  appointment_time: string;
  location: string;
  price: number | string;
  status: string;
  notes?: string;
  created_at: string;
}

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Search bar state
  const [selectedCity, setSelectedCity] = useState("dubai");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const order = location.state?.orderData;
    const appointmentId = searchParams.get('appointment_id');
    const paymentSuccess = searchParams.get('payment_success');
    
    if (order) {
      console.log("OrderConfirmation - orderData received:", order);
      console.log("OrderConfirmation - status:", order.status);
      setOrderData(order);
    } else if (appointmentId && paymentSuccess === 'true') {
      // Handle direct redirect from Ziina payment success
      console.log("OrderConfirmation - Payment success redirect for appointment:", appointmentId);
      setOrderData({
        id: parseInt(appointmentId),
        status: 'confirmed',
        payment_method: 'Ziina',
        payment_success: true,
        service: 'Service',
        appointment_date: new Date().toISOString().split('T')[0],
        appointment_time: 'Time',
        location: 'Location',
        price: 0,
        created_at: new Date().toISOString()
      } as any);
    } else {
      // Redirect back if no order data
      navigate("/user/bookings");
    }
  }, [location.state, navigate, searchParams]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getLocationDisplay = (location: string) => {
    try {
      const locationObj = JSON.parse(location);
      return `${locationObj.address}, ${locationObj.area}, ${locationObj.city}`;
    } catch (e) {
      return location;
    }
  };

  // Search functionality
  const cities = [
    { name: "Dubai", value: "dubai" },
    { name: "Abu Dhabi", value: "abu-dhabi" },
    { name: "Sharjah", value: "sharjah" },
  ];

  const servicesList = [
    "Local Moving In Dubai",
    "International Moving From Dubai",
    "Villa Moving In Dubai",
    "Furniture Moving In Dubai",
    "Office Moving In Dubai",
    "Storage In Dubai",
    "Furniture Storage In Dubai",
    "Self Storage In Dubai",
    "Car Shipping In Dubai",
    "Moving To Australia From Dubai",
    "Moving To Canada From Dubai",
    "Moving To India From Dubai",
    "Moving To Lebanon From Dubai",
    "Moving To The UK From Dubai",
    "Moving To The USA From Dubai",
    "Home Cleaning Services In Dubai",
    "Laundry Services In Dubai",
    "Sofa Cleaning In Dubai",
    "Car Wash At Home In Dubai",
    "Deep Cleaning In Dubai",
    "Carpet Cleaning In Dubai",
    "Mattress Cleaning In Dubai",
    "Curtain Cleaning In Dubai",
    "Office Cleaning Services In Dubai",
    "Water Tank Cleaning In Dubai",
    "Window Cleaning For Villas In Dubai",
    "Holiday Home Cleaning In Dubai",
    "Handyman In Dubai",
    "Annual Maintenance Contracts In Dubai",
    "Building And Flooring In Dubai",
    "Carpentry In Dubai",
    "Curtain And Blinds Hanging In Dubai",
    "Curtains And Blinds In Dubai",
    "Electrician In Dubai",
    "Furniture Assembly In Dubai",
    "Light Bulbs And Spotlights In Dubai",
    "Locksmiths In Dubai",
    "Plumber In Dubai",
    "TV Mounting In Dubai",
    "Annual Gardening Contract In Dubai",
    "Gardening In Dubai",
    "Gazebos, Decks And Porches In Dubai",
    "Grass Lawns In Dubai",
    "Landscaping In Dubai",
    "Swimming Pools And Water Features In Dubai",
    "Women's Salon At Home In Dubai",
    "Spa At Home In Dubai",
    "Men's Salon At Home In Dubai",
    "Nails At Home In Dubai",
    "Waxing At Home In Dubai",
    "Hair At Home In Dubai",
    "Luxury Salon At Home In Dubai",
    "Lashes And Brows At Home In Dubai",
    "Doctor On Call In Dubai",
    "Nurse At Home In Dubai",
    "IV Drip At Home In Dubai",
    "Blood Tests At Home In Dubai",
    "Babysitters And Nannies In Dubai",
    "Full-Time Maids In Dubai",
    "Part-Time Maids In Dubai",
    "AC Cleaning In Dubai",
    "AC Duct Cleaning In Dubai",
    "AC Installation In Dubai",
    "AC Maintenance In Dubai",
    "AC Repair In Dubai",
    "Pest Control In Dubai",
    "Mosquitoes Pest Control In Dubai",
    "Ants Pest Control In Dubai",
    "Bed Bugs Pest Control In Dubai",
    "Cockroach Pest Control In Dubai",
    "Rats And Mice Pest Control In Dubai",
    "Termites Pest Control In Dubai",
    "Painting In Dubai",
    "Exterior Painting In Dubai",
    "Pet Grooming",
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log("Searching for:", searchQuery, "in", selectedCity);
  };

  const filteredServices = searchQuery.trim()
    ? servicesList.filter((s) =>
        s.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : [];

  const renderHighlighted = (text: string, q: string) => {
    const qi = q.trim().toLowerCase();
    if (!qi) return <>{text}</>;
    const lower = text.toLowerCase();
    const idx = lower.indexOf(qi);
    if (idx === -1) return <>{text}</>;
    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + qi.length);
    const after = text.slice(idx + qi.length);
    return (
      <>
        {before}
        <span className="font-semibold">{match}</span>
        {after}
      </>
    );
  };

  if (!orderData) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-2xl mx-auto px-4">
            <div className="flex justify-center items-center h-40">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
                <p className="text-gray-600">Loading order details...</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      {/* Search Bar - Mobile Only */}
      <div className="md:hidden bg-gray-50 py-6 border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative flex items-center bg-white rounded-sm py-1.5 px-3 shadow-lg border border-gray-200">
              {/* City selector on the left inside the bar */}
              <div className="relative flex items-center">
                <button
                  type="button"
                  onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                  className="flex items-center justify-center gap-1 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-50 transition-colors text-sm h-9 min-w-[110px]"
                >
                  <span className="text-xs font-semibold leading-none">
                    {cities.find((city) => city.value === selectedCity)?.name}
                  </span>
                  <svg
                    className={`w-4 h-4 text-black transition-transform ml-1 ${
                      isCityDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* City Dropdown */}
                {isCityDropdownOpen && (
                  <div className="absolute top-full -left-3 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[140px]">
                    {cities.map((city) => (
                      <button
                        key={city.value}
                        type="button"
                        onClick={() => {
                          setSelectedCity(city.value);
                          setIsCityDropdownOpen(false);
                        }}
                        className={`w-full text-left text-sm text-[#01788e] px-4 py-2 hover:bg-gray-50 ${
                          selectedCity === city.value ? "bg-gray-50" : ""
                        }`}
                      >
                        {city.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Vertical divider */}
              <div className="h-9 w-px bg-gray-300" />

              {/* Main search input */}
              <div className="flex-1 flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSuggestionsOpen(true);
                  }}
                  placeholder="Start typing to find a service"
                  className="w-full bg-transparent placeholder:text-xs placeholder:text-gray-400 outline-none text-gray-800 px-2 py-1 text-sm"
                />
              </div>

              {/* Search icon on the right */}
              <button
                type="submit"
                className="p-2 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Suggestions dropdown */}
            {isSuggestionsOpen && searchQuery.trim() && (
              <div className="relative mt-2">
                <div className="bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredServices.length > 0 ? (
                    filteredServices.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setSearchQuery(s);
                          setIsSuggestionsOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-gray-800"
                      >
                        {renderHighlighted(s, searchQuery)}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500">No results</div>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-2xl mx-auto px-4">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <img src="/icons/check.svg" alt="check" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {orderData.payment_success ? "Payment Successful!" : "You're all set!"}
            </h1>
            {orderData.payment_success && (
              <p className="text-green-600 font-medium mb-2">
                Your Ziina payment has been processed successfully
              </p>
            )}
          </div>

          {/* Status Progress */}
          <div
            className={`mb-6 transition-all duration-300 ${
              isExpanded ? "min-h-fit" : "h-fit"
            }`}
          >
            <CardContent className="p-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Vertical Timeline */}
                  <div className="relative">
                    <div
                      className={`absolute left-3 top-0 w-0.5 bg-gray-200 transition-all duration-300 ${
                        isExpanded ? "h-56 md:h-40" : "h-6"
                      }`}
                    ></div>

                    {/* Booking Requested - Completed/Current */}
                    <div
                      className={`flex items-start gap-4 ${
                        isExpanded ? "mb-6" : "mb-0"
                      }`}
                    >
                      <div className="relative z-10">
                        <div className="w-6 h-6 bg-[#01788e] rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <h3 className="font-semibold text-gray-900 text-base">
                          Booking requested
                        </h3>
                        <p className="text-xs text-gray-600 mt-1">
                          Your booking has been received. Please wait for
                          confirmation from a service provider.
                        </p>
                      </div>
                    </div>

                    {/* Expanded Status Details - Only show when expanded */}
                    {isExpanded && (
                      <>
                        {/* Booking Confirmed - Dynamic based on status */}
                        <div className="flex items-start gap-4 mb-6">
                          <div className="relative z-10">
                            {orderData.status === "confirmed" ||
                            orderData.status === "completed" ? (
                              // Show checkmark when confirmed
                              <div className="w-6 h-6 bg-[#01788e] rounded-full flex items-center justify-center flex-shrink-0">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            ) : (
                              // Show empty circle when pending
                              <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 pt-1">
                            <h3 className="font-semibold text-gray-900 text-base">
                              Booking confirmed
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {orderData.status === "confirmed" ||
                              orderData.status === "completed"
                                ? "A service provider has accepted your booking. Your booking will be delivered as per the booked date and time."
                                : "A service provider will accept your booking soon."}
                            </p>
                          </div>
                        </div>

                        {/* Booking Delivered - Dynamic based on status */}
                        <div className="flex items-start gap-4">
                          <div className="relative z-10">
                            {orderData.status === "completed" ? (
                              // Show checkmark when completed
                              <div className="w-6 h-6 bg-[#01788e] rounded-full flex items-center justify-center flex-shrink-0">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            ) : (
                              // Show empty circle when pending or undefined
                              <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <div className="flex-1 pt-1">
                            <h3 className="font-semibold text-gray-900 text-base">
                              Booking delivered
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {orderData.status === "completed"
                                ? "Your booking has been completed successfully."
                                : "Your booking will be completed soon."}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Expand/Collapse Button */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 border border-gray-300 rounded-full transition-colors ml-4 flex-shrink-0"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </CardContent>
          </div>

          {/* App Banner */}
          <div className="mb-6 bg-[#67307d] max-w-md mx-auto">
            <div className="p-4 text-white">
              <div className="flex flex-col">
                {/* Top Section - Heading and Brand */}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold">Earn 188 Smiles Points</h3>
                  <span className="text-base font-bold lowercase">smiles</span>
                </div>

                {/* Middle Section - Description */}
                <p className="text-white text-xs mb-3 leading-relaxed">
                  Sign up or merge your Smiles account and earn 188 Smiles
                  points after your service is delivered
                </p>

                {/* Bottom Section - Button */}
                <div className="text-left">
                  <button className="bg-white text-[#01788e] px-4 py-2 rounded-sm font-bold hover:bg-gray-100 transition-colors uppercase text-sm">
                    Connect Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* horizotal dottet divider */}
          <div className="w-full h-[2px] bg-gray-200 my-6"></div>

          {/* What Happens Next */}
          <div className="mb-6">
            <CardContent className="p-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                What happens next?
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  We will send you an email shortly once a Service Provider has
                  been assigned
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  Final amount will be charged on your preferred payment method
                  once service is completed.
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  You can cancel for free up to 6 hours before the service start
                  time. Cancellation charges apply for cancellations within 6
                  hours of the service start time (Cancellation policy).
                </li>
              </ul>
            </CardContent>
          </div>

          {/* Manage Booking Button */}
          <div className="text-center">
            <button
              onClick={() =>
                navigate(`/booking-details/${orderData.id}`, {
                  state: { orderData },
                })
              }
              className="w-full underline text-[#01788e] font-medium text-sm"
            >
              MANAGE BOOKING
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
