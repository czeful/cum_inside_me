import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Achievement Manager</h1>
            </div>
            <Link 
              to="/dashboard" 
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link 
              to="/goals" 
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Goals
            </Link>
            <Link to="/profile" className="...">My Profile</Link>
            <Link to="/friends" className='...' >Friends</Link>
            <Link to="/friend-requests" className='...'>Friend Requests</Link>

          </div>
          <div className="flex items-center">
            <span className="mr-4 text-gray-700">Welcome, {user?.Username || user.Email || 'User'}</span>
            <button
              onClick={logout}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
