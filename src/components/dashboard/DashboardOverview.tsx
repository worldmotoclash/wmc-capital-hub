
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
        <RecentUpdates />
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
