
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useUser, User } from '@/contexts/UserContext';
import PasswordResetDialog from './PasswordResetDialog';
import { validateLoginForm } from '@/utils/loginValidation';

const LoginFormComponent: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  
  const navigate = useNavigate();
  const { setUser } = useUser();
  
  // Track login activity by posting to the specified endpoint
  const trackLogin = async (contactId: string) => {
    try {
      const trackingEndpoint = "https://realintelligence.com/customers/expos/00D5e000000HEcP/exhibitors/engine/w2x-engine.php";
      
      const formData = new FormData();
      formData.append('sObj', 'ri__Portal__c');
      formData.append('string_ri__Contact__c', contactId);
      formData.append('text_ri__Login_URL__c', 'https://invest.worldmotoclash.com');
      formData.append('text_ri__Action__c', 'Login');
      
      console.log('Tracking login for contact ID:', contactId);
      console.log('Sending tracking data:', Object.fromEntries(formData.entries()));
      
      const response = await fetch(trackingEndpoint, {
        method: 'POST',
        body: formData,
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
          'Accept': '*/*',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      const responseText = await response.text();
      console.log('Login tracking response:', responseText);
      
      if (!response.ok) {
        console.warn('Login tracking request returned non-OK status:', response.status);
      }
      
    } catch (error) {
      // We don't want to disrupt the user experience if tracking fails
      console.error('Login tracking error:', error);
      
      // Log the attempt anyway for debugging
      console.log('Attempted to track login, but encountered an error');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { isValid, errors } = validateLoginForm(email, password);
    
    if (!isValid) {
      setErrors(errors);
      toast.error('Please correct the errors in the form');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Fetch investor data from the provided API
      const apiUrl = `https://api.realintelligence.com/api/specific-investor-list.py?orgId=00D5e000000HEcP&campaignId=7014V000002lcY2&sandbox=False`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch investor data');
      }
      
      const contentType = response.headers.get('content-type');
      let data;

      if (contentType?.includes('xml')) {
        // Parse XML response
        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'text/xml');
        const memberElements = xmlDoc.getElementsByTagName('member');
        
        data = Array.from(memberElements).map(member => ({
          id: member.getElementsByTagName('id')[0]?.textContent || '',
          email: member.getElementsByTagName('email')[0]?.textContent || '',
          ripassword: member.getElementsByTagName('ripassword')[0]?.textContent || '',
          name: member.getElementsByTagName('name')[0]?.textContent || '',
          status: member.getElementsByTagName('status')[0]?.textContent || '',
          phone: member.getElementsByTagName('phone')[0]?.textContent || '',
          mobile: member.getElementsByTagName('mobile')[0]?.textContent || '',
          mailingstreet: member.getElementsByTagName('mailingstreet')[0]?.textContent || ''
        }));
      } else {
        // Assume JSON response
        data = await response.json();
      }

      console.log('Parsed investor data:', data);
      
      // Find the investor by email (case-insensitive comparison)
      const investor = data.find((inv: any) => 
        inv.email && inv.email.toLowerCase() === email.toLowerCase()
      );
      
      console.log('Found investor:', investor);
      
      if (investor) {
        console.log(`Password comparison: '${password}' vs '${investor.ripassword}'`);
        
        // Check if password matches, handling potential undefined or null values
        if (investor.ripassword && password === investor.ripassword.toString()) {
          // Store user data
          const userData: User = {
            id: investor.id,
            name: investor.name,
            email: investor.email,
            status: investor.status,
            phone: investor.phone,
            mobile: investor.mobile,
            mailingstreet: investor.mailingstreet
          };
          
          setUser(userData);
          
          // Track the successful login
          await trackLogin(investor.id);
          
          toast.success('Login successful');
          navigate('/dashboard');
        } else {
          toast.error('Invalid password. Please try again.');
        }
      } else {
        toast.error('Email not found. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Investor Portal</h2>
        <p className="text-gray-600">
          Sign in to access exclusive investment materials
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Address
          </label>
          <Input 
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            className={`w-full ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <button 
              type="button" 
              onClick={() => setForgotPasswordOpen(true)}
              className="text-sm text-gray-600 hover:text-black transition-colors"
            >
              Forgot password?
            </button>
          </div>
          <Input 
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={`w-full ${errors.password ? 'border-red-500' : ''}`}
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)} 
          />
          <label
            htmlFor="remember"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600"
          >
            Remember me for 30 days
          </label>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-black hover:bg-black/80 text-white"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
      
      <div className="mt-8 text-center text-sm text-gray-600">
        <p>Don't have access? <a href="/#contact" className="text-black font-medium hover:underline">Contact us</a> to request investor credentials.</p>
      </div>
      
      {/* Password Reset Dialog */}
      <PasswordResetDialog 
        open={forgotPasswordOpen} 
        onOpenChange={setForgotPasswordOpen} 
      />
    </motion.div>
  );
};

export default LoginFormComponent;
