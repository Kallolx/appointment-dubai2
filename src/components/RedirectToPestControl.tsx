import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectToPestControl = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to Pest Control service page
    navigate('/service-item/Pest%20Control%20at%20Home', { replace: true });
  }, [navigate]);

  // Return a loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
};

export default RedirectToPestControl;