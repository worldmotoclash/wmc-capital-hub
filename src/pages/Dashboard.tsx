
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';

// Import our newly created components
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import TabContent from '@/components/dashboard/TabContent';

const Dashboard: React.FC = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const isSecuredInvestor = user?.status === "Secured Investor";

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Redirect if no user is logged in
    if (!user) {
      toast.error('Please log in to access the dashboard');
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSignOut = () => {
    setUser(null);
    toast.success('Successfully logged out');
    navigate('/');
  };

  const navigateToDocuments = () => {
    navigate('/documents');
  };

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader handleSignOut={handleSignOut} />
      
      <main className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-2">Investor Dashboard</h1>
          <p className="text-gray-600 mb-8">
            Welcome back {user.name}, 
            {isSecuredInvestor 
              ? " access your exclusive investment information below." 
              : " here's your potential investor information."}
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="bg-white border border-gray-200">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="documents" onClick={navigateToDocuments}>Documents</TabsTrigger>
              {isSecuredInvestor && <TabsTrigger value="financials">Financials</TabsTrigger>}
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <DashboardOverview />
            </TabsContent>
            
            <TabsContent value="documents">
              <TabContent 
                title="Investment Documents" 
                description="Access all documents related to your investment"
                message="A complete list of investment documents would be displayed here"
              />
            </TabsContent>
            
            {isSecuredInvestor && (
              <TabsContent value="financials">
                <TabContent 
                  title="Financial Information" 
                  description="Detailed financial data and reports"
                  message="Financial statements, projections, and analysis would be displayed here"
                />
              </TabsContent>
            )}
            
            <TabsContent value="events">
              <TabContent 
                title="Investor Events" 
                description="Upcoming and past investor events"
                message="Calendar of investor events, calls, and meetings would be displayed here"
              />
            </TabsContent>
            
            <TabsContent value="updates">
              <TabContent 
                title="Company Updates" 
                description="Latest news and announcements"
                message="Recent company news, press releases, and updates would be displayed here"
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
