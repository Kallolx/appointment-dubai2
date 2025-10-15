import { ChevronDown, ChevronUp, ArrowLeft, Smartphone, X } from "lucide-react";
import { buildApiUrl } from "@/config/api";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const countries = [
  { name: "Afghanistan", code: "af", dial_code: "+93" },
  { name: "Albania", code: "al", dial_code: "+355" },
  { name: "Algeria", code: "dz", dial_code: "+213" },
  { name: "Andorra", code: "ad", dial_code: "+376" },
  { name: "Angola", code: "ao", dial_code: "+244" },
  { name: "Antigua and Barbuda", code: "ag", dial_code: "+1-268" },
  { name: "Argentina", code: "ar", dial_code: "+54" },
  { name: "Armenia", code: "am", dial_code: "+374" },
  { name: "Australia", code: "au", dial_code: "+61" },
  { name: "Austria", code: "at", dial_code: "+43" },
  { name: "Azerbaijan", code: "az", dial_code: "+994" },
  { name: "Bahamas", code: "bs", dial_code: "+1-242" },
  { name: "Bahrain", code: "bh", dial_code: "+973" },
  { name: "Bangladesh", code: "bd", dial_code: "+880" },
  { name: "Barbados", code: "bb", dial_code: "+1-246" },
  { name: "Belarus", code: "by", dial_code: "+375" },
  { name: "Belgium", code: "be", dial_code: "+32" },
  { name: "Belize", code: "bz", dial_code: "+501" },
  { name: "Benin", code: "bj", dial_code: "+229" },
  { name: "Bhutan", code: "bt", dial_code: "+975" },
  { name: "Bolivia", code: "bo", dial_code: "+591" },
  { name: "Bosnia and Herzegovina", code: "ba", dial_code: "+387" },
  { name: "Botswana", code: "bw", dial_code: "+267" },
  { name: "Brazil", code: "br", dial_code: "+55" },
  { name: "Brunei Darussalam", code: "bn", dial_code: "+673" },
  { name: "Bulgaria", code: "bg", dial_code: "+359" },
  { name: "Burkina Faso", code: "bf", dial_code: "+226" },
  { name: "Burundi", code: "bi", dial_code: "+257" },
  { name: "Cambodia", code: "kh", dial_code: "+855" },
  { name: "Cameroon", code: "cm", dial_code: "+237" },
  { name: "Canada", code: "ca", dial_code: "+1" },
  { name: "Cape Verde", code: "cv", dial_code: "+238" },
  { name: "Central African Republic", code: "cf", dial_code: "+236" },
  { name: "Chad", code: "td", dial_code: "+235" },
  { name: "Chile", code: "cl", dial_code: "+56" },
  { name: "China", code: "cn", dial_code: "+86" },
  { name: "Colombia", code: "co", dial_code: "+57" },
  { name: "Comoros", code: "km", dial_code: "+269" },
  { name: "Congo", code: "cg", dial_code: "+242" },
  { name: "Costa Rica", code: "cr", dial_code: "+506" },
  { name: "Croatia", code: "hr", dial_code: "+385" },
  { name: "Cuba", code: "cu", dial_code: "+53" },
  { name: "Cyprus", code: "cy", dial_code: "+357" },
  { name: "Czech Republic", code: "cz", dial_code: "+420" },
  { name: "Denmark", code: "dk", dial_code: "+45" },
  { name: "Djibouti", code: "dj", dial_code: "+253" },
  { name: "Dominica", code: "dm", dial_code: "+1-767" },
  { name: "Dominican Republic", code: "do", dial_code: "+1-809" },
  { name: "Ecuador", code: "ec", dial_code: "+593" },
  { name: "Egypt", code: "eg", dial_code: "+20" },
  { name: "El Salvador", code: "sv", dial_code: "+503" },
  { name: "Equatorial Guinea", code: "gq", dial_code: "+240" },
  { name: "Eritrea", code: "er", dial_code: "+291" },
  { name: "Estonia", code: "ee", dial_code: "+372" },
  { name: "Eswatini", code: "sz", dial_code: "+268" },
  { name: "Ethiopia", code: "et", dial_code: "+251" },
  { name: "Fiji", code: "fj", dial_code: "+679" },
  { name: "Finland", code: "fi", dial_code: "+358" },
  { name: "France", code: "fr", dial_code: "+33" },
  { name: "Gabon", code: "ga", dial_code: "+241" },
  { name: "Gambia", code: "gm", dial_code: "+220" },
  { name: "Georgia", code: "ge", dial_code: "+995" },
  { name: "Germany", code: "de", dial_code: "+49" },
  { name: "Ghana", code: "gh", dial_code: "+233" },
  { name: "Greece", code: "gr", dial_code: "+30" },
  { name: "Grenada", code: "gd", dial_code: "+1-473" },
  { name: "Guatemala", code: "gt", dial_code: "+502" },
  { name: "Guinea", code: "gn", dial_code: "+224" },
  { name: "Guinea-Bissau", code: "gw", dial_code: "+245" },
  { name: "Guyana", code: "gy", dial_code: "+592" },
  { name: "Haiti", code: "ht", dial_code: "+509" },
  { name: "Honduras", code: "hn", dial_code: "+504" },
  { name: "Hungary", code: "hu", dial_code: "+36" },
  { name: "Iceland", code: "is", dial_code: "+354" },
  { name: "India", code: "in", dial_code: "+91" },
  { name: "Indonesia", code: "id", dial_code: "+62" },
  { name: "Iran", code: "ir", dial_code: "+98" },
  { name: "Iraq", code: "iq", dial_code: "+964" },
  { name: "Ireland", code: "ie", dial_code: "+353" },
  { name: "Israel", code: "il", dial_code: "+972" },
  { name: "Italy", code: "it", dial_code: "+39" },
  { name: "Jamaica", code: "jm", dial_code: "+1-876" },
  { name: "Japan", code: "jp", dial_code: "+81" },
  { name: "Jordan", code: "jo", dial_code: "+962" },
  { name: "Kazakhstan", code: "kz", dial_code: "+7" },
  { name: "Kenya", code: "ke", dial_code: "+254" },
  { name: "Kiribati", code: "ki", dial_code: "+686" },
  { name: "Kuwait", code: "kw", dial_code: "+965" },
  { name: "Kyrgyzstan", code: "kg", dial_code: "+996" },
  { name: "Laos", code: "la", dial_code: "+856" },
  { name: "Latvia", code: "lv", dial_code: "+371" },
  { name: "Lebanon", code: "lb", dial_code: "+961" },
  { name: "Lesotho", code: "ls", dial_code: "+266" },
  { name: "Liberia", code: "lr", dial_code: "+231" },
  { name: "Libya", code: "ly", dial_code: "+218" },
  { name: "Liechtenstein", code: "li", dial_code: "+423" },
  { name: "Lithuania", code: "lt", dial_code: "+370" },
  { name: "Luxembourg", code: "lu", dial_code: "+352" },
  { name: "Madagascar", code: "mg", dial_code: "+261" },
  { name: "Malawi", code: "mw", dial_code: "+265" },
  { name: "Malaysia", code: "my", dial_code: "+60" },
  { name: "Maldives", code: "mv", dial_code: "+960" },
  { name: "Mali", code: "ml", dial_code: "+223" },
  { name: "Malta", code: "mt", dial_code: "+356" },
  { name: "Marshall Islands", code: "mh", dial_code: "+692" },
  { name: "Mauritania", code: "mr", dial_code: "+222" },
  { name: "Mauritius", code: "mu", dial_code: "+230" },
  { name: "Mexico", code: "mx", dial_code: "+52" },
  { name: "Micronesia", code: "fm", dial_code: "+691" },
  { name: "Moldova", code: "md", dial_code: "+373" },
  { name: "Monaco", code: "mc", dial_code: "+377" },
  { name: "Mongolia", code: "mn", dial_code: "+976" },
  { name: "Montenegro", code: "me", dial_code: "+382" },
  { name: "Morocco", code: "ma", dial_code: "+212" },
  { name: "Mozambique", code: "mz", dial_code: "+258" },
  { name: "Myanmar", code: "mm", dial_code: "+95" },
  { name: "Namibia", code: "na", dial_code: "+264" },
  { name: "Nauru", code: "nr", dial_code: "+674" },
  { name: "Nepal", code: "np", dial_code: "+977" },
  { name: "Netherlands", code: "nl", dial_code: "+31" },
  { name: "New Zealand", code: "nz", dial_code: "+64" },
  { name: "Nicaragua", code: "ni", dial_code: "+505" },
  { name: "Niger", code: "ne", dial_code: "+227" },
  { name: "Nigeria", code: "ng", dial_code: "+234" },
  { name: "North Korea", code: "kp", dial_code: "+850" },
  { name: "North Macedonia", code: "mk", dial_code: "+389" },
  { name: "Norway", code: "no", dial_code: "+47" },
  { name: "Oman", code: "om", dial_code: "+968" },
  { name: "Pakistan", code: "pk", dial_code: "+92" },
  { name: "Palau", code: "pw", dial_code: "+680" },
  { name: "Palestine", code: "ps", dial_code: "+970" },
  { name: "Panama", code: "pa", dial_code: "+507" },
  { name: "Papua New Guinea", code: "pg", dial_code: "+675" },
  { name: "Paraguay", code: "py", dial_code: "+595" },
  { name: "Peru", code: "pe", dial_code: "+51" },
  { name: "Philippines", code: "ph", dial_code: "+63" },
  { name: "Poland", code: "pl", dial_code: "+48" },
  { name: "Portugal", code: "pt", dial_code: "+351" },
  { name: "Qatar", code: "qa", dial_code: "+974" },
  { name: "Romania", code: "ro", dial_code: "+40" },
  { name: "Russia", code: "ru", dial_code: "+7" },
  { name: "Rwanda", code: "rw", dial_code: "+250" },
  { name: "Saint Kitts and Nevis", code: "kn", dial_code: "+1-869" },
  { name: "Saint Lucia", code: "lc", dial_code: "+1-758" },
  { name: "Saint Vincent and the Grenadines", code: "vc", dial_code: "+1-784" },
  { name: "Samoa", code: "ws", dial_code: "+685" },
  { name: "San Marino", code: "sm", dial_code: "+378" },
  { name: "Sao Tome and Principe", code: "st", dial_code: "+239" },
  { name: "Saudi Arabia", code: "sa", dial_code: "+966" },
  { name: "Senegal", code: "sn", dial_code: "+221" },
  { name: "Serbia", code: "rs", dial_code: "+381" },
  { name: "Seychelles", code: "sc", dial_code: "+248" },
  { name: "Sierra Leone", code: "sl", dial_code: "+232" },
  { name: "Singapore", code: "sg", dial_code: "+65" },
  { name: "Slovakia", code: "sk", dial_code: "+421" },
  { name: "Slovenia", code: "si", dial_code: "+386" },
  { name: "Solomon Islands", code: "sb", dial_code: "+677" },
  { name: "Somalia", code: "so", dial_code: "+252" },
  { name: "South Africa", code: "za", dial_code: "+27" },
  { name: "South Korea", code: "kr", dial_code: "+82" },
  { name: "South Sudan", code: "ss", dial_code: "+211" },
  { name: "Spain", code: "es", dial_code: "+34" },
  { name: "Sri Lanka", code: "lk", dial_code: "+94" },
  { name: "Sudan", code: "sd", dial_code: "+249" },
  { name: "Suriname", code: "sr", dial_code: "+597" },
  { name: "Sweden", code: "se", dial_code: "+46" },
  { name: "Switzerland", code: "ch", dial_code: "+41" },
  { name: "Syria", code: "sy", dial_code: "+963" },
  { name: "Taiwan", code: "tw", dial_code: "+886" },
  { name: "Tajikistan", code: "tj", dial_code: "+992" },
  { name: "Tanzania", code: "tz", dial_code: "+255" },
  { name: "Thailand", code: "th", dial_code: "+66" },
  { name: "Timor-Leste", code: "tl", dial_code: "+670" },
  { name: "Togo", code: "tg", dial_code: "+228" },
  { name: "Tonga", code: "to", dial_code: "+676" },
  { name: "Trinidad and Tobago", code: "tt", dial_code: "+1-868" },
  { name: "Tunisia", code: "tn", dial_code: "+216" },
  { name: "Turkey", code: "tr", dial_code: "+90" },
  { name: "Turkmenistan", code: "tm", dial_code: "+993" },
  { name: "Tuvalu", code: "tv", dial_code: "+688" },
  { name: "Uganda", code: "ug", dial_code: "+256" },
  { name: "Ukraine", code: "ua", dial_code: "+380" },
  { name: "United Arab Emirates", code: "ae", dial_code: "+971" },
  { name: "United Kingdom", code: "gb", dial_code: "+44" },
  { name: "United States", code: "us", dial_code: "+1" },
  { name: "Uruguay", code: "uy", dial_code: "+598" },
  { name: "Uzbekistan", code: "uz", dial_code: "+998" },
  { name: "Vanuatu", code: "vu", dial_code: "+678" },
  { name: "Vatican City", code: "va", dial_code: "+379" },
  { name: "Venezuela", code: "ve", dial_code: "+58" },
  { name: "Vietnam", code: "vn", dial_code: "+84" },
  { name: "Yemen", code: "ye", dial_code: "+967" },
  { name: "Zambia", code: "zm", dial_code: "+260" },
  { name: "Zimbabwe", code: "zw", dial_code: "+263" }
];


