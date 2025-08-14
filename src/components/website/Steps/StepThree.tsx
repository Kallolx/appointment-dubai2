import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const StepThree = ({ onSelectionChange }) => {
  const dateScrollRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [dates, setDates] = useState<any[]>([]);

  // Generate dates for the next 10 days
  const generateDates = () => {
    const datesList = [];
    const today = new Date();
    for (let i = 0; i < 10; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      datesList.push({
        id: i,
        dayName: dayNames[date.getDay()],
        date: date.getDate(),
        month: monthNames[date.getMonth()],
        fullDate: `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`,
        dateObj: date
      });
    }
    return datesList;
  };

  // Initialize dates on mount
  useEffect(() => {
    const generatedDates = generateDates();
    setDates(generatedDates);
    if (generatedDates.length > 0 && !selectedDate) {
      setSelectedDate(generatedDates[0].fullDate);
    }
  }, []);

  useEffect(() => {
    if (onSelectionChange) {
      // Convert the selected date to YYYY-MM-DD format for the database
      let formattedDate = "";
      let formattedTime = "";
      
      if (selectedDate) {
        // Find the date object from our generated dates
        const dateItem = dates.find(d => d.fullDate === selectedDate);
        if (dateItem) {
          // Format as YYYY-MM-DD for database storage
          const year = dateItem.dateObj.getFullYear();
          const month = String(dateItem.dateObj.getMonth() + 1).padStart(2, '0');
          const day = String(dateItem.dateObj.getDate()).padStart(2, '0');
          formattedDate = `${year}-${month}-${day}`;
        }
      }
      
      if (selectedTime) {
        // Extract the start time from "9:00 AM - 9:30 AM" format and convert to 24-hour format
        const startTime = selectedTime.split(' - ')[0];
        formattedTime = convertTo24Hour(startTime);
      }
      
      onSelectionChange({
        professional: null, // Not used in this step
        date: formattedDate,
        time: formattedTime,
        displayDate: selectedDate, // Keep the display format for UI
        displayTime: selectedTime
      });
    }
  }, [selectedDate, selectedTime, onSelectionChange]);

  // Helper function to convert 12-hour time to 24-hour format
  const convertTo24Hour = (time12h: string) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
      hours = '00';
    }
    
    if (modifier === 'PM') {
      hours = String(parseInt(hours, 10) + 12);
    }
    
    return `${String(hours).padStart(2, '0')}:${minutes}:00`;
  };

  const scroll = (direction, ref) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };


  // Time slots for each date
  const timeSlots = [
    "9:00 AM - 9:30 AM",
    "10:00 AM - 10:30 AM", 
    "11:00 AM - 11:30 AM",
    "2:00 PM - 2:30 PM",
    "3:00 PM - 3:30 PM",
    "4:00 PM - 4:30 PM"
  ];

  return (
    <div className="px-4 md:px-0">
      <div className="max-w-4xl">
        {/* Date Selection Section */}
        <section className="mb-8">
          <h2 className="text-xl p-2 font-semibold text-gray-900 mb-6">
            Which Day would you like us to come?
          </h2>

          <div className="relative">
            {/* Left Arrow */}
            <button
              onClick={() => scroll("left", dateScrollRef)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 rounded-full p-2 shadow-md border"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            {/* Date Cards */}
            <div
              ref={dateScrollRef}
              className="flex overflow-x-auto gap-4 px-12 py-2 scrollbar-hide"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {dates.map((dateItem) => (
                <div
                  key={dateItem.id}
                  onClick={() => setSelectedDate(dateItem.fullDate)}
                  className={`min-w-[140px] p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 text-center ${
                    selectedDate === dateItem.fullDate
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm"
                  }`}
                >
                  <div className={`font-medium mb-1 ${
                    selectedDate === dateItem.fullDate ? "text-blue-700" : "text-gray-900"
                  }`}>
                    {dateItem.dayName}
                  </div>
                  <div className={`text-sm ${
                    selectedDate === dateItem.fullDate ? "text-blue-600" : "text-gray-600"
                  }`}>
                    {dateItem.month} {dateItem.date}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scroll("right", dateScrollRef)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 rounded-full p-2 shadow-md border"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </section>

        {/* Time Selection Section */}
        {selectedDate && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              What time would you like us to arrive?
            </h2>

            {/* Time Slots Grid */}
            <div className="grid grid-cols-2 gap-4 max-w-2xl">
              {timeSlots.map((timeSlot, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedTime(timeSlot)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 text-center ${
                    selectedTime === timeSlot
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm"
                  }`}
                >
                  <div className={`font-medium ${
                    selectedTime === timeSlot ? "text-blue-700" : "text-gray-900"
                  }`}>
                    {timeSlot}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Selected Date and Time Display */}
        {selectedDate && selectedTime && (
          <section className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
            <h3 className="font-medium text-green-800 mb-2">Selected Appointment</h3>
            <p className="text-green-700">
              <span className="font-medium">Date:</span> {selectedDate}
            </p>
            <p className="text-green-700">
              <span className="font-medium">Time:</span> {selectedTime}
            </p>
          </section>
        )}
      </div>
    </div>
  );
};

export default StepThree;
