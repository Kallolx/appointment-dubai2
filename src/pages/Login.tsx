import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, LogIn, Shield, ArrowRight, User, Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { buildApiUrl } from "@/config/api";
import LoginModal from "@/components/website/LoginModal";

export default function Login() {
  // Authentication flow states
  const [step, setStep] = useState("phone"); // phone, password, signup
  const [isLoading, setIsLoading] = useState(false);
  
  // User data states
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  
  // Check URL parameters on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const phoneParam = params.get('phone');
    const isNewUser = params.get('new') === 'true';
    const isVerified = params.get('verified') === 'true';
    
    if (phoneParam) {
      setPhone(phoneParam);
      if (isNewUser && isVerified) {
        // Phone is already verified via OTP, go directly to signup
        setStep("signup");
      } else if (isNewUser) {
        setStep("signup");
      } else {
        setStep("password");
      }
    }
  }, []);

  // Handle phone number verification
  const handleCheckPhone = async () => {
    if (!phone.trim()) {
      toast({
        title: "Error",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(buildApiUrl('/api/auth/check-phone'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      
      if (response.ok) {
        if (data.exists) {
          setStep("password");
        } else {
          // User doesn't exist, show OTP login modal for new user
          setLoginModalOpen(true);
        }
      } else {
        throw new Error(data.message || 'Failed to check phone number');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to check phone number",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
    fetch(buildApiUrl('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        // Use AuthContext login method
        login(data.user, data.token);
        
        // Redirect based on user role
        if (data.user.role === 'super_admin') {
          navigate("/administrator");
        } else if (data.user.role === 'admin') {
          navigate("/admin");
        } else {
          navigate("/user");
        }
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
    const params = new URLSearchParams(window.location.search);
    const isOtpVerified = params.get('verified') === 'true';
    
    // Validate input - password is optional for OTP-verified users
    if (!fullName || !email) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and email.",
        variant: "destructive"
      });
      return;
    }
    
    // If not OTP verified, password is required
    if (!isOtpVerified && (!password || !confirmPassword)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields including password.",
        variant: "destructive"
      });
      return;
    }
    
    // If passwords are provided, they must match
    if (password && password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Make API call to register (no address sent for signup)
    fetch(buildApiUrl('/api/auth/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        phone, 
        fullName, 
        email, 
        password: password || null,
        isOtpVerified
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        // Use AuthContext login method
        login(data.user, data.token);
        
        // Redirect based on user role
        if (data.user.role === 'super_admin') {
          navigate("/superadmin");
        } else if (data.user.role === 'admin') {
          navigate("/admin");
        } else {
          navigate("/user");
        }
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
    <>
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

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
                  className="w-full bg-primary text-primary-foreground" 
                  disabled={isLoading} 
                  onClick={handleCheckPhone}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 rounded-full animate-spin" />
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
                  className="w-full bg-primary text-primary-foreground" 
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
                
                {/* Check if this is OTP verified registration */}
                {(() => {
                  const params = new URLSearchParams(window.location.search);
                  const isOtpVerified = params.get('verified') === 'true';
                  
                  return isOtpVerified && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <span className="text-green-700 text-sm font-medium">Phone number verified</span>
                      </div>
                    </div>
                  );
                })()}
                
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
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
                  <Label htmlFor="email">Email Address *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {/* Physical address removed for signup flow */}
                
                {/* Password fields - optional for OTP verified users */}
                {(() => {
                  const params = new URLSearchParams(window.location.search);
                  const isOtpVerified = params.get('verified') === 'true';
                  
                  return (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="password-signup">
                          Password {!isOtpVerified && '*'}
                          {isOtpVerified && <span className="text-sm text-gray-500">(Optional - you can set this later)</span>}
                        </Label>
                        <Input 
                          id="password-signup" 
                          type="password" 
                          placeholder="Create a password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required={!isOtpVerified}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirm Password {!isOtpVerified && '*'}
                        </Label>
                        <Input 
                          id="confirmPassword" 
                          type="password" 
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required={!isOtpVerified}
                        />
                      </div>
                    </>
                  );
                })()}
                
                <Button 
                  type="button" 
                  className="w-full bg-primary text-primary-foreground" 
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
      </div>
    </div>
    {loginModalOpen && (
      <LoginModal setLoginModalOpen={setLoginModalOpen} initialPhone={phone} />
    )}
    </>
  );
}