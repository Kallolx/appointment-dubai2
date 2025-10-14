import React from 'react';
import NewUserLayout from '../NewUserLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Building } from 'lucide-react';

export default function OutstandingPayments() {
  return (
    <NewUserLayout title="Outstanding Payments" subtitle="View and manage your outstanding payments">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="text-center p-8">
            <div className="mx-auto w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Building className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No outstanding payments found</h3>
            <p className="text-sm text-gray-600">You have no pending invoices or unpaid bookings at the moment.</p>
          </CardContent>
        </Card>
      </div>
    </NewUserLayout>
  );
}
