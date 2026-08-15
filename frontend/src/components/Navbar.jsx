import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Upload, Calendar, BookOpen, LogOut, Home, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout, loginAsGuest, isAuthenticated, isGuest } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/dashboard');
  };

  const handleGuestLogin = async () => {
    const result = await loginAsGuest();
    if (result.success) {
      navigate('/dashboard');
    }
  };

  // Guest nav items (public)
  const guestNavItems = [
    { path: '/dashboard', label: 'Home', icon: Home },
    { path: '/gallery', label: 'Gallery', icon: Heart },
    { path: '/milestones', label: 'Milestones', icon: Calendar },
    { path: '/notes', label: 'Notes', icon: BookOpen },
  ];

  // Logged-in user nav items
  const userNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/gallery', label: 'Gallery', icon: Heart },
    { path: '/upload', label: 'Upload', icon: Upload },
    { path: '/milestones', label: 'Milestones', icon: Calendar },
    { path: '/notes', label: 'Notes', icon: BookOpen },
  ];

  const navItems = (isAuthenticated || isGuest) ? userNavItems : guestNavItems;

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Heart className="w-6 h-6 text-rose" fill="currentColor" />
              <span className="font-playfair text-xl font-semibold">Our Moments</span>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 transition-colors ${
                    isActive 
                      ? 'text-rose font-medium' 
                      : 'text-gray-600 hover:text-rose'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}

            <div className="flex items-center space-x-3 pl-6 border-l border-border">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-600">{user?.username}</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-rose transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : isGuest ? (
                <>
                  <span className="text-sm text-gray-600">Pelihat</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-rose transition-colors"
                    title="Keluar dari mode pelihat"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-rose text-white rounded-lg hover:bg-rose-dark transition-colors"
                  >
                    Login
                  </Link>
                  <button
                    onClick={handleGuestLogin}
                    className="px-4 py-2 border border-border rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Masuk sebagai Pelihat
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
