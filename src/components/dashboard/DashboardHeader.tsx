
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AnimatedLogo from '@/components/AnimatedLogo';
import { useUser } from '@/contexts/UserContext';

interface DashboardHeaderProps {
  handleSignOut: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ handleSignOut }) => {
  const { user } = useUser();
  
  if (!user) return null;
  
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="z-10">
          <AnimatedLogo />
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-right">
            <div className="font-medium">{user.name}</div>
            <div className="text-gray-500">{user.status}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-medium">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <Button variant="outline" className="border-black text-black hover:bg-black/5" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
