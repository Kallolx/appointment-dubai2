import React from 'react';
import NewUserLayout from './NewUserLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, MapPin, CreditCard, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const NewUserDashboard: React.FC = () => {
  const { user } = useAuth();

  const quickStats = [
    {
      title: "Total Bookings",
      value: "12",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Active Quotes",
      value: "3",
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Saved Locations",
      value: "5",
      icon: MapPin,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Payment Methods",
      value: "2",
      icon: CreditCard,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const recentActivity = [
    {
      title: "General Cleaning completed",
      time: "2 hours ago",
      status: "completed",
      icon: CheckCircle
    },
    {
      title: "AC Cleaning scheduled",
      time: "1 day ago", 
      status: "scheduled",
      icon: Clock
    },
    {
      title: "Deep Cleaning quote received",
      time: "3 days ago",
      status: "pending",
      icon: FileText
    }
  ];

  return (
    <NewUserLayout 
      title={`Welcome back, ${user?.fullName || 'User'}!`}
      subtitle="Manage your bookings and account from here"
    >
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                    <div className={`p-2 rounded-full ${
                      activity.status === 'completed' ? 'bg-green-50' :
                      activity.status === 'scheduled' ? 'bg-blue-50' : 'bg-yellow-50'
                    }`}>
                      <Icon className={`w-4 h-4 ${
                        activity.status === 'completed' ? 'text-green-600' :
                        activity.status === 'scheduled' ? 'text-blue-600' : 'text-yellow-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 text-left rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <Calendar className="w-6 h-6 text-blue-600 mb-2" />
                <h3 className="font-medium text-gray-900">Book New Service</h3>
                <p className="text-sm text-gray-600">Schedule a new appointment</p>
              </button>
              
              <button className="p-4 text-left rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors">
                <FileText className="w-6 h-6 text-green-600 mb-2" />
                <h3 className="font-medium text-gray-900">Request Quote</h3>
                <p className="text-sm text-gray-600">Get pricing for services</p>
              </button>
              
              <button className="p-4 text-left rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors">
                <MapPin className="w-6 h-6 text-purple-600 mb-2" />
                <h3 className="font-medium text-gray-900">Add Location</h3>
                <p className="text-sm text-gray-600">Save a new address</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </NewUserLayout>
  );
};

export default NewUserDashboard;
