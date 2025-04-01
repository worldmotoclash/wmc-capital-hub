
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: {email?: string; password?: string} = {};
    let isValid = true;

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
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
      
      const data = await response.json();
      
      // Find the investor by email
      const investor = data.find((inv: any) => inv.email === email);
      
      if (investor && investor.ripassword === password) {
        toast.success('Login successful');
        navigate('/dashboard');
      } else {
        toast.error('Invalid credentials. Please try again.');
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
            <a href="#" className="text-sm text-gray-600 hover:text-black transition-colors">
              Forgot password?
            </a>
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
        <p>Don't have access? <a href="#contact" className="text-black font-medium hover:underline">Contact us</a> to request investor credentials.</p>
      </div>
    </motion.div>
  );
};

export default LoginForm;
