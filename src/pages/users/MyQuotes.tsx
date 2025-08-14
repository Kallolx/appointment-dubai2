import React from 'react';
import NewUserLayout from './NewUserLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus, Clock, CheckCircle } from 'lucide-react';

const MyQuotes: React.FC = () => {
  // Placeholder data
  const quotes = [
    {
      id: 1,
      service: "Deep Cleaning",
      status: "pending",
      amount: "450.00",
      date: "2025-08-10",
      validUntil: "2025-08-20"
    },
    {
      id: 2,
      service: "AC Maintenance",
      status: "approved",
      amount: "200.00",
      date: "2025-08-08",
      validUntil: "2025-08-18"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Pending</span>;
      case 'approved':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Approved</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Rejected</span>;
      default:
        return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">{status}</span>;
    }
  };

  return (
    <NewUserLayout
      title="My Quotes"
      subtitle="View and manage your service quotes"
    >
      <div className="space-y-6">
        {/* Header with Action */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Service Quotes</h2>
            <p className="text-gray-600">Track your quote requests and responses</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Request Quote
          </button>
        </div>

        {/* Quotes List */}
        <div className="space-y-4">
          {quotes.map((quote) => (
            <Card key={quote.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">{quote.service}</h3>
                      {getStatusBadge(quote.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Quote Date:</span> {quote.date}
                      </div>
                      <div>
                        <span className="font-medium">Valid Until:</span> {quote.validUntil}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      AED {quote.amount}
                    </div>
                    
                    {quote.status === 'approved' && (
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                        Book Now
                      </button>
                    )}
                    
                    {quote.status === 'pending' && (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Waiting for response</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {quotes.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No quotes yet</h3>
              <p className="text-gray-600 mb-6">Request your first service quote to get started</p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Request Quote
              </button>
            </CardContent>
          </Card>
        )}
      </div>
    </NewUserLayout>
  );
};

export default MyQuotes;
