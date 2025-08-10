import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, LogIn, Shield, ArrowRight, User, Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  // Authentication flow states
  const [step, setStep] = useState("phone"); // phone, password, signup
  const [isLoading, setIsLoading] = useState(false);
  
  // User data states
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  // Address fields
  const [recipientName, setRecipientName] = useState("");
  const [buildingInfo, setBuildingInfo] = useState("");
  const [streetInfo, setStreetInfo] = useState("");
  const [locality, setLocality] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check URL parameters on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const phoneParam = params.get('phone');
    const isNewUser = params.get('new') === 'true';
    
    if (phoneParam) {
      setPhone(phoneParam);
      setStep(isNewUser ? "signup" : "password");
    }
  }, []);

  // Handle phone number verification
  const handlePhoneCheck = () => {
    if (!phone || phone.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Make API call to check if phone exists
    fetch('http://localhost:3001/api/auth/check-phone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    })
    .then(response => response.json())
    .then(data => {
      console.log("API response:", data);
      if (data.exists) {
        // Phone exists, proceed to password step
        setStep("password");
      } else {
        // Phone doesn't exist, proceed to signup
        setStep("signup");
      }
    })
    .catch(error => {
      console.error('Error:', error);
      toast({
        title: "Connection Error",
        description: "Could not connect to the server. Please try again.",
        variant: "destructive"
      });
    })
    .finally(() => {
      setIsLoading(false);
    });
  };
  
  // Handle login
  const handleLogin = () => {
    if (!password) {
      toast({
        title: "Password Required",
        description: "Please enter your password.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Make API call to login
    fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${data.user.fullName || 'User'}!`,
        });
        
        navigate("/user");
      } else {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid credentials. Please try again.",
          variant: "destructive"
        });
      }
    })
    .catch(error => {
      toast({
        title: "Connection Error",
        description: "Could not connect to the server. Please try again.",
        variant: "destructive"
      });
    })
    .finally(() => {
      setIsLoading(false);
    });
  };
  
  // Handle signup
  const handleSignup = () => {
    // Validate input
    if (!fullName || !email || !recipientName || !buildingInfo || !streetInfo || !locality || !city || !country || !password || !confirmPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Make API call to register
    fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        phone, 
        fullName, 
        email, 
        address: {
          recipientName,
          buildingInfo,
          streetInfo,
          locality,
          city,
          country
        }, 
        password 
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        toast({
          title: "Registration Successful",
          description: `Welcome to AppointPro, ${fullName}!`,
        });
        
        navigate("/user");
      } else {
        toast({
          title: "Registration Failed",
          description: data.message || "Could not create your account. Please try again.",
          variant: "destructive"
        });
      }
    })
    .catch(error => {
      toast({
        title: "Connection Error",
        description: "Could not connect to the server. Please try again.",
        variant: "destructive"
      });
    })
    .finally(() => {
      setIsLoading(false);
    });
  };
  
  // Go back to phone step
  const handleBack = () => {
    setStep("phone");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">AppointPro</h1>
          <p className="text-muted-foreground">Professional Appointment Management</p>
        </div>

        <Card className="shadow-lg border-border/40">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              {step === "phone" && (
                <>
                  <User className="w-5 h-5 text-primary" />
                  User Authentication
                </>
              )}
              {step === "password" && (
                <>
                  <LogIn className="w-5 h-5 text-primary" />
                  Login
                </>
              )}
              {step === "signup" && (
                <>
                  <User className="w-5 h-5 text-primary" />
                  Create Account
                </>
              )}
            </CardTitle>
            <CardDescription>
              {step === "phone" && "Enter your phone number to continue"}
              {step === "password" && "Enter your password to login"}
              {step === "signup" && "Create your new account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Phone Number Step */}
            {step === "phone" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="button" 
                  className="w-full" 
                  disabled={isLoading} 
                  onClick={handlePhoneCheck}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Checking...
                    </div>
                  ) : (
                    <span className="flex items-center gap-2">
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>
            )}

            {/* Password Step */}
            {step === "password" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="phone-display">Phone Number</Label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleBack}
                      className="h-8 px-2 text-xs"
                    >
                      Change
                    </Button>
                  </div>
                  <Input 
                    id="phone-display" 
                    type="tel" 
                    value={phone} 
                    disabled 
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="button" 
                  className="w-full" 
                  disabled={isLoading} 
                  onClick={handleLogin}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Logging in...
                    </div>
                  ) : (
                    <span className="flex items-center gap-2">
                      Login
                      <LogIn className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>
            )}

            {/* Signup Step */}
            {step === "signup" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="phone-signup">Phone Number</Label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleBack}
                      className="h-8 px-2 text-xs"
                    >
                      Change
                    </Button>
                  </div>
                  <Input 
                    id="phone-signup" 
                    type="tel" 
                    value={phone} 
                    disabled 
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    type="text" 
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-base font-medium">Physical Address</Label>
                  <div className="space-y-2">
                    <Label htmlFor="recipientName">Recipient's Name</Label>
                    <Input 
                      id="recipientName" 
                      type="text" 
                      placeholder="Enter recipient's name"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buildingInfo">Building Name/Number</Label>
                    <Input 
                      id="buildingInfo" 
                      type="text" 
                      placeholder="Enter building name or number"
                      value={buildingInfo}
                      onChange={(e) => setBuildingInfo(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="streetInfo">Street Name/Number</Label>
                    <Input 
                      id="streetInfo" 
                      type="text" 
                      placeholder="Enter street name or number"
                      value={streetInfo}
                      onChange={(e) => setStreetInfo(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="locality">Locality</Label>
                    <Input 
                      id="locality" 
                      type="text" 
                      placeholder="Enter locality"
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      type="text" 
                      placeholder="Enter city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input 
                      id="country" 
                      type="text" 
                      placeholder="Enter country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signup">Password</Label>
                  <Input 
                    id="password-signup" 
                    type="password" 
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="button" 
                  className="w-full" 
                  disabled={isLoading} 
                  onClick={handleSignup}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Creating Account...
                    </div>
                  ) : (
                    <span className="flex items-center gap-2">
                      Create Account
                      <User className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="text-center mt-6 text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} AppointPro. All rights reserved.
        </div>
      </div>
    </div>
  );
}