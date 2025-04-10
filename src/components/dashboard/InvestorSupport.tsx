
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
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
          <h4 className="text-sm font-medium mb-2 dark:text-gray-200">Your Dedicated Investor Relations Contact</h4>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-lg font-medium dark:text-gray-300">
              SM
            </div>
            <div>
              <div className="font-medium dark:text-white">Sarah Mitchell</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Investor Relations Manager</div>
              <a 
                href="mailto:sarah.mitchell@worldmotoclash.com" 
                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                sarah.mitchell@worldmotoclash.com
              </a>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <Button 
            className="w-full bg-black hover:bg-black/80 text-white"
            onClick={() => window.open('https://calendar.app.google/2qCX5aGphMmqUG5y5', '_blank', 'noopener,noreferrer')}
          >
            Schedule a Call
          </Button>
          <Button variant="outline" className="w-full dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Send a Message</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestorSupport;
