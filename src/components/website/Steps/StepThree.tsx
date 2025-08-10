import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CancellationPolicy from "../CancellationPolicy";

const StepThree = ({ onSelectionChange }) => {
  const {
    data: professionals = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["professionals"],
    queryFn: async () => {
      const res = await fetch("/data3.json");
      if (!res.ok) throw new Error("Failed to fetch professionals");
      return res.json();
    },
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const dateScrollRef = useRef<HTMLDivElement>(null);
  const timeScrollRef = useRef<HTMLDivElement>(null);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const [selectedDateOnly, setSelectedDateOnly] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("15:00-16:00");
  const [text, setText] = useState("");
  const maxLength = 150;

  // console.log(selectedProfessional, selectedDate, selectedTime);
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange({
        professional: selectedProfessional,
        date: selectedDate,
        time: selectedTime,
      });
    }
  }, [selectedProfessional, selectedDate, selectedTime, onSelectionChange]);

  const scroll = (direction, ref) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  const dates = [
    { day: "Tue", date: 5, dateAndMonth: "5 Aug 2025" },
    { day: "Wed", date: 6, dateAndMonth: "6 Aug 2025" },
    { day: "Thu", date: 7, dateAndMonth: "7 Aug 2025" },
    { day: "Fri", date: 8, dateAndMonth: "8 Aug 2025" },
    { day: "Sat", date: 9, dateAndMonth: "9 Aug 2025" },
    { day: "Sun", date: 10, dateAndMonth: "10 Aug 2025" },
    { day: "Mon", date: 11, dateAndMonth: "11 Aug 2025" },
    { day: "Tue", date: 12, dateAndMonth: "12 Aug 2025" },
    { day: "Tue", date: 13, dateAndMonth: "13 Aug 2025" },
    { day: "Tue", date: 14, dateAndMonth: "14 Aug 2025" },
  ];

  const timeSlots = [
    "08:00-09:00",
    "14:30-15:30",
    "15:00-16:00",
    "15:30-16:30",
    "16:00-17:00",
    "17:30-18:30",
  ];

  if (isLoading) return <p>Loading professionals...</p>;
  if (error) return <p>Error loading professionals: {error.message}</p>;

  return (
    <div
      style={{
        // Hide scrollbar styles
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE & Edge
      }}
      className="px-4 h-[600px] relative overflow-y-auto hide-vertical-scrollbar"
    >
      {/* profession section */}
      <section className="relative">
        <h2 className=" font-semibold mb-4">
          Which professional do you prefer?
        </h2>

        {/* Left Arrow */}
        <button
          onClick={() => scroll("left", scrollRef)}
          className="absolute left-2 top-[60%] -translate-y-1/2 z-10 hover:bg-gray-200 rounded-full p-2 shadow"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scrollable Cards */}
        <div
          ref={scrollRef}
          style={{
            // Hide scrollbar styles
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE & Edge
          }}
          className="flex overflow-x-auto gap-4 hide-horizontal-scrollbar scroll-smooth py-4 md:px-10"
        >
          <div className="min-w-[162px] max-w-[162px] border-2 border-blue-300 p-4 rounded-xl bg-blue-50 text-center  flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-blue-400 rounded-full mx-auto flex items-center justify-center text-white font-bold text-sm">
              justlife
            </div>
            <h3 className="font-semibold mt-2">Auto assign</h3>
            <p className="text-sm text-gray-600">
              We'll assign the best professional
            </p>
          </div>

          {professionals.map((pro, index) => (
            <div
              key={index}
              onClick={() => setSelectedProfessional(pro.name)} // use a unique identifier
              className={`min-w-[162px] max-w-[162px]  border p-4 rounded-xl text-center cursor-pointer transition flex flex-col justify-between
      ${
        selectedProfessional === pro.name
          ? "bg-sky-100 border-blue-400"
          : "bg-white"
      }`}
            >
              <img
                src={pro.image}
                alt={pro.name}
                className="w-20 h-20 object-cover rounded-full mx-auto"
              />
              <h3 className="text-[#00C3FF] font-semibold mt-2 hover:underline">
                {pro.name}
              </h3>
              <p className="text-yellow-500 mt-1">⭐ {pro.rating}</p>
              <p className="text-sm text-gray-600">Recommended in your area</p>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right", scrollRef)}
          className="absolute right-2 top-[60%] -translate-y-1/2 z-10 hover:bg-gray-200 transition rounded-full p-2 shadow"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </section>

      {/* date section */}
      <section className="mt-10">
        <h2 className=" font-semibold mb-4">
          When would you like your service?
        </h2>

        <div className="relative">
          <button
            onClick={() => scroll("left", dateScrollRef)}
            className="absolute left-0 top-[64%] -translate-y-1/2 z-10 hover:bg-gray-200 rounded-full p-2 shadow"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            ref={dateScrollRef}
            style={{
              // Hide scrollbar styles
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE & Edge
            }}
            className="flex overflow-x-auto gap-4 hide-horizontal-scrollbar scroll-smooth px-10 py-2"
          >
            {dates.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedDate(item.dateAndMonth);
                  setSelectedDateOnly(item.date);
                }}
                className="flex flex-col items-center cursor-pointer"
              >
                <div className="text-sm text-gray-600 mb-1">{item.day}</div>
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border text-sm
                    ${
                      selectedDateOnly === item.date
                        ? "border-blue-500 text-blue-600 font-semibold"
                        : "border-gray-300 text-gray-600"
                    }`}
                >
                  {item.date}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("right", dateScrollRef)}
            className="absolute right-0 top-[64%] -translate-y-1/2 z-10 hover:bg-gray-200 rounded-full p-2 shadow"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* time section */}
      <section className="mt-6 pb-32">
        <div className="flex justify-between items-center mb-4">
          <h2 className=" font-semibold">
            What time would you like us to start?
          </h2>
          <a href="#" className="text-blue-500 text-sm hover:underline">
            See all
          </a>
        </div>

        <div className="relative">
          <button
            onClick={() => scroll("left", timeScrollRef)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hover:bg-gray-200 rounded-full p-2 shadow"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            ref={timeScrollRef}
            style={{
              // Hide scrollbar styles
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE & Edge
            }}
            className="flex overflow-x-auto gap-4 hide-horizontal-scrollbar scroll-smooth px-10 py-2"
          >
            {timeSlots.map((slot, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedTime(slot)}
                className={`px-4 py-2 border rounded-full text-sm cursor-pointer whitespace-nowrap
                  ${
                    selectedTime === slot
                      ? "bg-blue-100 text-blue-600 border-blue-300 font-semibold"
                      : "border-gray-300 text-gray-800"
                  }`}
              >
                {slot}
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("right", timeScrollRef)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hover:bg-gray-200 rounded-full p-2 shadow"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        {/* textarea */}

        <div className="bg-gray-100 p-4 rounded-lg text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <Info size={16} />
            <span>
              Enjoy free cancellation up to 6 hours before your booking start
              time.
            </span>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setShowModal(true)}
              className="text-[#00C3FF] font-medium underline "
            >
              Details
            </button>
            {/* Modal */}
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center md:items-center items-end z-50">
                <div className="bg-white p-4 rounded-lg shadow-lg relative md:w-[470px]">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-lg">
                      Cancellation and rescheduling policy
                    </h2>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                    >
                      &times;
                    </button>
                  </div>
                  <hr className="border-gray-300 " />
                  <CancellationPolicy />
                </div>
              </div>
            )}
          </div>
        </div>
        {/* instruction */}
        <div className="mt-4 ">
          <h2 className=" font-semibold my-6">
            What time would you like us to start?
          </h2>
          <div className="relative">
            <textarea
              className="w-full h-32 p-4 pr-16 text-gray-700 placeholder-gray-400 border border-[#00C3FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              placeholder="Add colour to your home with our premium painting service."
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={maxLength}
            />
            <span className="absolute bottom-3 right-4 text-sm text-gray-400">
              {text.length}/{maxLength}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StepThree;
