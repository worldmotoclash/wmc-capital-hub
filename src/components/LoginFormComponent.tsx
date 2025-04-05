
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useUser } from '@/contexts/UserContext';
import PasswordResetDialog from './PasswordResetDialog';
import { validateLoginForm } from '@/utils/loginValidation';
import LoginFormFields from './LoginForm/LoginFormFields';
import { authenticateUser } from '@/services/loginService';

const LoginFormComponent: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [ipVerificationSent, setIpVerificationSent] = useState(false);
  
  const navigate = useNavigate();
  const { setUser } = useUser();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { isValid, errors } = validateLoginForm(email, password);
    
    if (!isValid) {
      setErrors(errors);
      toast.error('Please correct the errors in the form');
      return;
    }
    
    setIsLoading(true);
    setIpVerificationSent(false);
    
    try {
      const userData = await authenticateUser(email, password);
      
      if (userData) {
        setUser(userData);
        toast.success('Login successful');
        navigate('/dashboard');
      } else {
        // Check if this was likely an IP verification issue
        if (email && password.length >= 6) {
          setIpVerificationSent(true);
        }
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
      
      {ipVerificationSent ? (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6">
          <h3 className="font-medium text-amber-800 mb-2">Location Verification Required</h3>
          <p className="text-amber-700 text-sm">
            We detected a login attempt from a new location. For your security, we've sent a verification 
            email to your registered email address with details about the new location. 
            Please check your inbox and follow the verification instructions.
          </p>
        </div>
      ) : null}
      
      <LoginFormFields 
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        rememberMe={rememberMe}
        setRememberMe={setRememberMe}
        errors={errors}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onForgotPassword={() => setForgotPasswordOpen(true)}
      />
      
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
