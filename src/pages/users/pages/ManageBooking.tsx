import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, CreditCard, X, Phone } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import StepTwo from "../../../components/website/Steps/StepTwo";
import StepThree from "../../../components/website/Steps/StepThree";
import StepFour from "../../../components/website/Steps/StepFour";
import  Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";

interface OrderData {
  id: number;
  service: string;
  appointment_date: string;
  appointment_time: string;
  location: string;
  price: number | string;
  status: string;
  notes?: string;
  created_at: string;
}

const ManageBooking: React.FC = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const location = useLocation();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'date' | 'address' | 'payment' | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState({ date: '', time: '' });
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const order = location.state?.orderData;
    if (order) {
      setOrderData(order);
      // Initialize form data with existing booking details
      setSelectedDateTime({
        date: order.appointment_date,
        time: order.appointment_time
      });
      try {
        setSelectedAddress(JSON.parse(order.location));
      } catch (e) {
        setSelectedAddress(null);
      }
    } else {
      navigate('/user/bookings');
    }
  }, [location.state, navigate]);

  const handleOptionClick = (type: 'date' | 'address' | 'payment') => {
    setModalType(type);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setModalType(null);
  };

  const handleConfirm = () => {
    // Here you would save the changes to the backend
    console.log('Saving changes...', {
      bookingId,
      selectedDateTime,
      selectedAddress,
      modalType
    });
    setShowModal(false);
    setModalType(null);
    // Show success message
  };

  const handleCancelBooking = () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      // Handle cancellation logic
      console.log('Cancelling booking...', bookingId);
      navigate('/user/bookings');
    }
  };

  const handleContactSupport = () => {
    navigate('/support');
  };

  if (!orderData) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-2xl mx-auto px-4">
            <div className="flex justify-center items-center h-40">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading booking details...</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const managementOptions = [
    {
      id: 'date',
      title: 'Change booking date or time',
      icon: Calendar,
      onClick: () => handleOptionClick('date')
    },
    {
      id: 'address',
      title: 'Change the address',
      icon: MapPin,
      onClick: () => handleOptionClick('address')
    },
    {
      id: 'payment',
      title: 'Change the payment method',
      icon: CreditCard,
      onClick: () => handleOptionClick('payment')
    },
    {
      id: 'cancel',
      title: 'Cancel the booking',
      icon: X,
      onClick: handleCancelBooking,
      className: 'text-red-600 hover:bg-red-50'
    },
    {
      id: 'support',
      title: 'Contact Customer Support',
      icon: Phone,
      onClick: handleContactSupport
    }
  ];

  const renderModalContent = () => {
    switch (modalType) {
      case 'date':
        return (
          <StepThree 
            onSelectionChange={(data) => {
              setSelectedDateTime({
                date: data.date || '',
                time: data.time || ''
              });
            }}
          />
        );
      case 'address':
        return (
          <StepTwo
            handleAddItemsClick={() => {}}
            handleRemoveItemClick={() => {}}
            cartItems={[]}
            onSelectionChange={(data) => {
              setSelectedAddress(data.address);
            }}
          />
        );
      case 'payment':
        return (
          <StepFour
            cartItems={[{
              service: { 
                id: 1, 
                name: orderData.service, 
                price: typeof orderData.price === 'string' ? parseFloat(orderData.price) : orderData.price 
              },
              count: 1
            }]}
            selectedDateTime={selectedDateTime}
            subtotal={typeof orderData.price === 'string' ? parseFloat(orderData.price) : orderData.price}
            selectedAddress={selectedAddress}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          {/* Back Button */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Manage Booking</h1>
          </div>

          <div className="space-y-4">
            {managementOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={option.onClick}
                  className={`w-full p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 ${
                    option.className || 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <span className="text-left font-medium text-gray-900">
                        {option.title}
                      </span>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-gray-400 transform rotate-180" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />

      {/* Modal for editing options */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modalType === 'date' && 'Change Date & Time'}
              {modalType === 'address' && 'Change Address'}
              {modalType === 'payment' && 'Change Payment Method'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            {renderModalContent()}
          </div>
          
          {modalType !== 'payment' && (
            <div className="flex gap-3 mt-6 pt-4 border-t">
              <button
                onClick={handleModalClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                CONFIRM
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageBooking;
