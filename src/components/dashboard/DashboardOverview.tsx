
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import UserInfoCard from '@/components/UserInfoCard';
import RecentUpdates from './RecentUpdates';
import InvestmentPerformance from './InvestmentPerformance';
import KeyDocuments from './KeyDocuments';
import InvestorSupport from './InvestorSupport';
import { useUser } from '@/contexts/UserContext';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { PlayCircle } from 'lucide-react';

const POSTER_IMAGE_URL = "/lovable-uploads/wmc-sizzle-thumbnail.png";
const VIDEO_IFRAME_SRC = "https://drive.google.com/file/d/1ZDIK7ACuHd8GRvIXtiVBabDx3D3Aski7/preview"; // autoplay removed

const DashboardOverview: React.FC = () => {
  const { user } = useUser();
  // Case-insensitive, trimmed logic for hiding chart
  const status = user?.status?.toLowerCase().trim();
  const isSecuredInvestor = status === "secured investor";
  const isQualifiedInvestor = status === "qualified investor";
  const isPotentialInvestor = status === "potential investor";
  const showInvestmentPerformance =
    isSecuredInvestor && !isQualifiedInvestor && !isPotentialInvestor;

  // Dialog state for playing video
  const [open, setOpen] = useState(false);

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
      
      {/* Video poster with play button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            className="group rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700 aspect-video w-full relative focus:outline-none"
            aria-label="Play video"
            type="button"
          >
            {/* Poster image */}
            <img
              src={POSTER_IMAGE_URL}
              alt="WMC Sizzle Reel"
              className="w-full h-full object-cover"
              draggable={false}
            />
            {/* Play button overlay */}
            <span className="absolute inset-0 flex items-center justify-center z-10">
              <PlayCircle className="h-20 w-20 text-white drop-shadow-xl transition-transform group-hover:scale-110 group-active:scale-95 opacity-90" />
            </span>
          </button>
        </DialogTrigger>
        <DialogContent
          className="max-w-3xl p-0 bg-black aspect-video"
          style={{ width: "90vw", maxWidth: "900px" }}
        >
          <div className="relative w-full aspect-video bg-black">
            <iframe
              src={VIDEO_IFRAME_SRC}
              title="WMC Motorsports Reimagined!"
              className="w-full h-full absolute inset-0 rounded-b-lg"
              allowFullScreen
              allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              loading="lazy"
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>

      <div className="p-4 text-base text-gray-600 text-center dark:text-gray-300">
        Experience the future of motorsports with WMC's innovative approach to racing entertainment
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
