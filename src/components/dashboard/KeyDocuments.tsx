
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const KeyDocuments: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Documents</CardTitle>
        <CardDescription>Access your important documents</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center overflow-hidden">
              <img 
                src="/lovable-uploads/wmc-business-thumbnail.png" 
                alt="WMC Business Plan" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-sm font-medium dark:text-white">WMC March 2025 Business Plan</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">PDF • Google Drive</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-500 dark:text-gray-400" asChild>
            <a href="https://drive.google.com/file/d/1CxlugbtMGzRGZQWWPhbVRka65yIGjXJw/view?usp=sharing" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center overflow-hidden">
              <img 
                src="/lovable-uploads/sponsor-primier-thumbnail.png" 
                alt="Sponsorship Primer" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-sm font-medium dark:text-white">Sponsorship Primer (4.1.2025)</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">PDF • Google Drive</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-500 dark:text-gray-400" asChild>
            <a href="https://drive.google.com/file/d/1qTRq1r8IzM4kxtQA1rDhaWKN03JK6NNR/view?usp=drive_link" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center overflow-hidden">
              <img 
                src="/lovable-uploads/wmc-sizzle-thumbnail.png" 
                alt="WMC Sizzle Reel" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-sm font-medium dark:text-white">WMC 2 Minute Sizzle Reel</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Video • Vimeo</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-500 dark:text-gray-400" asChild>
            <a href="https://vimeo.com/1070513991?utm_source=email&utm_medium=vimeo-email&utm_campaign=44349" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full text-sm dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800" asChild>
          <Link to="/documents">View All Documents</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default KeyDocuments;
