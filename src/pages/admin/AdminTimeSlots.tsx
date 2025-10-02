import React, { useState, useEffect } from 'react';
import { buildApiUrl } from "@/config/api";
import NewAdminLayout from './NewAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface TimeSlotData {
  id: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  extra_price?: number; // Extra price in AED
  created_at: string;
  date?: string; // ISO date (YYYY-MM-DD) - optional if backend provides it
  service_category_id?: number | null;
  service_category_name?: string | null;
  service_category_slug?: string | null;
}

interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

interface AvailableDateOption {
  id: number;
  date: string; // YYYY-MM-DD
  formatted_date: string; // "September 15, 2025"
  day_name: string; // "Monday"
  day_short: string; // "Mon"
  month_short: string; // "Sep"
  day_number: string; // "15"
  year: string; // "2025"
  is_available: boolean;
  max_appointments: number;
  service_category_id?: number | null;
  service_category_name?: string | null;
}

const AdminTimeSlots: React.FC = () => {
  const { toast } = useToast();
  const [timeSlots, setTimeSlots] = useState<TimeSlotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [isEditingSlot, setIsEditingSlot] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState<number | null>(null);
  const [newSlot, setNewSlot] = useState({
    start_time: '',
    end_time: '',
    is_available: true,
    extra_price: 0,
    service_category_id: null as number | null
  });
  const [editSlot, setEditSlot] = useState({
    start_time: '',
    end_time: '',
    is_available: true,
    extra_price: 0,
    service_category_id: null as number | null
  });
  const [availableDates, setAvailableDates] = useState<AvailableDateOption[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(''); // YYYY-MM-DD
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [filteredDates, setFilteredDates] = useState<AvailableDateOption[]>([]);
  
  // Time slot application mode
  const [applicationMode, setApplicationMode] = useState<'all' | 'single'>('all'); // Default to 'all dates'
  const [isApplyingBulk, setIsApplyingBulk] = useState(false);
  const [selectedDatesForBulk, setSelectedDatesForBulk] = useState<string[]>([]); // Selected date IDs for bulk application
  const [showDatePicker, setShowDatePicker] = useState(false); // Show/hide available dates dropdown

  const fetchTimeSlots = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required');
        return;
      }

      // Build URL with date and category filters
      let url = buildApiUrl('/api/admin/available-time-slots');
      const params = new URLSearchParams();
      
      if (selectedDate) {
        params.append('date', selectedDate);
      }
      
      if (selectedCategory) {
        params.append('categoryId', selectedCategory.toString());
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      console.log('🔍 Fetching time slots from URL:', url);
      console.log('🔍 Selected date:', selectedDate, 'Selected category:', selectedCategory);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch time slots');
      }

      const data = await response.json();
      console.log('🔍 Time slots response:', data);
      console.log('🔍 Number of slots received:', data.length);
      setTimeSlots(data);
    } catch (err) {
      console.error('Error fetching time slots:', err);
      setError('Failed to load time slots');
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(buildApiUrl('/api/service-categories'), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        toast({
          title: "Error",
          description: "Unable to load service categories. Please refresh and try again.",
          variant: "destructive",
        });
        return;
      }
      
      const data = await response.json();
      setServiceCategories(data);
    } catch (error) {
      console.error('Error fetching service categories:', error);
      toast({
        title: "Error",
        description: "Unable to load service categories. Please check your connection.",
        variant: "destructive",
      });
    }
  };

  const fetchAvailableDates = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(buildApiUrl('/api/admin/available-dates'), {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!res.ok) {
        toast({
          title: "Error",
          description: "Unable to load available dates. Please refresh and try again.",
          variant: "destructive",
        });
        return;
      }
      const data = await res.json();

      console.log('🔍 Raw dates data from backend:', data);

      // Simply use dates as they come from database
      const normalized = Array.isArray(data) ? data : [];
      setAvailableDates(normalized);
      
      // Filter dates by selected category
      filterDatesByCategory(normalized, selectedCategory);
    } catch (err) {
      console.error('Failed to fetch available dates', err);
      toast({
        title: "Error",
        description: "Unable to load available dates. Please check your connection.",
        variant: "destructive",
      });
    }
  };

  const filterDatesByCategory = (dates: AvailableDateOption[], categoryId: number | null) => {
    if (!categoryId) {
      // Show all dates if no category selected
      setFilteredDates(dates);
      if (!selectedDate && dates.length > 0) {
        setSelectedDate(dates[0].date);
      }
      // Auto-select all dates for bulk application in 'all' mode
      if (applicationMode === 'all') {
        setSelectedDatesForBulk(dates.map(d => d.date));
      }
    } else {
      // Filter dates by category - show dates for this category or dates with no category
      const filtered = dates.filter(date => 
        date.service_category_id === categoryId || date.service_category_id === null
      );
      setFilteredDates(filtered);
      
      // Reset selected date if current selection is not in filtered results
      if (selectedDate && !filtered.find(d => d.date === selectedDate)) {
        setSelectedDate(filtered.length > 0 ? filtered[0].date : '');
      } else if (!selectedDate && filtered.length > 0) {
        setSelectedDate(filtered[0].date);
      }
      
      // Auto-select all filtered dates for bulk application in 'all' mode
      if (applicationMode === 'all') {
        setSelectedDatesForBulk(filtered.map(d => d.date));
      }
    }
  };

  const addTimeSlot = async () => {
    if (applicationMode === 'all') {
      await addTimeSlotToAllDates();
      return;
    }

    // Single date mode (original functionality)
    try {
      const token = localStorage.getItem('token');
      if (!selectedDate) {
        toast({
          title: "Missing Date",
          description: "Please select a date before adding a time slot.",
          variant: "destructive",
        });
        return;
      }

      if (!newSlot.start_time || !newSlot.end_time) {
        toast({
          title: "Missing Time",
          description: "Please enter both start and end times.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(buildApiUrl('/api/admin/available-time-slots'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          ...newSlot, 
          date: selectedDate,
          service_category_id: selectedCategory
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add time slot');
      }

      // Reset form and refresh slots
      setNewSlot({ start_time: '', end_time: '', is_available: true, extra_price: 0, service_category_id: selectedCategory });
      setIsAddingSlot(false);
      fetchTimeSlots();
      
      toast({
        title: "Success",
        description: "Time slot added successfully!",
      });
    } catch (err) {
      console.error('Error adding time slot:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Unable to add time slot. Please try again.',
        variant: "destructive",
      });
    }
  };

  const addTimeSlotToAllDates = async () => {
    try {
      setIsApplyingBulk(true);
      const token = localStorage.getItem('token');
      
      if (selectedDatesForBulk.length === 0) {
        toast({
          title: "No Dates Selected",
          description: "Please select at least one date to apply the time slot.",
          variant: "destructive",
        });
        return;
      }

      if (!newSlot.start_time || !newSlot.end_time) {
        toast({
          title: "Missing Time",
          description: "Please enter both start and end times.",
          variant: "destructive",
        });
        return;
      }

      // Create time slots for selected dates only
      const selectedDateObjects = filteredDates.filter(date => selectedDatesForBulk.includes(date.date));
      const promises = selectedDateObjects.map(date => 
        fetch(buildApiUrl('/api/admin/available-time-slots'), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            ...newSlot, 
            date: date.date,
            service_category_id: selectedCategory
          })
        })
      );

      const responses = await Promise.all(promises);
      const failedRequests = responses.filter(response => !response.ok);
      
      if (failedRequests.length > 0) {
        toast({
          title: "Partial Success",
          description: `Time slot applied to ${responses.length - failedRequests.length} out of ${responses.length} dates.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: `Time slot applied to ${selectedDatesForBulk.length} selected dates successfully!`,
        });
      }

      // Reset form and refresh
      setNewSlot({ start_time: '', end_time: '', is_available: true, extra_price: 0, service_category_id: selectedCategory });
      setIsAddingSlot(false);
      fetchTimeSlots();
      
    } catch (err) {
      console.error('Error adding time slots to selected dates:', err);
      toast({
        title: "Error",
        description: 'Unable to create time slots for selected dates. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsApplyingBulk(false);
    }
  };

  const editTimeSlot = (slot: TimeSlotData) => {
    setEditingSlotId(slot.id);
    setEditSlot({
      start_time: slot.start_time,
      end_time: slot.end_time,
      is_available: slot.is_available,
      extra_price: slot.extra_price || 0,
      service_category_id: slot.service_category_id || null
    });
    setIsEditingSlot(true);
    setIsAddingSlot(false);
  };

  const updateTimeSlot = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!editingSlotId) return;

      if (!editSlot.start_time || !editSlot.end_time) {
        toast({
          title: "Missing Time",
          description: "Please enter both start and end times.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(buildApiUrl(`/api/admin/available-time-slots/${editingSlotId}`), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editSlot)
      });

      if (!response.ok) {
        throw new Error('Failed to update time slot');
      }

      // Reset edit form and refresh slots
      setEditingSlotId(null);
      setEditSlot({ start_time: '', end_time: '', is_available: true, extra_price: 0, service_category_id: null });
      setIsEditingSlot(false);
      fetchTimeSlots();
      
      toast({
        title: "Success",
        description: "Time slot updated successfully!",
      });
    } catch (err) {
      console.error('Error updating time slot:', err);
      toast({
        title: "Error",
        description: "Unable to update time slot. Please try again.",
        variant: "destructive",
      });
    }
  };

  const cancelEdit = () => {
    setEditingSlotId(null);
    setEditSlot({ start_time: '', end_time: '', is_available: true, extra_price: 0, service_category_id: null });
    setIsEditingSlot(false);
  };

  const updateSlotAvailability = async (slotId: number, isAvailable: boolean) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(buildApiUrl(`/api/admin/available-time-slots/${slotId}`), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_available: isAvailable })
      });

      if (!response.ok) {
        throw new Error('Failed to update time slot availability');
      }

      // Refresh slots
      fetchTimeSlots();
      
      toast({
        title: "Success",
        description: `Time slot ${isAvailable ? 'enabled' : 'disabled'} successfully!`,
      });
    } catch (err) {
      console.error('Error updating time slot:', err);
      toast({
        title: "Error",
        description: "Unable to update time slot availability. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteTimeSlot = async (slotId: number) => {
    if (!confirm('Are you sure you want to delete this time slot?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(buildApiUrl(`/api/admin/available-time-slots/${slotId}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete time slot');
      }

      // Refresh slots
      fetchTimeSlots();
      
      toast({
        title: "Success",
        description: "Time slot deleted successfully!",
      });
    } catch (err) {
      console.error('Error deleting time slot:', err);
      toast({
        title: "Error",
        description: "Unable to delete time slot. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchServiceCategories();
    fetchAvailableDates();
  }, []);

  // Helper functions for date selection
  const handleDateToggle = (dateId: string) => {
    setSelectedDatesForBulk(prev => 
      prev.includes(dateId) 
        ? prev.filter(id => id !== dateId)
        : [...prev, dateId]
    );
  };

  const handleSelectAllDates = () => {
    setSelectedDatesForBulk(filteredDates.map(d => d.date));
  };

  const handleDeselectAllDates = () => {
    setSelectedDatesForBulk([]);
  };

  useEffect(() => {
    // When selected category changes, filter the dates
    filterDatesByCategory(availableDates, selectedCategory);
  }, [selectedCategory, availableDates]);

  useEffect(() => {
    // When application mode changes, reset date selection
    if (applicationMode === 'all') {
      setSelectedDatesForBulk(filteredDates.map(d => d.date));
    } else {
      setSelectedDatesForBulk([]);
    }
    // Close date picker when mode changes
    setShowDatePicker(false);
  }, [applicationMode, filteredDates]);

  useEffect(() => {
    // whenever selectedDate or selectedCategory changes, re-fetch time slots
    if (selectedDate) {
      fetchTimeSlots();
    }
  }, [selectedDate, selectedCategory]);

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const validateTimeSlot = () => {
    if (!newSlot.start_time || !newSlot.end_time) {
      return false;
    }
    
    const startTime = new Date(`1970-01-01T${newSlot.start_time}`);
    const endTime = new Date(`1970-01-01T${newSlot.end_time}`);
    
    return endTime > startTime;
  };

  if (loading) {
    return (
      <NewAdminLayout title="Time Slots" subtitle="Manage appointment time slots">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading time slots...</span>
        </div>
      </NewAdminLayout>
    );
  }

  if (error) {
    return (
      <NewAdminLayout title="Time Slots" subtitle="Manage appointment time slots">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <Button onClick={fetchTimeSlots} className="mt-2">
            Try Again
          </Button>
        </div>
      </NewAdminLayout>
    );
  }

  return (
    <NewAdminLayout title="Time Slots" subtitle="Manage appointment time slots">
      <div className="space-y-6">
        {/* Combined Step 1 & 2: Category & Date Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Select Category & Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Category
                </label>
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {serviceCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Date
                </label>
                {filteredDates.length === 0 ? (
                  <div className="text-sm text-gray-500 py-2">
                    No dates available for selected category
                  </div>
                ) : (
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {filteredDates.map((d) => (
                      <option key={d.id} value={d.date}>
                        {d.day_short}, {d.month_short} {d.day_number}, {d.year}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Add New Time Slot Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Time Slots
                {selectedDate && (
                  <span className="text-sm font-normal text-gray-500">
                    for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
              </span>
              <Button
                onClick={() => setIsAddingSlot(!isAddingSlot)}
                variant={isAddingSlot ? "outline" : "default"}
                disabled={applicationMode === 'single' ? !selectedDate : filteredDates.length === 0}
              >
                {isAddingSlot ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                {isAddingSlot ? 'Cancel' : 'Add Time Slot'}
              </Button>
            </CardTitle>
          </CardHeader>
          {isAddingSlot && (
            <CardContent>
              {/* Application Mode Selection */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Time Slot Application</h4>
                  <div className="flex bg-white rounded-lg border border-gray-300 p-1">
                    <button
                      type="button"
                      onClick={() => setApplicationMode('all')}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        applicationMode === 'all'
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Select Dates ({applicationMode === 'all' ? selectedDatesForBulk.length : filteredDates.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setApplicationMode('single')}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        applicationMode === 'single'
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Single Date
                    </button>
                  </div>
                </div>
                
                <div className="text-sm text-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <strong>🏷️ Category:</strong> {selectedCategory ? 
                        serviceCategories.find(c => c.id === selectedCategory)?.name : 
                        'All Categories (General)'
                      }
                    </div>
                    <div>
                      <strong>📅 Target:</strong> {
                        applicationMode === 'all' 
                          ? `${selectedDatesForBulk.length} selected dates (${filteredDates.length} available)`
                          : selectedDate 
                            ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
                            : 'No date selected'
                      }
                    </div>
                  </div>
                  
                  {applicationMode === 'all' && filteredDates.length > 0 && (
                    <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-blue-800 text-sm font-medium">Selected dates for time slot application:</p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleSelectAllDates}
                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                          >
                            Select All ({filteredDates.length})
                          </button>
                          <button
                            type="button"
                            onClick={handleDeselectAllDates}
                            className="text-xs text-red-600 hover:text-red-800 underline"
                          >
                            Clear All
                          </button>
                        </div>
                      </div>
                      
                      {/* Selected Dates as Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {selectedDatesForBulk.map((dateId) => {
                          const dateObj = filteredDates.find(d => d.date === dateId);
                          if (!dateObj) return null;
                          
                          return (
                            <div
                              key={dateObj.id}
                              className="inline-flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                            >
                              <span>{dateObj.day_short} {dateObj.month_short} {dateObj.day_number}</span>
                              <button
                                type="button"
                                onClick={() => handleDateToggle(dateObj.date)}
                                className="hover:bg-blue-600 rounded-full p-0.5 transition-colors ml-1"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })}
                        
                        {/* Add Date Button */}
                        {selectedDatesForBulk.length < filteredDates.length && (
                          <button
                            type="button"
                            onClick={() => setShowDatePicker(!showDatePicker)}
                            className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors border-2 border-dashed border-gray-400"
                          >
                            <Plus className="w-3 h-3" />
                            Add Date
                          </button>
                        )}
                      </div>
                      
                      {/* Available Dates Dropdown */}
                      {showDatePicker && (
                        <div className="mb-3 p-2 bg-white rounded border border-gray-300 shadow-sm">
                          <p className="text-xs text-gray-600 mb-2">Available dates to add:</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-32 overflow-y-auto">
                            {filteredDates
                              .filter(date => !selectedDatesForBulk.includes(date.date))
                              .map((date) => (
                                <button
                                  key={date.id}
                                  type="button"
                                  onClick={() => {
                                    handleDateToggle(date.date);
                                    // Auto-close if all dates are selected
                                    if (selectedDatesForBulk.length + 1 >= filteredDates.length) {
                                      setShowDatePicker(false);
                                    }
                                  }}
                                  className="flex items-center justify-center p-2 bg-gray-50 hover:bg-blue-100 border border-gray-200 hover:border-blue-300 rounded text-xs font-medium text-gray-700 hover:text-blue-700 transition-colors"
                                >
                                  {date.day_short} {date.month_short} {date.day_number}
                                </button>
                              ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="pt-2 border-t border-blue-200">
                        <p className="text-xs text-blue-700">
                          <strong>{selectedDatesForBulk.length}</strong> of <strong>{filteredDates.length}</strong> dates selected
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={newSlot.start_time}
                    onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={newSlot.end_time}
                    onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available
                  </label>
                  <select
                    value={newSlot.is_available.toString()}
                    onChange={(e) => setNewSlot({ ...newSlot, is_available: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Extra Price (AED)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newSlot.extra_price}
                    onChange={(e) => setNewSlot({ ...newSlot, extra_price: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional additional charge</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button 
                  onClick={addTimeSlot} 
                  disabled={
                    !validateTimeSlot() || 
                    isApplyingBulk ||
                    (applicationMode === 'single' && !selectedDate) ||
                    (applicationMode === 'all' && selectedDatesForBulk.length === 0)
                  }
                >
                  {isApplyingBulk ? (
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  {applicationMode === 'all' 
                    ? `Apply to ${selectedDatesForBulk.length} Selected Dates`
                    : 'Add to Selected Date'
                  }
                </Button>
                
                {!validateTimeSlot() && newSlot.start_time && newSlot.end_time && (
                  <p className="text-sm text-red-500 self-center">End time must be after start time</p>
                )}
                
                {applicationMode === 'single' && !selectedDate && validateTimeSlot() && (
                  <p className="text-sm text-orange-500 self-center">Please select a date</p>
                )}
                
                {applicationMode === 'all' && selectedDatesForBulk.length === 0 && (
                  <p className="text-sm text-orange-500 self-center">
                    {filteredDates.length === 0 
                      ? 'No dates available in this category' 
                      : 'Please select at least one date'
                    }
                  </p>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Edit Time Slot Section */}
        {isEditingSlot && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Edit Time Slot
                </span>
                <Button
                  onClick={cancelEdit}
                  variant="outline"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel Edit
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={editSlot.start_time}
                    onChange={(e) => setEditSlot({ ...editSlot, start_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={editSlot.end_time}
                    onChange={(e) => setEditSlot({ ...editSlot, end_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available
                  </label>
                  <select
                    value={editSlot.is_available.toString()}
                    onChange={(e) => setEditSlot({ ...editSlot, is_available: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Extra Price (AED)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editSlot.extra_price}
                    onChange={(e) => setEditSlot({ ...editSlot, extra_price: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional additional charge</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button onClick={updateTimeSlot} disabled={!validateTimeSlot()}>
                  <Check className="w-4 h-4 mr-2" />
                  Update Time Slot
                </Button>
                {!validateTimeSlot() && editSlot.start_time && editSlot.end_time && (
                  <p className="text-sm text-red-500 self-center">End time must be after start time</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Time Slots List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Time Slots ({timeSlots.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {timeSlots.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No time slots found.</p>
                <p className="text-sm text-gray-400">Select a category and date above to add time slots.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {timeSlots
                  .sort((a, b) => a.start_time.localeCompare(b.start_time))
                  .map((slot) => (
                    <div
                      key={slot.id}
                      className={`border rounded-lg p-4 ${
                        slot.is_available 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-yellow-50 border-yellow-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            slot.is_available 
                              ? 'bg-green-200 text-green-800' 
                              : 'bg-yellow-200 text-yellow-800'
                          }`}>
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {Math.floor((new Date(`1970-01-01T${slot.end_time}`).getTime() - new Date(`1970-01-01T${slot.start_time}`).getTime()) / (1000 * 60))} minutes
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteTimeSlot(slot.id)}
                            className="p-2 bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Status:</span>
                          <span className={`font-medium ${
                            slot.is_available ? 'text-green-700' : 'text-yellow-700'
                          }`}>
                            {slot.is_available ? 'Available' : 'Disabled'}
                          </span>
                        </div>
                        {slot.extra_price && slot.extra_price > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Extra Price:</span>
                            <span className="font-medium text-orange-600">
                              +{slot.extra_price} AED
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium text-blue-600">
                            {slot.service_category_name || 'All Categories'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Added:</span>
                          <span className="text-gray-600">
                            {new Date(slot.created_at).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </NewAdminLayout>
  );
};

export default AdminTimeSlots;
