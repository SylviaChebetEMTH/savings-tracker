import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import type { User } from '../../service/interface';
import { api } from '../../service/dataService';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'username' | 'password'>('username');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUsernameSubmit = () => {
    setError('');
    
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    
    setStep('password');
  };

  const handlePasswordSubmit = async () => {
    setError('');

    if (!password.trim()) {
      setError('Password is required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const user = await api.login(username, password);
      onLogin(user);
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (step === 'username') {
        handleUsernameSubmit();
      } else {
        handlePasswordSubmit();
      }
    }
  };

  const handleBack = () => {
    setStep('username');
    setPassword('');
    setError('');
  };

  return (
    <div className="login-container">
      <div className="min-h-screen flex items-center justify-center bg-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-[1440px] bg-white overflow-hidden shadow-md h-[728px]">
          <div className="flex flex-col md:flex-row">

            <div
              className="relative hidden md:flex md:w-1/2 bg-cover bg-center"
              style={{
                height: "768px",
                backgroundImage: `url(/src/assets/loginpage/bg.png)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              {/* Logo at top left */}
              <div className="absolute top-8 left-8 z-10">
                <img
                  src="/src/assets/loginpage/logo.svg"
                  alt="GO BANK Logo"
                  className="h-16 w-auto"
                />
              </div>
            </div>

            {/* Right Panel - Login */}
            <div className="md:w-1/2 flex items-center justify-center bg-gray-50 p-8">
              <div className="w-full max-w-md overflow-visible">
                <div className="bg-white rounded-lg shadow-md p-8 relative border border-gray-300 overflow-visible">
                  {/* <img
                    src="/src/assets/loginpage/green-leaves-white-background.png"
                    alt=""
                    className="absolute -top-8 -right-8 w-24 h-24 object-contain"
                  /> */}

                  {/* Back button - only show on password step */}
                  {step === 'password' && (
                    <button
                      onClick={handleBack}
                      className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm"
                    >
                      <ArrowLeft size={16} />
                      Back
                    </button>
                  )}

                  <div className="text-left mb-8">
                    <p className="text-gray-600 text-sm mb-2">WELCOME TO</p>
                    <h1 className="text-3xl font-bold text-green-600 mb-1">Inua Mkulima -</h1>
                    <h2 className="text-3xl font-bold text-green-600">Subsidy Program</h2>
                  </div>

                  <div className="space-y-6">
                    
                
                    {step === 'username' && (
                      <div>
                        <p className='font-semibold mb-2'>Enter your username to continue</p>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => {
                            setUsername(e.target.value);
                            setError('');
                          }}
                          onKeyPress={handleKeyPress}
                          className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-green-600 focus:outline-none transition-colors"
                          placeholder="Enter your username"
                          autoFocus
                        />
                      </div>
                    )}

                    {/* Password Step */}
                    {step === 'password' && (
                      <>
                        <div className="bg-gray-50 px-4 py-2 rounded border border-gray-200">
                          <span className="text-sm text-gray-600">Username: </span>
                          <span className="text-sm font-medium text-gray-900">{username}</span>
                        </div>
                        
                        <div>
                          <p className='font-semibold mb-2'>Enter your password to continue</p>
                          <label className="block text-gray-700 text-sm font-medium mb-2">
                            Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={password}
                              onChange={(e) => {
                                setPassword(e.target.value);
                                setError('');
                              }}
                              onKeyPress={handleKeyPress}
                              className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-green-600 focus:outline-none transition-colors pr-12"
                              placeholder="Enter your password"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                          </div>
                        </div>
                      </>
                    )}

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                      </div>
                    )}

                    <button
                      onClick={step === 'username' ? handleUsernameSubmit : handlePasswordSubmit}
                      disabled={loading}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Signing in...' : 'Continue'}
                      {!loading && <span>→</span>}
                    </button>
                  </div>

                  <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Demo: emilys / emilyspass</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default LoginPage;