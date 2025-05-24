import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Invalid email or password');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-emerald-50 to-fuchsia-100 relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute w-80 h-80 rounded-full bg-gradient-to-tr from-blue-400 via-fuchsia-300 to-emerald-200 opacity-30 blur-2xl -top-32 -left-24 pointer-events-none" />
      <div className="absolute w-96 h-96 rounded-full bg-gradient-to-tr from-blue-100 via-emerald-200 to-fuchsia-300 opacity-20 blur-2xl -bottom-36 -right-28 pointer-events-none" />
      <div className="max-w-md w-full space-y-10 z-10">
        <div className="bg-white/95 p-10 rounded-3xl shadow-2xl border border-blue-100 flex flex-col items-center">
          {/* Logo */}
          <div className="w-16 h-16 mb-5 flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-emerald-400 shadow-lg">
            <svg width="36" height="36" fill="none" stroke="white" strokeWidth="2">
              <rect x="7" y="10" width="22" height="16" rx="5" />
              <path d="M13 17h10M13 21h6" />
            </svg>
          </div>
          <h2 className="text-center text-3xl font-extrabold text-blue-900 mb-2 tracking-tight">
            Log in to your account
          </h2>
          <p className="text-center text-base text-gray-500 mb-5">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700 underline transition">
              Register
            </Link>
          </p>

          {successMessage && (
            <div className="bg-emerald-100 border border-emerald-400 text-emerald-700 px-4 py-3 rounded-lg mb-3 w-full text-center animate-fadeIn">
              <span>{successMessage}</span>
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-3 w-full text-center animate-fadeIn">
              <span>{error}</span>
            </div>
          )}

          <form className="w-full space-y-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <label htmlFor="email-address" className="font-semibold text-gray-700 flex items-center gap-2">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4l7 6 7-6" /><rect x="2" y="4" width="14" height="10" rx="3"/></svg>
                Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="rounded-xl px-4 py-3 border border-blue-200 placeholder-gray-400 text-gray-900 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="font-semibold text-gray-700 flex items-center gap-2">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="8" width="10" height="6" rx="3"/><path d="M7 8V6a2 2 0 1 1 4 0v2"/></svg>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="rounded-xl px-4 py-3 border border-blue-200 placeholder-gray-400 text-gray-900 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="remember-me" className="block text-sm text-gray-600">
                Remember me
              </label>
              <span className="ml-auto text-sm text-gray-400 hover:text-blue-600 transition cursor-pointer">
                Forgot password?
              </span>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-xl text-lg font-bold bg-gradient-to-r from-blue-500 to-emerald-500 shadow-lg hover:scale-105 transition-all text-white
                ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg width="22" height="22" className="animate-spin" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="9" opacity="0.2"/>
                    <path d="M11 2a9 9 0 0 1 9 9" />
                  </svg>
                  Logging in...
                </span>
              ) : "Log in"}
            </button>
          </form>
        </div>
      </div> 
    </div>
    <Footer/>
    </div>
  );
};

export default Login;
