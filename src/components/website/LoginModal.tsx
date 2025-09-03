import { ChevronDown, ChevronUp, ArrowLeft, Smartphone, X } from "lucide-react";
import { buildApiUrl } from "@/config/api";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const countries = [
  { name: "United Arab Emirates", code: "ae", dial_code: "+971" },
  { name: "Saudi Arabia", code: "sa", dial_code: "+966" },
  { name: "Qatar", code: "qa", dial_code: "+974" },
  { name: "Kuwait", code: "kw", dial_code: "+965" },
  { name: "Bahrain", code: "bh", dial_code: "+973" },
  { name: "Oman", code: "om", dial_code: "+968" },
  { name: "India", code: "in", dial_code: "+91" },
  { name: "Bangladesh", code: "bd", dial_code: "+880" },
  { name: "Pakistan", code: "pk", dial_code: "+92" },
  { name: "Egypt", code: "eg", dial_code: "+20" },
  { name: "Jordan", code: "jo", dial_code: "+962" },
  { name: "Lebanon", code: "lb", dial_code: "+961" },
  { name: "Turkey", code: "tr", dial_code: "+90" },
  { name: "Philippines", code: "ph", dial_code: "+63" },
  { name: "Indonesia", code: "id", dial_code: "+62" },
  { name: "Malaysia", code: "my", dial_code: "+60" },
  { name: "Nepal", code: "np", dial_code: "+977" },
  { name: "Sri Lanka", code: "lk", dial_code: "+94" },
  { name: "Afghanistan", code: "af", dial_code: "+93" },
];

