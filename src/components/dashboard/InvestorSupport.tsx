
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const InvestorSupport: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Investor Support</CardTitle>
        <CardDescription>Get support for your investment questions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="text-sm font-medium mb-2">Your Dedicated Investor Relations Contact</h4>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-medium">
              SM
            </div>
            <div>
              <div className="font-medium">Sarah Mitchell</div>
              <div className="text-sm text-gray-500">Investor Relations Manager</div>
              <div className="text-sm text-gray-500">sarah.mitchell@worldmotoclash.com</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <Button className="w-full bg-black hover:bg-black/80 text-white">Schedule a Call</Button>
          <Button variant="outline" className="w-full">Send a Message</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestorSupport;
