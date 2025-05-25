import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-100 via-emerald-50 to-fuchsia-100 border-t border-blue-200 w-full">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col sm:flex-row justify-between items-center gap-8">
        {/* Company Info */}
        <div className="flex flex-col items-center sm:items-start">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-400 shadow">
              <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2">
                <rect x="6" y="9" width="16" height="10" rx="5"/>
                <path d="M11 16h6" />
              </svg>
            </span>
            <span className="text-xl font-bold text-blue-700 tracking-tight">Achievement Manager</span>
          </div>
          <span className="text-gray-500 text-sm mb-2">
            &copy; {new Date().getFullYear()} Achievement Manager.<br />
            All rights reserved.
          </span>
          <span className="text-gray-400 text-xs text-center sm:text-left">
            Get inspired. Achieve. Share your progress.
          </span>
        </div>
        {/* Navigation & Contacts */}
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="flex flex-col gap-1 items-center sm:items-end">
            <span className="font-semibold text-blue-900">Navigation</span>
            <Link to="/dashboard" className="text-blue-500 hover:underline text-sm">Dashboard</Link>
            <Link to="/goals" className="text-blue-500 hover:underline text-sm">Goals</Link>
            <Link to="/templates" className="text-blue-500 hover:underline text-sm">Templates</Link>
            <Link to="/profile" className="text-blue-500 hover:underline text-sm">My Profile</Link>
          </div>
          <div className="flex flex-col gap-1 items-center sm:items-end">
            <span className="font-semibold text-blue-900">About</span>
            <span className="text-sm text-gray-500">Contact: support@achieve.com</span>
            <span className="text-sm text-gray-500">Astana, Kazakhstan</span>
            <span className="text-sm text-gray-400">Made with love ♥</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
