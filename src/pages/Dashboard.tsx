
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import AnimatedLogo from '@/components/AnimatedLogo';
import { motion } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import UserInfoCard from '@/components/UserInfoCard';
import { toast } from 'sonner';

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

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="z-10">
            <AnimatedLogo />
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-right">
              <div className="font-medium">{user.name}</div>
              <div className="text-gray-500">{user.status}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-medium">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <Button variant="outline" className="border-black text-black hover:bg-black/5" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      
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
              <TabsTrigger value="documents">Documents</TabsTrigger>
              {isSecuredInvestor && <TabsTrigger value="financials">Financials</TabsTrigger>}
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <UserInfoCard />
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Upcoming Events</CardTitle>
                    <CardDescription>Scheduled investor events</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-sm font-medium">Q3 Earnings Call</div>
                      <div className="text-xs text-gray-500">Oct 15, 2023 • 2:00 PM EST</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Investor Meet & Greet</div>
                      <div className="text-xs text-gray-500">Nov 5, 2023 • Austin, TX</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">2024 Strategy Presentation</div>
                      <div className="text-xs text-gray-500">Dec 10, 2023 • 11:00 AM EST</div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full text-sm">View All Events</Button>
                  </CardFooter>
                </Card>
                
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
              </div>
              
              {isSecuredInvestor && (
                <div className="grid grid-cols-1 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Investment Performance</CardTitle>
                      <CardDescription>Track the growth of your investment over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] flex items-center justify-center border border-dashed border-gray-200 rounded-md">
                        <div className="text-center">
                          <div className="mb-2 text-gray-500">Performance Chart</div>
                          <div className="text-sm text-gray-500">
                            Interactive chart showing investment growth would be displayed here
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Documents</CardTitle>
                    <CardDescription>Access your important investment documents</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10 9 9 9 8 9"/>
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Investment Agreement</div>
                          <div className="text-xs text-gray-500">PDF • 2.4 MB</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10 9 9 9 8 9"/>
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Quarterly Report (Q2 2023)</div>
                          <div className="text-xs text-gray-500">PDF • 5.7 MB</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10 9 9 9 8 9"/>
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Financial Projections</div>
                          <div className="text-xs text-gray-500">PDF • 3.1 MB</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full text-sm">View All Documents</Button>
                  </CardFooter>
                </Card>
                
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
              </div>
            </TabsContent>
            
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Documents</CardTitle>
                  <CardDescription>Access all documents related to your investment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="mb-4 text-gray-500">Documents Tab Content</div>
                    <div className="text-sm text-gray-500">
                      A complete list of investment documents would be displayed here
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {isSecuredInvestor && (
              <TabsContent value="financials">
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Information</CardTitle>
                    <CardDescription>Detailed financial data and reports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="mb-4 text-gray-500">Financials Tab Content</div>
                      <div className="text-sm text-gray-500">
                        Financial statements, projections, and analysis would be displayed here
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
            
            <TabsContent value="events">
              <Card>
                <CardHeader>
                  <CardTitle>Investor Events</CardTitle>
                  <CardDescription>Upcoming and past investor events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="mb-4 text-gray-500">Events Tab Content</div>
                    <div className="text-sm text-gray-500">
                      Calendar of investor events, calls, and meetings would be displayed here
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="updates">
              <Card>
                <CardHeader>
                  <CardTitle>Company Updates</CardTitle>
                  <CardDescription>Latest news and announcements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="mb-4 text-gray-500">Updates Tab Content</div>
                    <div className="text-sm text-gray-500">
                      Recent company news, press releases, and updates would be displayed here
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
