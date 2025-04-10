import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';

const Documents: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const ndaSigned = user?.ndaSigned || false;

  React.useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Redirect if no user is logged in
    if (!user) {
      toast.error('Please log in to access documents');
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

  // Define base documents that are always available
  const baseDocuments = [
    {
      title: "WMC Investor Intro Deck 2025", // Updated title
      type: "PDF",
      source: "Google Drive",
      thumbnail: "/lovable-uploads/sponsor-primier-thumbnail.png",
      url: "https://drive.google.com/file/d/1qK-8zJAQWpzQTrpmYYckd3g4cwy2PyFh/view?usp=drive_link"
    },
    {
      title: "WMC 2 Minute Sizzle Reel",
      type: "Video",
      source: "Vimeo",
      thumbnail: "/lovable-uploads/wmc-sizzle-thumbnail.png",
      url: "https://vimeo.com/1070513991?utm_source=email&utm_medium=vimeo-email&utm_campaign=44349"
    }
  ];

  // Update the blankNdaDocument with the new image path
  const blankNdaDocument = {
    title: "WMC NDA 2025 (Blank)",
    type: "DOCX",
    source: "Secure Storage",
    thumbnail: "/lovable-uploads/blank-nda.png", // Updated thumbnail
    url: "/lovable-uploads/wmc-nda-2025-blank.docx" // Updated file path with hyphen
  };
  
  // Update the signed NDA document to use the new image
  const ndaDocuments = [
    {
      title: "WMC March 2025 Business Plan",
      type: "PDF",
      source: "Google Drive",
      thumbnail: "/lovable-uploads/wmc-business-thumbnail.png",
      url: "https://drive.google.com/file/d/1CxlugbtMGzRGZQWWPhbVRka65yIGjXJw/view?usp=sharing"
    },
    {
      title: "Signed NDA Document",
      type: "DOCX",
      source: "Secure Storage",
      thumbnail: "/lovable-uploads/we-signed-an-nda.png", // Updated thumbnail
      url: "/lovable-uploads/wmc-nda-2025-blank.docx" // Updated file path with hyphen
    }
  ];

  // Combine documents based on NDA status
  const documents = ndaSigned 
    ? [...ndaDocuments, ...baseDocuments] 
    : [...baseDocuments, blankNdaDocument];

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
          <h1 className="text-3xl font-bold mb-2">Documents</h1>
          <p className="text-gray-600 mb-8">
            Access all your important investment documents
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {documents.map((doc, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="w-full h-32 bg-gray-100 rounded mb-4 flex items-center justify-center overflow-hidden">
                    <img 
                      src={doc.thumbnail} 
                      alt={doc.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{doc.title}</h3>
                      <p className="text-sm text-gray-500">{doc.type} • {doc.source}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-500" asChild>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
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

export default Documents;
