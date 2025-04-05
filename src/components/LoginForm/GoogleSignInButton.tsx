
import React from 'react';
import { Button } from '@/components/ui/button';
import { Google } from 'lucide-react';

interface GoogleSignInButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onClick, isLoading }) => {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50"
    >
      <Google size={18} />
      {isLoading ? 'Connecting...' : 'Sign in with Google'}
    </Button>
  );
};

export default GoogleSignInButton;
