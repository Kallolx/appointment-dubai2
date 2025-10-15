import React, { useState, useEffect } from 'react';
import { buildApiUrl } from "@/config/api";
import NewAdminLayout from './NewAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, TrendingUp, Users, Clock, DollarSign, FileText, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

interface ReportData {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  pendingAppointments: number;
  totalRevenue: number;
  totalUsers: number;
  averageServiceTime: number;
  popularServices: { service: string; count: number }[];
  monthlyStats: { month: string; appointments: number; revenue: number }[];
}

const AdminReports: React.FC = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData>({
    totalAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    pendingAppointments: 0,
    totalRevenue: 0,
    totalUsers: 0,
    averageServiceTime: 0,
    popularServices: [],
    monthlyStats: []
  });
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [reportType, setReportType] = useState('overview');

  const AEDIcon = ({
  className = "inline-block w-4 h-4 mr-2",
}: {
  className?: string;
}) => <img src="/aed.svg" alt="AED" className={className} />;

  useEffect(() => {
    fetchReportData();
  }, [selectedPeriod, reportType]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      if (!token) {
        return;
      }

      // Fetch appointments
      const appointmentsResponse = await axios.get(buildApiUrl('/api/admin/appointments'), {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch users
      const usersResponse = await axios.get(buildApiUrl('/api/admin/users'), {
        headers: { Authorization: `Bearer ${token}` }
      });

      const appointments = appointmentsResponse.data;
      const users = usersResponse.data;

      // Filter appointments based on selected period
      const now = new Date();
      let filteredAppointments = appointments;
      
      if (selectedPeriod === '7days') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredAppointments = appointments.filter((apt: any) => 
          new Date(apt.appointment_date) >= weekAgo
        );
      } else if (selectedPeriod === '30days') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filteredAppointments = appointments.filter((apt: any) => 
          new Date(apt.appointment_date) >= monthAgo
        );
      } else if (selectedPeriod === '90days') {
        const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        filteredAppointments = appointments.filter((apt: any) => 
          new Date(apt.appointment_date) >= threeMonthsAgo
        );
      }

      // Calculate statistics
      const completedAppointments = filteredAppointments.filter((apt: any) => apt.status === 'completed');
      const cancelledAppointments = filteredAppointments.filter((apt: any) => apt.status === 'cancelled');
      const pendingAppointments = filteredAppointments.filter((apt: any) => apt.status === 'pending');

      const totalRevenue = completedAppointments.reduce((sum: number, apt: any) => 
        sum + parseFloat(apt.price || 0), 0
      );

      // Calculate popular services
      const serviceCount: { [key: string]: number } = {};
      filteredAppointments.forEach((apt: any) => {
        serviceCount[apt.service] = (serviceCount[apt.service] || 0) + 1;
      });

      const popularServices = Object.entries(serviceCount)
        .map(([service, count]) => ({ service, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Calculate monthly stats for last 6 months
      const monthlyStats = [];
      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
        const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
        
        const monthAppointments = appointments.filter((apt: any) => {
          const aptDate = new Date(apt.appointment_date);
          return aptDate >= monthStart && aptDate <= monthEnd;
        });

        const monthRevenue = monthAppointments
          .filter((apt: any) => apt.status === 'completed')
          .reduce((sum: number, apt: any) => sum + parseFloat(apt.price || 0), 0);

        monthlyStats.push({
          month: monthDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          appointments: monthAppointments.length,
          revenue: monthRevenue
        });
      }

      setReportData({
        totalAppointments: filteredAppointments.length,
        completedAppointments: completedAppointments.length,
        cancelledAppointments: cancelledAppointments.length,
        pendingAppointments: pendingAppointments.length,
        totalRevenue,
        totalUsers: users.length,
        averageServiceTime: 90, // This would need to be calculated based on actual service durations
        popularServices,
        monthlyStats
      });

    } catch (error) {
      console.error('Error fetching report data:', error);
      toast({
        title: "Error",
        description: "Failed to load report data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    const csvContent = generateCSVReport();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateCSVReport = () => {
    let content = 'Report Type,Period,Generated Date\n';
    content += `${reportType},${selectedPeriod},${new Date().toISOString()}\n\n`;
    
    content += 'Metric,Value\n';
    content += `Total Appointments,${reportData.totalAppointments}\n`;
    content += `Completed Appointments,${reportData.completedAppointments}\n`;
    content += `Cancelled Appointments,${reportData.cancelledAppointments}\n`;
    content += `Pending Appointments,${reportData.pendingAppointments}\n`;
    content += `Total Revenue,$${reportData.totalRevenue.toFixed(2)}\n`;
    content += `Total Users,${reportData.totalUsers}\n`;
    content += `Average Service Time,${reportData.averageServiceTime} minutes\n\n`;
    
    content += 'Popular Services\n';
    content += 'Service,Count\n';
    reportData.popularServices.forEach(service => {
      content += `${service.service},${service.count}\n`;
    });
    
    content += '\nMonthly Statistics\n';
    content += 'Month,Appointments,Revenue\n';
    reportData.monthlyStats.forEach(stat => {
      content += `${stat.month},${stat.appointments},$${stat.revenue.toFixed(2)}\n`;
    });
    
    return content;
  };

  const completionRate = reportData.totalAppointments > 0 
    ? (reportData.completedAppointments / reportData.totalAppointments * 100).toFixed(1)
    : '0';

  const cancellationRate = reportData.totalAppointments > 0 
    ? (reportData.cancelledAppointments / reportData.totalAppointments * 100).toFixed(1)
    : '0';

  return (
    <NewAdminLayout 
      title="Reports & Analytics"
      subtitle="View detailed reports and analytics for your business"
    >
      <div className="space-y-6">
        {/* Report Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>

            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Overview</SelectItem>
                <SelectItem value="appointments">Appointments</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="users">Users</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={exportReport} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading report data...</span>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.totalAppointments}</div>
                  <p className="text-xs text-muted-foreground">
                    {completionRate}% completion rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                   <AEDIcon className="inline-block w-4 h-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    From completed appointments
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    Registered customers
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Service Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.averageServiceTime}min</div>
                  <p className="text-xs text-muted-foreground">
                    Per appointment
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Status Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Appointment Status Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Completed</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${completionRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{reportData.completedAppointments}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Pending</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full" 
                            style={{ width: `${reportData.totalAppointments > 0 ? (reportData.pendingAppointments / reportData.totalAppointments * 100) : 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{reportData.pendingAppointments}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Cancelled</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ width: `${cancellationRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{reportData.cancelledAppointments}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Popular Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reportData.popularServices.map((service, index) => (
                      <div key={service.service} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{service.service}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ 
                                width: `${reportData.popularServices[0] ? (service.count / reportData.popularServices[0].count * 100) : 0}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{service.count}</span>
                        </div>
                      </div>
                    ))}
                    {reportData.popularServices.length === 0 && (
                      <p className="text-gray-500 text-sm">No service data available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Monthly Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">
                        {reportData.monthlyStats.reduce((sum, stat) => sum + stat.appointments, 0)}
                      </p>
                      <p className="text-sm text-gray-600">Total Appointments (6 months)</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        ${reportData.monthlyStats.reduce((sum, stat) => sum + stat.revenue, 0).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">Total Revenue (6 months)</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">
                        {reportData.monthlyStats.length > 0 ? 
                          (reportData.monthlyStats.reduce((sum, stat) => sum + stat.appointments, 0) / reportData.monthlyStats.length).toFixed(1) 
                          : '0'}
                      </p>
                      <p className="text-sm text-gray-600">Avg Appointments/Month</p>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Month</th>
                          <th className="text-right py-2">Appointments</th>
                          <th className="text-right py-2">Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.monthlyStats.map((stat, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2">{stat.month}</td>
                            <td className="text-right py-2">{stat.appointments}</td>
                            <td className="text-right py-2">${stat.revenue.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </NewAdminLayout>
  );
};

export default AdminReports;
