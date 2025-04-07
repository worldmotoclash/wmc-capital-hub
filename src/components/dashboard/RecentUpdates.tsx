
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const RecentUpdates: React.FC = () => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate('/updates');
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recent Updates</CardTitle>
        <CardDescription>Latest company updates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm font-medium">New Partnership Announced</div>
          <div className="text-xs text-gray-500">Mar 28, 2025</div>
        </div>
        <div>
          <div className="text-sm font-medium">Q1 Earnings Report Available</div>
          <div className="text-xs text-gray-500">Mar 15, 2025</div>
        </div>
        <div>
          <div className="text-sm font-medium">New Market Expansion</div>
          <div className="text-xs text-gray-500">Feb 22, 2025</div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full text-sm" onClick={handleViewAll}>
          View All Updates
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecentUpdates;
