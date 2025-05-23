
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bell, ExternalLink, FileText } from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { companyUpdates } from '@/data/companyUpdates';

const Updates: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  
  // Use all updates, not just recent ones
  const allUpdates = companyUpdates;

  React.useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Redirect if no user is logged in
    if (!user) {
      toast.error('Please log in to access updates');
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSignOut = () => {
    setUser(null);
    toast.success('Successfully logged out');
    navigate('/');
  };

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader handleSignOut={handleSignOut} />
      
      <main className="container mx-auto px-6 py-12">
        <div className="mb-8 flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-2">Company Updates</h1>
          <p className="text-gray-600 mb-8">
            Stay informed with the latest news and announcements
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-6"
        >
          {allUpdates.map((update, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Bell className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <h3 className="font-semibold text-lg">{update.title}</h3>
                      <div className="flex items-center mt-1 sm:mt-0">
                        <span className="text-sm text-gray-500">{update.date}</span>
                        <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">{update.category}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{update.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {update.url && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          asChild
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <a 
                            href={update.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Visit Website
                          </a>
                        </Button>
                      )}
                      {update.documentUrl && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          asChild
                          className="text-emerald-600 hover:text-emerald-800 transition-colors"
                        >
                          <a 
                            href={update.documentUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            View Document
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default Updates;