const LoginModal = ({ setLoginModalOpen, initialPhone, redirectTo }: { 
  setLoginModalOpen: (open: boolean) => void; 
  initialPhone?: string;
  redirectTo?: string;
}) => {
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
      // Send OTP directly without checking if user exists
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
      // Verify OTP - backend will automatically create user if needed
      const response = await fetch(buildApiUrl('/api/auth/verify-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhoneNumber, otp })
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        // Login successful (works for both new and existing users)
        login(data.user, data.token);
        setLoginModalOpen(false);
        
        // Show success message for new users
        if (data.isNewUser) {
          toast({
            title: "Welcome!",
            description: "Your account has been created successfully.",
          });
        }
        
        // Redirect to specific page if provided, otherwise go to home
        if (redirectTo) {
          window.location.href = redirectTo;
        } else {
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
    <div className="fixed inset-0 flex justify-end items-end z-[200] md:items-center md:justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-40" onClick={() => setLoginModalOpen(false)} />

          <div className="bg-white rounded-t-lg shadow-lg w-full mx-0 z-[110] md:mx-0 md:max-w-md md:rounded-sm">
        <div className="p-5">
            <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="font-bold text-lg text-gray-800">Login with OTP</h2>
              <p className="text-sm text-gray-500">We'll send a verification code to your phone number.</p>
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
