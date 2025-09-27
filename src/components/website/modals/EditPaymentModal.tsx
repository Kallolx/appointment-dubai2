import React, { useState, useEffect } from "react";
import { X, CreditCard, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { buildApiUrl } from "@/config/api";

interface EditPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: any;
  onUpdate: (updatedData: any) => void;
}

const EditPaymentModal: React.FC<EditPaymentModalProps> = ({
  isOpen,
  onClose,
  orderData,
  onUpdate,
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const paymentMethods = [
    {
      id: "ziina",
      name: "Pay with Credit/Debit Card",
      icon: <CreditCard className="w-5 h-5 text-gray-700" />,
    },
    {
      id: "cash_on_delivery",
      name: "Cash on Delivery",
      icon: <DollarSign className="w-5 h-5 text-gray-700" />,
    },
  ];

  useEffect(() => {
    if (isOpen && orderData) {
      // Extract current payment method from orderData
      const currentPayment = getCurrentPaymentMethod();
      setSelectedPaymentMethod(currentPayment);
    }
  }, [isOpen, orderData]);

  const getCurrentPaymentMethod = () => {
    if (orderData?.payment_method) {
      const method = orderData.payment_method.toLowerCase();
      if (method.includes("cash on delivery")) return "cash_on_delivery";
      if (
        method.includes("ziina") ||
        method.includes("credit") ||
        method.includes("debit") ||
        method.includes("card")
      )
        return "ziina";
    }

    const notes = (orderData?.notes || "").toString().toLowerCase();
    if (notes.includes("cash on delivery")) return "cash_on_delivery";
    if (
      notes.includes("ziina") ||
      notes.includes("credit") ||
      notes.includes("debit") ||
      notes.includes("card")
    )
      return "ziina";

    return "ziina"; // default to credit/debit card
  };

  const formatPaymentMethodForApi = (method: string) => {
    switch (method) {
      case "cash_on_delivery":
        return "Cash on Delivery";
      case "ziina":
        return "Pay with Credit/Debit Card";
      default:
        return method;
    }
  };

  const calculateTotal = (method: string) => {
    const basePrice =
      typeof orderData.price === "string"
        ? parseFloat(orderData.price)
        : orderData.price;

    // Remove existing COD fee if present
    const isCOD = (orderData.notes || "")
      .toLowerCase()
      .includes("cash on delivery");
    const currentTotal = isCOD ? basePrice - 5 : basePrice;

    // Add new COD fee if Cash on Delivery is selected
    const newTotal =
      method === "cash_on_delivery" ? currentTotal + 5 : currentTotal;

    return newTotal.toFixed(2);
  };

  const handleZiinaPayment = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const newTotal = calculateTotal("ziina");

      // Create Ziina payment
      const paymentResponse = await fetch(
        buildApiUrl("/api/payments/ziina/create"),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: parseFloat(newTotal),
            currency: "AED",
            description: `Payment for Appointment #${orderData.id}`,
            order_id: `appointment_${orderData.id}_${Date.now()}`,
            customer_email: orderData.customer_email || "customer@example.com",
            customer_phone: orderData.customer_phone || "",
            return_url: `${window.location.origin}/booking-details/${orderData.id}?payment_success=true`,
            cancel_url: `${window.location.origin}/booking-details/${orderData.id}?payment_cancelled=true`,
          }),
        }
      );

      if (paymentResponse.ok) {
        const paymentData = await paymentResponse.json();

        if (paymentData.payment_url) {
          // Redirect to Ziina payment page
          window.location.href = paymentData.payment_url;
        } else {
          throw new Error("No payment URL received from Ziina");
        }
      } else {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.message || "Failed to create Ziina payment");
      }
    } catch (error) {
      console.error("Error creating Ziina payment:", error);
      toast({
        title: "Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedPaymentMethod) {
      toast({
        title: "Error",
        description: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }

    // If Ziina payment is selected, handle payment gateway flow
    if (selectedPaymentMethod === "ziina") {
      await handleZiinaPayment();
      return;
    }

    // Handle Cash on Delivery
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formattedPaymentMethod = formatPaymentMethodForApi(
        selectedPaymentMethod
      );
      const newTotal = calculateTotal(selectedPaymentMethod);

      // Update notes to reflect payment method
      const currentNotes = orderData.notes || "";
      let updatedNotes = currentNotes
        .replace(/Payment Method:\s*[^\.\n]+/gi, "") // Remove existing payment method
        .replace(/cash on delivery/gi, "") // Remove old COD references
        .trim();

      // Add new payment method info
      const paymentNote = `Payment Method: ${formattedPaymentMethod}`;
      updatedNotes = updatedNotes
        ? `${updatedNotes}. ${paymentNote}`
        : paymentNote;

      const response = await fetch(
        buildApiUrl(`/api/user/appointments/${orderData.id}`),
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payment_method: formattedPaymentMethod,
            price: newTotal,
            notes: updatedNotes,
          }),
        }
      );

      if (response.ok) {
        const updatedData = {
          ...orderData,
          payment_method: formattedPaymentMethod,
          price: newTotal,
          notes: updatedNotes,
        };
        onUpdate(updatedData);
        toast({
          title: "Success",
          description: "Payment method updated successfully!",
        });
        onClose();
      } else {
        throw new Error("Failed to update booking");
      }
    } catch (error) {
      console.error("Error updating payment method:", error);
      toast({
        title: "Error",
        description: "Failed to update payment method. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-end items-end z-50 md:items-center md:justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-40" onClick={onClose} />

      {/* Modal */}
      <div className="bg-white rounded-t-lg shadow-lg w-full mx-0 z-[110] md:mx-0 md:max-w-md md:rounded-sm max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Edit Payment Method
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Payment Methods */}
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedPaymentMethod === method.id
                    ? "border-2 border-[#01788e]"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
                onClick={() => setSelectedPaymentMethod(method.id)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`${
                      selectedPaymentMethod === method.id
                        ? "p-2 rounded-lg bg-gray-200 text-gray-700"
                        : "p-2 rounded-lg bg-gray-100 text-gray-700"
                    }`}
                  >
                    {method.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{method.name}</h4>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={selectedPaymentMethod === method.id}
                    onChange={() => setSelectedPaymentMethod(method.id)}
                    className="w-4 h-4 text-gray-700 border-gray-300 focus:ring-gray-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex gap-3 px-4 mb-8">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || !selectedPaymentMethod}
            className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
          >
            {isLoading ? "SAVING..." : "SAVE CHANGES"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPaymentModal;
