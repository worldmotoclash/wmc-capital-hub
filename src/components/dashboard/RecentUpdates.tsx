
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const RecentUpdates: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recent Updates</CardTitle>
        <CardDescription>Latest company updates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm font-medium">New Partnership Announced</div>
          <div className="text-xs text-gray-500">Sep 28, 2023</div>
        </div>
        <div>
          <div className="text-sm font-medium">Q2 Earnings Report Available</div>
          <div className="text-xs text-gray-500">Aug 15, 2023</div>
        </div>
        <div>
          <div className="text-sm font-medium">New Market Expansion</div>
          <div className="text-xs text-gray-500">Jul 22, 2023</div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full text-sm">View All Updates</Button>
      </CardFooter>
    </Card>
  );
};

export default RecentUpdates;
