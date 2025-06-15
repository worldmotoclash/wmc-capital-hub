
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import UserInfoCard from '@/components/UserInfoCard';
import RecentUpdates from './RecentUpdates';
import InvestmentPerformance from './InvestmentPerformance';
import KeyDocuments from './KeyDocuments';
import InvestorSupport from './InvestorSupport';
import { useUser } from '@/contexts/UserContext';

const DashboardOverview: React.FC = () => {
  const { user } = useUser();
  // Case-insensitive, trimmed logic for hiding chart
  const status = user?.status?.toLowerCase().trim();
  const isSecuredInvestor = status === "secured investor";
  const isQualifiedInvestor = status === "qualified investor";
  const isPotentialInvestor = status === "potential investor";
  const showInvestmentPerformance =
    isSecuredInvestor && !isQualifiedInvestor && !isPotentialInvestor;

  return (
    <div className="space-y-8">
      {/* Investment Opportunity Banner */}
      <div className="rounded-lg overflow-hidden border border-red-200 bg-gradient-to-r from-red-50 to-amber-50 shadow-sm dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-700 dark:border-red-900">
        <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">🚨 New Investment Opportunity</h3>
            <p className="text-gray-600 mt-1 dark:text-gray-300">Learn about investing in World Moto Clash, a revolutionary motorsport league.</p>
          </div>
          <Button asChild className="bg-red-600 hover:bg-red-700">
            <Link to="/investment-opportunity">View Opportunity</Link>
          </Button>
        </div>
      </div>
      
      {/* Video spanning full width, now autoplay on load */}
      <div className="rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="aspect-video w-full relative">
          <iframe 
            src="https://drive.google.com/file/d/1ZDIK7ACuHd8GRvIXtiVBabDx3D3Aski7/preview?autoplay=1"
            title="WMC Motorsports Reimagined!"
            className="w-full h-full absolute inset-0"
            allowFullScreen
            allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        </div>
        <div className="p-4 text-base text-gray-600 text-center dark:text-gray-300">
          Experience the future of motorsports with WMC's innovative approach to racing entertainment
        </div>
      </div>
      
      {/* Investor Information and Recent Updates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UserInfoCard />
        <RecentUpdates />
      </div>
      
      {showInvestmentPerformance && (
        <div className="grid grid-cols-1 gap-6">
          <InvestmentPerformance />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeyDocuments />
        <InvestorSupport />
      </div>
    </div>
  );
};

export default DashboardOverview;
