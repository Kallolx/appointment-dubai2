import React, { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { buildApiUrl } from "@/config/api";

interface EditDateTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: any;
  onUpdate: (updatedData: any) => void;
}

const EditDateTimeModal: React.FC<EditDateTimeModalProps> = ({
  isOpen,
  onClose,
  orderData,
  onUpdate,
}) => {
  const dateScrollRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDbDate, setSelectedDbDate] = useState("");
  const [dates, setDates] = useState<any[]>([]);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch available dates and time slots from API (same as Step 3)
  const fetchAvailableData = async () => {
    try {
      setLoading(true);
      setError("");

      // Get category ID from order data if available
      let categoryId = null;
      if (orderData?.service_category) {
        try {
          const categoriesResponse = await fetch(
            buildApiUrl("/api/service-categories")
          );
          if (categoriesResponse.ok) {
            const categoriesData = await categoriesResponse.json();
            const foundCategory = categoriesData.find(
              (cat) => cat.slug === orderData.service_category
            );
            if (foundCategory) {
              categoryId = foundCategory.id;
            }
          }
        } catch (error) {
          console.error("Error fetching categories for ID lookup:", error);
        }
      }

      // Fetch available dates
      const datesUrl = categoryId
        ? buildApiUrl(`/api/available-dates?categoryId=${categoryId}`)
        : buildApiUrl("/api/available-dates");

      const datesResponse = await fetch(datesUrl);
      if (!datesResponse.ok) {
        throw new Error("Failed to fetch available dates");
      }
      const datesData = await datesResponse.json();

      // Map the dates (same as Step 3)
      const formattedDates = datesData.map((dateItem) => {
        const dbDateStr = dateItem.date;
        const [year, month, day] = dbDateStr.split("-");
        const dayNames = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        const date = new Date(Number(year), Number(month) - 1, Number(day));

        return {
          id: dateItem.id,
          dayName: dayNames[date.getDay()],
          date: Number(day),
          month: monthNames[Number(month) - 1],
          fullDate: `${monthNames[Number(month) - 1]} ${Number(day)}, ${year}`,
          dbDate: dbDateStr,
          maxAppointments: dateItem.max_appointments,
        };
      });

      setDates(formattedDates);

      // Set current selection from orderData
      if (orderData?.appointment_date) {
        const currentDate = formattedDates.find(
          (d) => d.dbDate === orderData.appointment_date
        );
        if (currentDate) {
          setSelectedDate(currentDate.fullDate);
          setSelectedDbDate(currentDate.dbDate);
        }
      }
    } catch (err) {
      console.error("Error fetching available data:", err);
      setError("Failed to load available dates and times. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch time slots for a specific date (same as Step 3)
  const fetchTimeSlotsForDate = async (dbDate) => {
    try {
      setLoading(true);
      setError("");

      if (!dbDate) {
        setTimeSlots([]);
        return;
      }

      let categoryId = null;
      if (orderData?.service_category) {
        try {
          const categoriesResponse = await fetch(
            buildApiUrl("/api/service-categories")
          );
          if (categoriesResponse.ok) {
            const categoriesData = await categoriesResponse.json();
            const foundCategory = categoriesData.find(
              (cat) => cat.slug === orderData.service_category
            );
            if (foundCategory) {
              categoryId = foundCategory.id;
            }
          }
        } catch (error) {
          console.error(
            "Error fetching categories for time slots ID lookup:",
            error
          );
        }
      }

      let url = buildApiUrl(
        `/api/available-time-slots?date=${encodeURIComponent(dbDate)}`
      );
      if (categoryId) {
        url += `&categoryId=${categoryId}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch time slots for date");
      }
      const data = await res.json();

      const formattedTimeSlots = data.map((slot) => {
        const startTime = formatTime12Hour(slot.start_time);
        const endTime = formatTime12Hour(slot.end_time);
        return {
          id: slot.id,
          start_time: slot.start_time,
          end_time: slot.end_time,
          displayTime: `${startTime} - ${endTime}`,
          extra_price: slot.extra_price || 0,
        };
      });

      setTimeSlots(formattedTimeSlots);

      // Set current time selection
      if (orderData?.appointment_time) {
        const currentTimeSlot = formattedTimeSlots.find(
          (slot) => slot.start_time === orderData.appointment_time
        );
        if (currentTimeSlot) {
          setSelectedTime(currentTimeSlot.displayTime);
        }
      }
    } catch (err) {
      console.error("Error fetching time slots for date:", err);
      setError("Failed to load time slots for the selected date.");
      setTimeSlots([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert 24-hour time to 12-hour format (same as Step 3)
  const formatTime12Hour = (time24) => {
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    if (isOpen) {
      fetchAvailableData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedDbDate) {
      fetchTimeSlotsForDate(selectedDbDate);
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

  const handleSave = async () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Error",
        description: "Please select both date and time",
        variant: "destructive",
      });
      return;
    }

    const selectedTimeSlot = timeSlots.find(
      (slot) => slot.displayTime === selectedTime
    );
    if (!selectedTimeSlot) {
      toast({
        title: "Error",
        description: "Please select a valid time slot",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        buildApiUrl(`/api/user/appointments/${orderData.id}`),
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            appointment_date: selectedDbDate,
            appointment_time: selectedTimeSlot.start_time,
          }),
        }
      );

      if (response.ok) {
        const updatedData = {
          ...orderData,
          appointment_date: selectedDbDate,
          appointment_time: selectedTimeSlot.start_time,
        };
        onUpdate(updatedData);
        toast({
          title: "Success",
          description: "Date and time updated successfully!",
        });
        onClose();
      } else {
        throw new Error("Failed to update booking");
      }
    } catch (error) {
      console.error("Error updating date/time:", error);
      toast({
        title: "Error",
        description: "Failed to update date and time. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full mx-0 mb-0 sm:mx-4 sm:max-w-2xl bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Edit Date & Time
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Same as Step 3 */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-gray-600">
                Loading available dates and times...
              </span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{error}</p>
              <button
                onClick={fetchAvailableData}
                className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Date Selection Section */}
              <section className="mb-8">
                <h2 className="text-md p-2 font-bold text-gray-600 mb-2">
                  Which Day would you like us to come?
                </h2>

                {dates.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-yellow-800">
                      No available dates for this service category at the
                      moment. Please check back later or contact us for
                      assistance.
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Left Arrow - Hidden on Mobile */}
                    <button
                      onClick={() => scroll("left", dateScrollRef)}
                      className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2"
                    >
                      <ChevronLeft className="w-8 h-8 text-gray-600" />
                    </button>

                    {/* Date Cards */}
                    <div
                      ref={dateScrollRef}
                      className="flex overflow-x-auto gap-2 md:px-12 px-2 scrollbar-hide"
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
                          className={`p-2 rounded-sm w-[70px] cursor-pointer transition-all duration-200 text-center ${
                            selectedDate === dateItem.fullDate
                              ? "bg-[#b2d7de]"
                              : "border-gray-300 border bg-white hover:border-gray-400"
                          }`}
                        >
                          <div
                            className={`font-medium mb-1 ${
                              selectedDate === dateItem.fullDate
                                ? "text-gray-800"
                                : "text-gray-900"
                            }`}
                          >
                            {dateItem.dayName.slice(0, 3)}
                          </div>
                          <div
                            className={`text-sm ${
                              selectedDate === dateItem.fullDate
                                ? "text-gray-800"
                                : "text-gray-600"
                            }`}
                          >
                            {dateItem.month} {dateItem.date}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Right Arrow - Hidden on Mobile */}
                    <button
                      onClick={() => scroll("right", dateScrollRef)}
                      className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2"
                    >
                      <ChevronRight className="w-8 h-8 text-gray-600" />
                    </button>
                  </div>
                )}
              </section>

              {/* Time Selection Section */}
              {selectedDate && (
                <section className="mb-8">
                  <h2 className="text-md font-bold text-gray-600 mb-4">
                    What time would you like us to arrive?
                  </h2>

                  {timeSlots.length === 0 ? (
                    <div className="p-6 text-center">
                      <p className="text-yellow-800">
                        No available time slots for this service category on the
                        selected date. Please try a different date or contact us
                        for assistance.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 max-w-2xl">
                      {timeSlots.map((timeSlot) => (
                        <div
                          key={timeSlot.id}
                          onClick={() => setSelectedTime(timeSlot.displayTime)}
                          className={`p-3 text-sm rounded-sm cursor-pointer transition-all duration-200 text-center relative ${
                            selectedTime === timeSlot.displayTime
                              ? "bg-[#b2d7de] border border-[#b2d7de]"
                              : "bg-white border border-gray-300"
                          }`}
                        >
                          {/* Extra Price Badge */}
                          {timeSlot.extra_price > 0 && (
                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white text-[10px] md:text-xs px-2 rounded-full font-medium">
                              +{timeSlot.extra_price} AED
                            </div>
                          )}

                          <div
                            className={`font-medium ${
                              selectedTime === timeSlot.displayTime
                                ? "text-gray-800"
                                : "text-gray-900"
                            }`}
                          >
                            {timeSlot.displayTime}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* Cancellation info box */}
              <div className="mt-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-start gap-3">
                  <Info className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div className="text-xs text-gray-700">
                    Free cancellation up to 6 hours before your booking start
                    time.{" "}
                    <a
                      href="/privacy-policy"
                      className="text-red-900 underline"
                    >
                      View cancellation policy
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading || !selectedDate || !selectedTime}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDateTimeModal;
