
import React from 'react';
import UserInfoCard from '@/components/UserInfoCard';
import RecentUpdates from './RecentUpdates';
import InvestmentPerformance from './InvestmentPerformance';
import KeyDocuments from './KeyDocuments';
import InvestorSupport from './InvestorSupport';
import { useUser } from '@/contexts/UserContext';

const DashboardOverview: React.FC = () => {
  const { user } = useUser();
  const isSecuredInvestor = user?.status?.toLowerCase().trim() === "secured investor";
  const isQualifiedInvestor = user?.status?.toLowerCase().trim() === "qualified investor";
  const hasBusinessPlanAccess = isSecuredInvestor || isQualifiedInvestor;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UserInfoCard />
        <div className="space-y-6">
          <RecentUpdates />
          <div className="rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm">
            <div className="aspect-video w-full">
              <iframe 
                src="https://www.youtube.com/embed/ilJTemepdME" 
                title="WMC Team Owners"
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </div>
            <div className="p-4 text-sm text-gray-600 text-center">
              Listen to WMC Team Owners Colin Edwards, Miguel Duhamel and Gregg Smrtz
            </div>
          </div>
        </div>
      </div>
      
      {hasBusinessPlanAccess && (
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
