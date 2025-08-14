import React from 'react';
import NewUserLayout from './NewUserLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, AlertCircle, CreditCard } from 'lucide-react';

const OutstandingPayments: React.FC = () => {
  // Placeholder data
  const payments = [
    {
      id: 1,
      service: "General Cleaning",
      amount: "150.00",
      dueDate: "2025-08-20",
      status: "overdue",
      invoiceNumber: "INV-001"
    },
    {
      id: 2,
      service: "Pest Control",
      amount: "250.00",
      dueDate: "2025-08-25",
      status: "pending",
      invoiceNumber: "INV-002"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'overdue':
        return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Overdue</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Pending</span>;
      case 'paid':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Paid</span>;
      default:
        return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">{status}</span>;
    }
  };

  const totalOutstanding = payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

  return (
    <NewUserLayout
      title="Outstanding Payments"
      subtitle="Manage your pending payments and invoices"
    >
      <div className="space-y-6">
        {/* Summary Card */}
        <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Outstanding</h3>
                <p className="text-3xl font-bold text-red-600">AED {totalOutstanding.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payments List */}
        <div className="space-y-4">
          {payments.map((payment) => (
            <Card key={payment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <DollarSign className="w-5 h-5 text-red-600" />
                      <h3 className="text-lg font-semibold text-gray-900">{payment.service}</h3>
                      {getStatusBadge(payment.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Invoice:</span> {payment.invoiceNumber}
                      </div>
                      <div>
                        <span className="font-medium">Due Date:</span> {payment.dueDate}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      AED {payment.amount}
                    </div>
                    
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      <CreditCard className="w-4 h-4" />
                      Pay Now
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {payments.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No outstanding payments</h3>
              <p className="text-gray-600">All your payments are up to date!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </NewUserLayout>
  );
};

export default OutstandingPayments;
