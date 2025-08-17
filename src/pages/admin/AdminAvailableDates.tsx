import React, { useState, useEffect } from 'react';
import { buildApiUrl } from "@/config/api";
import NewAdminLayout from './NewAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Edit, Trash2, Check, X } from 'lucide-react';

interface AvailableDateData {
  id: number;
  date: string;
  is_available: boolean;
  max_appointments: number;
  created_at: string;
}

const AdminAvailableDates: React.FC = () => {
  const [dates, setDates] = useState<AvailableDateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddingDate, setIsAddingDate] = useState(false);
  const [newDate, setNewDate] = useState({
    date: '',
    is_available: true,
    max_appointments: 10
  });

  const fetchAvailableDates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch(buildApiUrl('/api/admin/available-dates'), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch available dates');
      }

      const data = await response.json();
      setDates(data);
    } catch (err) {
      console.error('Error fetching available dates:', err);
      setError('Failed to load available dates');
    } finally {
      setLoading(false);
    }
  };

  const addAvailableDate = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(buildApiUrl('/api/admin/available-dates'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newDate)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add date');
      }

      // Reset form and refresh dates
      setNewDate({ date: '', is_available: true, max_appointments: 10 });
      setIsAddingDate(false);
      fetchAvailableDates();
    } catch (err) {
      console.error('Error adding date:', err);
      alert(err instanceof Error ? err.message : 'Failed to add date');
    }
  };

  const updateDateAvailability = async (dateId: number, isAvailable: boolean) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:3001/api/admin/available-dates/${dateId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_available: isAvailable })
      });

      if (!response.ok) {
        throw new Error('Failed to update date availability');
      }

      // Refresh dates
      fetchAvailableDates();
    } catch (err) {
      console.error('Error updating date:', err);
      alert('Failed to update date availability');
    }
  };

  const deleteDate = async (dateId: number) => {
    if (!confirm('Are you sure you want to delete this date?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:3001/api/admin/available-dates/${dateId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete date');
      }

      // Refresh dates
      fetchAvailableDates();
    } catch (err) {
      console.error('Error deleting date:', err);
      alert('Failed to delete date');
    }
  };

  useEffect(() => {
    fetchAvailableDates();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDayName = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { weekday: 'short' });
  };

  const isDatePast = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  if (loading) {
    return (
      <NewAdminLayout title="Available Dates" subtitle="Manage appointment availability">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading available dates...</span>
        </div>
      </NewAdminLayout>
    );
  }

  if (error) {
    return (
      <NewAdminLayout title="Available Dates" subtitle="Manage appointment availability">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <Button onClick={fetchAvailableDates} className="mt-2">
            Try Again
          </Button>
        </div>
      </NewAdminLayout>
    );
  }

  return (
    <NewAdminLayout title="Available Dates" subtitle="Manage appointment availability">
      <div className="space-y-6">
        {/* Add New Date Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Add New Available Date
              </span>
              <Button
                onClick={() => setIsAddingDate(!isAddingDate)}
                variant={isAddingDate ? "outline" : "default"}
              >
                {isAddingDate ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                {isAddingDate ? 'Cancel' : 'Add Date'}
              </Button>
            </CardTitle>
          </CardHeader>
          {isAddingDate && (
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newDate.date}
                    onChange={(e) => setNewDate({ ...newDate, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Appointments
                  </label>
                  <input
                    type="number"
                    value={newDate.max_appointments}
                    onChange={(e) => setNewDate({ ...newDate, max_appointments: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available
                  </label>
                  <select
                    value={newDate.is_available.toString()}
                    onChange={(e) => setNewDate({ ...newDate, is_available: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button onClick={addAvailableDate} disabled={!newDate.date}>
                  <Check className="w-4 h-4 mr-2" />
                  Add Date
                </Button>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Available Dates List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Available Dates ({dates.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dates.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No available dates configured.</p>
                <p className="text-sm text-gray-400">Add some dates to allow customer bookings.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dates.map((dateItem) => (
                  <div
                    key={dateItem.id}
                    className={`border rounded-lg p-4 ${
                      isDatePast(dateItem.date) 
                        ? 'bg-gray-50 border-gray-200' 
                        : dateItem.is_available 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                          isDatePast(dateItem.date) 
                            ? 'bg-gray-200 text-gray-600' 
                            : dateItem.is_available 
                              ? 'bg-green-200 text-green-800' 
                              : 'bg-yellow-200 text-yellow-800'
                        }`}>
                          {getDayName(dateItem.date)}
                        </div>
                        <div>
                          <p className={`font-medium ${
                            isDatePast(dateItem.date) ? 'text-gray-600' : 'text-gray-900'
                          }`}>
                            {new Date(dateItem.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                          <p className={`text-xs ${
                            isDatePast(dateItem.date) ? 'text-gray-500' : 'text-gray-600'
                          }`}>
                            {new Date(dateItem.date).getFullYear()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        {!isDatePast(dateItem.date) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateDateAvailability(dateItem.id, !dateItem.is_available)}
                            className={`p-2 ${
                              dateItem.is_available 
                                ? 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100' 
                                : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                            }`}
                          >
                            {dateItem.is_available ? <X className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteDate(dateItem.id)}
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
                          isDatePast(dateItem.date) 
                            ? 'text-gray-600' 
                            : dateItem.is_available 
                              ? 'text-green-700' 
                              : 'text-yellow-700'
                        }`}>
                          {isDatePast(dateItem.date) 
                            ? 'Past' 
                            : dateItem.is_available 
                              ? 'Available' 
                              : 'Disabled'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Max Appointments:</span>
                        <span className="font-medium text-gray-900">{dateItem.max_appointments}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Added:</span>
                        <span className="text-gray-600">
                          {new Date(dateItem.created_at).toLocaleDateString('en-US', { 
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

export default AdminAvailableDates;