const LoginModal = ({ setLoginModalOpen, initialPhone }: { setLoginModalOpen: (open: boolean) => void; initialPhone?: string }) => {
  const [isCountryDrawerOpen, setIsCountryDrawerOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("United Arab Emirates");
  const [countrySearch, setCountrySearch] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(initialPhone || "");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone"); // "phone" or "otp"
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const { toast } = useToast();
  const { login } = useAuth();
  
  // Add validation for phone number format
  const validatePhoneNumber = (number) => {
    // Remove any non-digit characters
    const digitsOnly = number.replace(/\D/g, '');
    return digitsOnly.length >= 8;
  };

  const toggleCountryDrawer = () => {
    setIsCountryDrawerOpen(!isCountryDrawerOpen);
  };

  const selectCountry = (country) => {
    setSelectedCountry(country.name);
    setIsCountryDrawerOpen(false);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  // Refs and handlers for 6-box OTP input
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleDigitChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const arr = otp.split('');
    while (arr.length < 6) arr.push('');
    arr[index] = digit || '';
    const newOtp = arr.join('').slice(0, 6);
    setOtp(newOtp);
    if (digit && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;
    if (key === 'Backspace') {
      if ((otp[index] || '') === '') {
        if (inputsRef.current[index - 1]) {
          inputsRef.current[index - 1]?.focus();
        }
      } else {
        const arr = otp.split('');
        while (arr.length < 6) arr.push('');
        arr[index] = '';
        setOtp(arr.join('').slice(0, 6));
      }
    } else if (key === 'ArrowLeft') {
      if (inputsRef.current[index - 1]) inputsRef.current[index - 1]?.focus();
    } else if (key === 'ArrowRight') {
      if (inputsRef.current[index + 1]) inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const arr = paste.split('');
    while (arr.length < 6) arr.push('');
    const newOtp = arr.join('').slice(0, 6);
    setOtp(newOtp);
    // focus the next empty input
    const nextIndex = paste.length >= 6 ? 5 : paste.length;
    setTimeout(() => {
      inputsRef.current[nextIndex]?.focus();
    }, 0);
  };

  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => inputsRef.current[0]?.focus(), 50);
    }
  }, [step]);

  const getFullPhoneNumber = () => {
    const dialCode = countries.find((c) => c.name === selectedCountry)?.dial_code || "+971";
    return `${dialCode}${phoneNumber}`;
  };

  const handleSendOtp = async () => {
    // Validate phone number before proceeding
    if (!validatePhoneNumber(phoneNumber)) {
      toast({
        title: "Please enter a valid mobile number.",
        variant: "destructive",
      });
      return;
    }
    
    const fullPhoneNumber = getFullPhoneNumber();
    setIsLoading(true);
    
    try {
      // First check if phone number exists in database
      const checkResponse = await fetch(buildApiUrl('/api/auth/check-phone'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhoneNumber })
      });
      
      const checkData = await checkResponse.json();
      
      if (checkResponse.ok) {
        if (checkData.exists) {
          // User exists - redirect to login page with password flow
          setLoginModalOpen(false);
          window.location.href = `/login?phone=${encodeURIComponent(fullPhoneNumber)}`;
          return;
        } else {
          // User doesn't exist - proceed with OTP for new user registration
          // Send OTP to phone number
          const response = await fetch(buildApiUrl('/api/auth/send-otp'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: fullPhoneNumber })
          });
          
          const data = await response.json();
          
          if (response.ok && data.success) {
            setStep("otp");
            startResendTimer();
            
            // Show different messages for test mode vs production
            if (data.testMode) {
              toast({
                title: "Test OTP Sent",
                description: `Test code: ${data.testOtp} (Development Mode)`,
                duration: 10000 // Show longer for test mode
              });
              // Pre-fill OTP in test mode for easier testing
              setOtp(data.testOtp);
            } else {
              toast({
                title: "OTP Sent",
                description: `Verification code sent to ${fullPhoneNumber}`,
              });
            }
          } else {
            toast({
              title: "Error",
              description: data.message || "Failed to send OTP. Please try again.",
              variant: "destructive"
            });
          }
        }
      } else {
        throw new Error(checkData.message || 'Failed to check phone number');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Connection Error",
        description: "Could not connect to the server. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit code",
        variant: "destructive"
      });
      return;
    }

    const fullPhoneNumber = getFullPhoneNumber();
    setIsLoading(true);
    
    try {
      // Verify OTP
      const response = await fetch(buildApiUrl('/api/auth/verify-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhoneNumber, otp })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        if (data.isNewUser) {
          // New user - redirect to registration
          window.location.href = `/login?phone=${encodeURIComponent(fullPhoneNumber)}&new=true&verified=true`;
        } else {
          // Existing user - login successful
          login(data.user, data.token);
          setLoginModalOpen(false);
          window.location.href = "/";
        }
      } else {
        toast({
          title: "Verification Failed",
          description: data.message || "Invalid OTP. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Connection Error",
        description: "Could not connect to the server. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startResendTimer = () => {
    setResendTimer(60); // 60 seconds
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOtp = () => {
    if (resendTimer === 0) {
      handleSendOtp();
    }
  };

  const handleBackToPhone = () => {
    setStep("phone");
    setOtp("");
    setResendTimer(0);
  };
  return (
    <div className="fixed inset-0 flex justify-end items-end z-[100] md:items-center md:justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-40" onClick={() => setLoginModalOpen(false)} />

          <div className="bg-white rounded-t-lg shadow-lg w-full mx-0 z-[110] md:mx-0 md:max-w-md md:rounded-sm">
        <div className="p-5">
            <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="font-bold text-lg text-gray-800">Log in or sign up</h2>
              <p className="text-sm text-gray-500">Please enter your mobile number to proceed.</p>
            </div>
            <button
              onClick={() => setLoginModalOpen(false)}
              aria-label="Close modal"
              className="p-2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4">
            {step === 'phone' ? (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                <div className="w-full">
                  <div className="flex items-center bg-gray-50 rounded-md px-3 py-2">
                    <button
                      onClick={toggleCountryDrawer}
                      className="flex items-center gap-2 pr-3 mr-3 border-r border-transparent"
                      type="button"
                    >
                      <img
                        src={`https://flagcdn.com/w40/${countries.find((c) => c.name === selectedCountry)?.code || 'ae'}.png`}
                        className="w-6 h-6 rounded-full"
                        alt="flag"
                      />
                      <span className="text-sm text-gray-700">{countries.find((c) => c.name === selectedCountry)?.dial_code}</span>
                      <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
                    </button>

                    <input
                      type="tel"
                      className="flex-1 bg-transparent border-0 outline-none text-sm placeholder-gray-400"
                      placeholder="Phone Number"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      maxLength={15}
                      autoFocus
                    />

                    <div className="ml-3 text-gray-400">
                      <Smartphone className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleSendOtp}
                    type="button"
                    className={`w-full py-3 rounded-md text-white font-semibold ${isLoading ? 'bg-orange-400' : 'bg-orange-500 hover:bg-orange-600'}`}
                  >
                    {isLoading ? 'SENDING...' : 'CONTINUE'}
                  </button>
                </div>
              </>
            ) : (
              // OTP Step UI
              <>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                <div className="w-full">
                  <div className="flex items-center justify-center bg-gray-50 rounded-md px-3 py-4 space-x-2">
                    {[0,1,2,3,4,5].map((i) => (
                      <input
                        key={i}
                        ref={(el) => (inputsRef.current[i] = el)}
                        type="text"
                        inputMode="numeric"
                        className="w-10 h-12 text-center text-lg font-medium bg-white border rounded focus:outline-none"
                        value={(otp[i] || '')}
                        onChange={(e) => handleDigitChange(i, e.target.value)}
                        onKeyDown={(e) => handleDigitKeyDown(i, e)}
                        onPaste={handlePaste}
                        maxLength={1}
                        aria-label={`Digit ${i+1}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <button
                    onClick={handleBackToPhone}
                    type="button"
                    className="text-gray-600 hover:underline flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>

                  <div className="text-right">
                    {resendTimer > 0 ? (
                      <div className="text-gray-500">Resend in {resendTimer}s</div>
                    ) : (
                      <button onClick={handleResendOtp} className="text-orange-500 font-medium">Resend</button>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleVerifyOtp}
                    type="button"
                    className={`w-full py-3 rounded-md text-white font-semibold ${isLoading ? 'bg-orange-400' : 'bg-orange-500 hover:bg-orange-600'}`}
                  >
                    {isLoading ? 'VERIFYING...' : 'VERIFY'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Country Drawer */}
      {isCountryDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-[120]" onClick={() => setIsCountryDrawerOpen(false)}>
          <div className="bg-white w-full max-w-md mt-20 rounded-md shadow-lg p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Select Country</h3>
              <button
                onClick={() => setIsCountryDrawerOpen(false)}
                aria-label="Close country selector"
                className="p-2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Search"
              value={countrySearch}
              onChange={(e) => setCountrySearch(e.target.value)}
              className="w-full p-2 border rounded mb-3"
            />

            <div className="max-h-72 overflow-auto">
              <ul>
                {countries
                  .filter((country) => country.name.toLowerCase().includes(countrySearch.toLowerCase()))
                  .map((country) => (
                    <li key={country.code} className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-100 ${selectedCountry === country.name ? 'bg-gray-50' : ''}`} onClick={() => selectCountry(country)}>
                      <img src={`https://flagcdn.com/w40/${country.code}.png`} className="w-6 h-6 rounded-full" alt="flag" />
                      <div className="flex-1 text-sm text-gray-700">{country.name}</div>
                      <div className="text-sm text-gray-500">{country.dial_code}</div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginModal;
