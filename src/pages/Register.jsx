import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Minimum 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setApiError('');
    try {
      const { success, message } = await register({
        username: formData.username,
        email: formData.email,
        hashed_password: formData.password,
      });
      if (success) {
        navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
      } else {
        setApiError(message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setApiError('Connection error. Please try again.');
      console.error('Registration error:', error);
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
        
        <div className="max-w-md w-full z-10">
          <div className="bg-white/95 p-10 rounded-3xl shadow-2xl border border-blue-100 flex flex-col items-center space-y-6">
            {/* Logo/icon */}
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-emerald-400 shadow-lg mb-3">
              <svg width="36" height="36" fill="none" stroke="white" strokeWidth="2">
                <rect x="7" y="10" width="22" height="16" rx="5" />
                <path d="M13 17h10M13 21h6" />
              </svg>
            </div>
            <h2 className="text-center text-3xl font-extrabold text-blue-900 mb-2 tracking-tight">
              Create an account
            </h2>
            <p className="text-center text-base text-gray-500 mb-4">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 underline transition">
                Log in
              </Link>
            </p>
            {apiError && (
              <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-2 text-center animate-fadeIn">
                {apiError}
              </div>
            )}

            <form className="w-full space-y-5" onSubmit={handleSubmit} autoComplete="off">
              <div>
                <label htmlFor="username" className="font-semibold text-gray-700 flex items-center gap-2 mb-1">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="9" r="7" /><path d="M6 14v-1a3 3 0 0 1 6 0v1" /></svg>
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className={`rounded-xl px-4 py-3 border ${errors.username ? "border-red-400" : "border-blue-200"} placeholder-gray-400 text-gray-900 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition w-full`}
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>
              <div>
                <label htmlFor="email" className="font-semibold text-gray-700 flex items-center gap-2 mb-1">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4l7 6 7-6" /><rect x="2" y="4" width="14" height="10" rx="3"/></svg>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`rounded-xl px-4 py-3 border ${errors.email ? "border-red-400" : "border-blue-200"} placeholder-gray-400 text-gray-900 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition w-full`}
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="password" className="font-semibold text-gray-700 flex items-center gap-2 mb-1">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="8" width="10" height="6" rx="3"/><path d="M7 8V6a2 2 0 1 1 4 0v2"/></svg>
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`rounded-xl px-4 py-3 border ${errors.password ? "border-red-400" : "border-blue-200"} placeholder-gray-400 text-gray-900 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition w-full`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="font-semibold text-gray-700 flex items-center gap-2 mb-1">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l6 6M6 12L12 6" /></svg>
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`rounded-xl px-4 py-3 border ${errors.confirmPassword ? "border-red-400" : "border-blue-200"} placeholder-gray-400 text-gray-900 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition w-full`}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-xl text-lg font-bold bg-gradient-to-r from-blue-500 to-emerald-500 shadow-lg hover:scale-105 transition-all text-white mt-3
                  ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg width="22" height="22" className="animate-spin" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="9" opacity="0.2"/>
                      <path d="M11 2a9 9 0 0 1 9 9" />
                    </svg>
                    Creating...
                  </span>
                ) : "Register"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Register;
