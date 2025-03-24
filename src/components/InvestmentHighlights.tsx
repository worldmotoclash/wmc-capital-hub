
import React from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

const InvestmentHighlights: React.FC = () => {
  return (
    <section id="investment" className="py-24 bg-black text-white relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-gray-800 to-transparent opacity-30 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-gray-800 to-transparent opacity-30 rounded-full blur-3xl transform translate-x-1/4 translate-y-1/4"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Investment Opportunity</h2>
            <p className="text-lg text-gray-300 text-balance">
              A unique opportunity to participate in the future of motorsport entertainment during our Series A funding round.
            </p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold mb-8">Financial Highlights</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-300">Series A Funding Target</span>
                  <span className="text-sm font-medium">$25M</span>
                </div>
                <Progress value={80} className="h-2 bg-gray-700" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-300">Current Valuation</span>
                  <span className="text-sm font-medium">$120M</span>
                </div>
                <Progress value={100} className="h-2 bg-gray-700" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-300">5-Year Revenue Projection</span>
                  <span className="text-sm font-medium">$350M</span>
                </div>
                <Progress value={65} className="h-2 bg-gray-700" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-300">Minimum Investment</span>
                  <span className="text-sm font-medium">$500K</span>
                </div>
                <Progress value={40} className="h-2 bg-gray-700" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold mb-8">Growth Trajectory</h3>
            
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h4 className="text-lg font-semibold mb-2">Year 1-2: Establishment Phase</h4>
                <p className="text-gray-300 text-sm">
                  Launch of inaugural championship across key markets, establishment of core media partnerships, and development of proprietary technology platform.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h4 className="text-lg font-semibold mb-2">Year 3-4: Expansion Phase</h4>
                <p className="text-gray-300 text-sm">
                  Global expansion to additional territories, secondary competition tiers, enhanced digital offerings, and merchandise scaling.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h4 className="text-lg font-semibold mb-2">Year 5+: Maturity Phase</h4>
                <p className="text-gray-300 text-sm">
                  Full global presence, licensing opportunities, expanded media rights portfolio, and potential strategic partnerships or acquisition opportunities.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="rounded-2xl p-8 bg-white/10 backdrop-blur-sm"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-4">Investment Benefits</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-white mt-1 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  <span>Priority access to premier hospitality at all events</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-white mt-1 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  <span>Exclusive investor events with teams and riders</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-white mt-1 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  <span>Early access to limited-edition merchandise</span>
                </li>
              </ul>
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-4">Exit Strategy</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-white mt-1 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  <span>Strategic acquisition by major sports/media conglomerate</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-white mt-1 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  <span>Public offering in 5-7 year timeframe</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-white mt-1 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  <span>Continued private growth with dividend distribution</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InvestmentHighlights;
