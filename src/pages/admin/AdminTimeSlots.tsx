import React, { useState, useEffect } from 'react';
import { buildApiUrl } from "@/config/api";
import NewAdminLayout from './NewAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Plus, Edit, Trash2, Check, X } from 'lucide-react';

interface TimeSlotData {
  id: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  extra_price?: number; // Extra price in AED
  created_at: string;
  date?: string; // ISO date (YYYY-MM-DD) - optional if backend provides it
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
}

const AdminTimeSlots: React.FC = () => {
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
    extra_price: 0
  });
  const [editSlot, setEditSlot] = useState({
    start_time: '',
    end_time: '',
    is_available: true,
    extra_price: 0
  });
  const [availableDates, setAvailableDates] = useState<AvailableDateOption[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(''); // YYYY-MM-DD

  const fetchTimeSlots = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required');
        return;
      }

      // If a date is selected, pass it as a query parameter to fetch slots for that date
      const url = buildApiUrl('/api/admin/available-time-slots') + (selectedDate ? `?date=${selectedDate}` : '');
      console.log('🔍 Fetching time slots from URL:', url);
      console.log('🔍 Selected date:', selectedDate);
      
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

  const fetchAvailableDates = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(buildApiUrl('/api/admin/available-dates'), {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!res.ok) return;
      const data = await res.json();

      console.log('🔍 Raw data from backend:', data);

      // Simply use dates as they come from database
      const normalized = Array.isArray(data) ? data : [];

      console.log('🔍 Normalized data:', normalized);
      console.log('🔍 Sample date value:', normalized[0]?.date);
      console.log('🔍 Type of date:', typeof normalized[0]?.date);

      setAvailableDates(normalized);
      // default to first available date if none selected
      if (!selectedDate && normalized.length > 0) {
        console.log('🔍 Setting selected date to:', normalized[0].date);
        setSelectedDate(normalized[0].date);
      }
    } catch (err) {
      console.error('Failed to fetch available dates', err);
    }
  };

  const addTimeSlot = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!selectedDate) {
        alert('Please select a date before adding a time slot');
        return;
      }

      const response = await fetch(buildApiUrl('/api/admin/available-time-slots'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...newSlot, date: selectedDate }) // Use selected date directly
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add time slot');
      }

      // Reset form and refresh slots
      setNewSlot({ start_time: '', end_time: '', is_available: true, extra_price: 0 });
      setIsAddingSlot(false);
      fetchTimeSlots();
    } catch (err) {
      console.error('Error adding time slot:', err);
      alert(err instanceof Error ? err.message : 'Failed to add time slot');
    }
  };

  const editTimeSlot = (slot: TimeSlotData) => {
    setEditingSlotId(slot.id);
    setEditSlot({
      start_time: slot.start_time,
      end_time: slot.end_time,
      is_available: slot.is_available,
      extra_price: slot.extra_price || 0
    });
    setIsEditingSlot(true);
    setIsAddingSlot(false);
  };

  const updateTimeSlot = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!editingSlotId) return;

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
      setEditSlot({ start_time: '', end_time: '', is_available: true, extra_price: 0 });
      setIsEditingSlot(false);
      fetchTimeSlots();
    } catch (err) {
      console.error('Error updating time slot:', err);
      alert('Failed to update time slot');
    }
  };

  const cancelEdit = () => {
    setEditingSlotId(null);
    setEditSlot({ start_time: '', end_time: '', is_available: true, extra_price: 0 });
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
    } catch (err) {
      console.error('Error updating time slot:', err);
      alert('Failed to update time slot availability');
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
    } catch (err) {
      console.error('Error deleting time slot:', err);
      alert('Failed to delete time slot');
    }
  };

  useEffect(() => {
    fetchAvailableDates();
    // fetch time slots for initial selectedDate (if set) when component mounts or when selectedDate changes
    // fetchTimeSlots will be called by the effect watching selectedDate below
  }, []);

  useEffect(() => {
    // whenever selectedDate changes, re-fetch time slots for that date
    fetchTimeSlots();
  }, [selectedDate]);

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
        {/* Date filter / selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Select Date
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {availableDates.length === 0 ? (
              <div className="text-sm text-gray-600">No available dates configured. Please add dates on the Available Dates page first.</div>
            ) : (
              <div className="flex items-center gap-3">
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {availableDates.map((d) => (
                    <option key={d.id} value={d.date}>
                      {d.day_short}, {d.month_short} {d.day_number}, {d.year}
                    </option>
                  ))}
                </select>
                <div className="text-sm text-gray-500">Showing time slots for the selected date.</div>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Add New Time Slot Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Add New Time Slot
              </span>
              <Button
                onClick={() => setIsAddingSlot(!isAddingSlot)}
                variant={isAddingSlot ? "outline" : "default"}
              >
                {isAddingSlot ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                {isAddingSlot ? 'Cancel' : 'Add Slot'}
              </Button>
            </CardTitle>
          </CardHeader>
          {isAddingSlot && (
            <CardContent>
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
                  <p className="text-xs text-gray-500 mt-1">Additional charge for this time slot (optional)</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button onClick={addTimeSlot} disabled={!validateTimeSlot()}>
                  <Check className="w-4 h-4 mr-2" />
                  Add Time Slot
                </Button>
                {!validateTimeSlot() && newSlot.start_time && newSlot.end_time && (
                  <p className="text-sm text-red-500 self-center">End time must be after start time</p>
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
                  <p className="text-xs text-gray-500 mt-1">Additional charge for this time slot (optional)</p>
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
                <p className="text-gray-500">No time slots configured.</p>
                <p className="text-sm text-gray-400">Add some time slots to allow customer bookings.</p>
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
                            onClick={() => updateSlotAvailability(slot.id, !slot.is_available)}
                            className={`p-2 ${
                              slot.is_available 
                                ? 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100' 
                                : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                            }`}
                          >
                            {slot.is_available ? <X className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => editTimeSlot(slot)}
                            className="p-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
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
