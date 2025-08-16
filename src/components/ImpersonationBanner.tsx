import React from 'react';
import { AlertTriangle, LogOut, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const ImpersonationBanner: React.FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isExiting, setIsExiting] = React.useState(false);

  // Check if currently impersonating
  const isImpersonating = localStorage.getItem('isImpersonating') === 'true';
  const originalUser = localStorage.getItem('originalUser');

  if (!isImpersonating || !originalUser) {
    return null;
  }

  const handleExitImpersonation = async () => {
    try {
      setIsExiting(true);
      
      // Get original user data
      const originalUserData = JSON.parse(originalUser);
      const originalToken = localStorage.getItem('originalToken');

      if (!originalToken) {
        throw new Error('Original token not found');
      }

      // Call backend to exit impersonation
      const response = await fetch('http://localhost:3001/api/superadmin/exit-impersonation', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ originalUserId: originalUserData.id })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Clear impersonation flags
        localStorage.removeItem('isImpersonating');
        localStorage.removeItem('originalUser');
        localStorage.removeItem('originalToken');
        
        // Restore original user session
        login(data.user, data.token);
        
        toast({
          title: "Impersonation Ended",
          description: "You have returned to your super admin account.",
          variant: "default"
        });
        
        // Navigate back to super admin dashboard
        navigate('/administrator');
      } else {
        throw new Error('Failed to exit impersonation');
      }
    } catch (error) {
      console.error('Error exiting impersonation:', error);
      
      // Fallback: restore original session manually
      try {
        const originalUserData = JSON.parse(originalUser);
        const originalToken = localStorage.getItem('originalToken');
        
        if (originalToken) {
          localStorage.removeItem('isImpersonating');
          localStorage.removeItem('originalUser');
          localStorage.removeItem('originalToken');
          
          login(originalUserData, originalToken);
          navigate('/superadmin');
          
          toast({
            title: "Session Restored",
            description: "Returned to your super admin account.",
            variant: "default"
          });
        }
      } catch (fallbackError) {
        toast({
          title: "Error",
          description: "Could not exit impersonation. Please refresh the page.",
          variant: "destructive"
        });
      }
    } finally {
      setIsExiting(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 shadow-lg border-b-2 border-orange-600">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="hidden sm:flex items-center gap-2 text-orange-100">
            <span>You are viewing as:</span>
            <span className="font-semibold bg-orange-600 px-2 py-1 rounded text-sm">
              {user?.fullName} ({user?.role})
            </span>
          </div>
        </div>
        
        <Button
          onClick={handleExitImpersonation}
          disabled={isExiting}
          variant="outline"
          size="sm"
          className="bg-white text-orange-600 border-white hover:bg-orange-50 hover:text-orange-700"
        >
          {isExiting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-orange-600/30 border-t-orange-600 rounded-full animate-spin" />
              Exiting...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Return to Super Admin
              <LogOut className="w-4 h-4" />
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ImpersonationBanner;
