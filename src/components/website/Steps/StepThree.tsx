import React, { useEffect, useRef, useState } from "react";
import { buildApiUrl } from "@/config/api";
import { ChevronLeft, ChevronRight } from "lucide-react";

const StepThree = ({ onSelectionChange }) => {
  const dateScrollRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDbDate, setSelectedDbDate] = useState("");
  const [dates, setDates] = useState<any[]>([]);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch available dates and time slots from API
  const fetchAvailableData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Fetch available dates
      const datesResponse = await fetch(buildApiUrl('/api/available-dates'));
      if (!datesResponse.ok) {
        throw new Error('Failed to fetch available dates');
      }
      const datesData = await datesResponse.json();
      
  // We will fetch time slots per-selected-date. Do not fetch all slots here.
      
      // Format dates for display
      const formattedDates = datesData.map((dateItem, index) => {
        // Normalize db date to YYYY-MM-DD without time portion
        const rawDate = dateItem.date;
        let dbDateStr = rawDate;
        if (typeof rawDate === 'string') {
          if (rawDate.includes('T')) {
            dbDateStr = rawDate.split('T')[0];
          } else if (rawDate.length >= 10) {
            dbDateStr = rawDate.slice(0, 10);
          }
        } else if (rawDate instanceof Date) {
          dbDateStr = rawDate.toISOString().split('T')[0];
        }

        const date = new Date(dbDateStr);
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        return {
          id: dateItem.id,
          dayName: dayNames[date.getDay()],
          date: date.getDate(),
          month: monthNames[date.getMonth()],
          fullDate: `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`,
          dateObj: date,
          dbDate: dbDateStr, // Store normalized database date (YYYY-MM-DD)
          maxAppointments: dateItem.max_appointments
        };
      });
      
      setDates(formattedDates);

      // Auto-select first date if available (set both display and db date)
      if (formattedDates.length > 0 && !selectedDate) {
        setSelectedDate(formattedDates[0].fullDate);
        setSelectedDbDate(formattedDates[0].dbDate);
      }
      
    } catch (err) {
      console.error('Error fetching available data:', err);
      setError('Failed to load available dates and times. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch time slots for a specific YYYY-MM-DD date
  const fetchTimeSlotsForDate = async (dbDate) => {
    try {
      setLoading(true);
      setError("");

      if (!dbDate) {
        setTimeSlots([]);
        return;
      }

  const url = buildApiUrl(`/api/available-time-slots?date=${encodeURIComponent(dbDate)}`);
  console.debug('[StepThree] fetching time slots from', url);
  const res = await fetch(url);
      if (!res.ok) {
        throw new Error('Failed to fetch time slots for date');
      }
      const data = await res.json();
  console.debug('[StepThree] fetched', Array.isArray(data) ? data.length : 'non-array', 'time slots', data);

      const formattedTimeSlots = data.map((slot) => {
        const startTime = formatTime12Hour(slot.start_time);
        const endTime = formatTime12Hour(slot.end_time);
        return {
          id: slot.id,
          start_time: slot.start_time,
          end_time: slot.end_time,
          displayTime: `${startTime} - ${endTime}`,
          extra_price: slot.extra_price || 0
        };
      });

      setTimeSlots(formattedTimeSlots);
    } catch (err) {
      console.error('Error fetching time slots for date:', err);
      setError('Failed to load time slots for the selected date.');
      setTimeSlots([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert 24-hour time to 12-hour format
  const formatTime12Hour = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Initialize data on mount
  useEffect(() => {
    fetchAvailableData();
  }, []);

  useEffect(() => {
    if (onSelectionChange && selectedDate && selectedTime) {
      const selectedTimeSlot = timeSlots.find(slot => slot.displayTime === selectedTime);
      onSelectionChange({
        date: selectedDate,
        time: selectedTime,
        extra_price: selectedTimeSlot?.extra_price || 0
      });
    }
  }, [selectedDate, selectedTime, timeSlots]); // Removed onSelectionChange from dependencies

  // when selectedDbDate changes, refetch time slots for that date
  useEffect(() => {
    if (selectedDbDate) {
      fetchTimeSlotsForDate(selectedDbDate);
      // reset any previously selected time
      setSelectedTime("");
    } else {
      setTimeSlots([]);
    }
  }, [selectedDbDate]);

  const scroll = (direction, ref) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="px-4 md:px-0">
        <div className="max-w-4xl">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-600">Loading available dates and times...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 md:px-0">
        <div className="max-w-4xl">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={fetchAvailableData}
              className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-0">
      <div className="max-w-4xl">
        {/* Date Selection Section */}
        <section className="mb-8">
          <h2 className="text-xl p-2 font-semibold text-gray-900 mb-6">
            Which Day would you like us to come?
          </h2>

          {dates.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <p className="text-yellow-800">No available dates at the moment. Please check back later.</p>
            </div>
          ) : (
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
                    onClick={() => {
                      setSelectedDate(dateItem.fullDate);
                      setSelectedDbDate(dateItem.dbDate);
                    }}
                    className={`min-w-[140px] p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 text-center ${
                      selectedDate === dateItem.fullDate
                        ? "border-primary bg-red-50 shadow-md"
                        : "border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm"
                    }`}
                  >
                    <div className={`font-medium mb-1 ${
                      selectedDate === dateItem.fullDate ? "text-primary" : "text-gray-900"
                    }`}>
                      {dateItem.dayName}
                    </div>
                    <div className={`text-sm ${
                      selectedDate === dateItem.fullDate ? "text-primary" : "text-gray-600"
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
          )}
        </section>

        {/* Time Selection Section */}
        {selectedDate && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              What time would you like us to arrive?
            </h2>

            {timeSlots.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <p className="text-yellow-800">No available time slots at the moment. Please check back later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 max-w-2xl">
                {timeSlots.map((timeSlot) => (
                  <div
                    key={timeSlot.id}
                    onClick={() => setSelectedTime(timeSlot.displayTime)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 text-center relative ${
                      selectedTime === timeSlot.displayTime
                        ? "border-primary bg-red-50 shadow-md"
                        : "border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm"
                    }`}
                  >
                    {/* Extra Price Badge */}
                    {timeSlot.extra_price > 0 && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        +{timeSlot.extra_price} AED
                      </div>
                    )}
                    
                    <div className={`font-medium ${
                      selectedTime === timeSlot.displayTime ? "text-primary" : "text-gray-900"
                    }`}>
                      {timeSlot.displayTime}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
