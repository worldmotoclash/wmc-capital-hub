
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const ContactSection: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent successfully. Our team will contact you shortly.");
    // Form would be cleared and data sent to backend in a real implementation
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 z-0"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Contact Us</h2>
            <p className="text-lg text-gray-600 text-balance">
              Interested in learning more about investing in World Moto Clash? Our team is ready to answer your questions.
            </p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
          >
            <h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</label>
                  <Input id="firstName" placeholder="John" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</label>
                  <Input id="lastName" placeholder="Doe" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                <Input id="email" type="email" placeholder="john@example.com" required />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone (Optional)</label>
                <Input id="phone" placeholder="+1 (123) 456-7890" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="investorType" className="text-sm font-medium text-gray-700">Investor Type</label>
                <select 
                  id="investorType" 
                  className="w-full rounded-md border border-gray-200 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                >
                  <option value="">Select Investor Type</option>
                  <option value="individual">Individual Investor</option>
                  <option value="institution">Institutional Investor</option>
                  <option value="vc">Venture Capital</option>
                  <option value="pe">Private Equity</option>
                  <option value="family">Family Office</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
                <Textarea id="message" placeholder="Please provide details about your investment interests..." required className="min-h-[120px]" />
              </div>
              
              <Button type="submit" className="w-full bg-black hover:bg-black/80 text-white">
                Send Message
              </Button>
            </form>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold mb-6">Investor Relations</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Phone</h4>
                    <p className="text-gray-600">+1 (888) 555-1234</p>
                    <p className="text-sm text-gray-500 mt-1">Monday - Friday, 9AM - 5PM EST</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Email</h4>
                    <p className="text-gray-600">investors@worldmotoclash.com</p>
                    <p className="text-sm text-gray-500 mt-1">We'll respond within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Headquarters</h4>
                    <p className="text-gray-600">100 Innovation Drive</p>
                    <p className="text-gray-600">Austin, TX 78701</p>
                    <p className="text-sm text-gray-500 mt-1">By appointment only</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-100 p-6 rounded-xl">
              <h4 className="text-lg font-semibold mb-4">Next Steps</h4>
              <p className="text-gray-600 mb-4">
                After contacting us, our investor relations team will:
              </p>
              <ol className="space-y-2 list-decimal list-inside text-gray-600">
                <li>Schedule an initial consultation</li>
                <li>Provide detailed investment documentation</li>
                <li>Arrange a meeting with our executive team</li>
                <li>Guide you through the investment process</li>
              </ol>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
