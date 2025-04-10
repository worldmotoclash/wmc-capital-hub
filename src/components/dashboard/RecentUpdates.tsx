
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { companyUpdates } from '@/data/companyUpdates';

const RecentUpdates: React.FC = () => {
  const navigate = useNavigate();
  // Get only the 3 most recent updates
  const recentUpdates = companyUpdates.slice(0, 3);

  const handleViewAll = () => {
    navigate('/updates');
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recent Updates</CardTitle>
        <CardDescription className="text-base">Latest company updates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentUpdates.map((update, index) => (
          <div key={index}>
            <div className="text-lg font-medium">{update.title}</div>
            <div className="text-base text-gray-500">{update.date}</div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full text-base" onClick={handleViewAll}>
          View All Updates
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecentUpdates;
