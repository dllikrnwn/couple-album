import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Upload, Calendar, BookOpen, LogOut, Home, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, logout, loginAsGuest, isAuthenticated, isGuest } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/dashboard');
  };

  const handleGuestLogin = async () => {
    const result = await loginAsGuest();
    if (result.success) {
      setOpen(false);
      navigate('/dashboard');
    }
  };

  const guestNavItems = [
    { path: '/dashboard', label: 'Home', icon: Home },
    { path: '/gallery', label: 'Gallery', icon: Heart },
    { path: '/milestones', label: 'Milestones', icon: Calendar },
    { path: '/notes', label: 'Notes', icon: BookOpen },
  ];

  const userNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/gallery', label: 'Gallery', icon: Heart },
    { path: '/upload', label: 'Upload', icon: Upload },
    { path: '/calendar', label: 'Kalender', icon: Calendar },
    { path: '/milestones', label: 'Milestones', icon: Calendar },
    { path: '/notes', label: 'Notes', icon: BookOpen },
  ];

  const navItems = (isAuthenticated || isGuest)
    ? userNavItems.filter((i) => !(isGuest && i.path === '/calendar'))
    : guestNavItems;

  const isActive = (path) => location.pathname === path;

  const profileBlock = isAuthenticated ? (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 truncate max-w-[120px]">{user?.username}</span>
      <button onClick={handleLogout} className="text-gray-600 hover:text-rose transition-colors" title="Logout">
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  ) : isGuest ? (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Pelihat</span>
      <button onClick={handleLogout} className="text-gray-600 hover:text-rose transition-colors" title="Keluar">
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <Link to="/login" className="px-4 py-2 bg-rose text-white rounded-lg hover:bg-rose-dark transition-colors whitespace-nowrap">
        Login
      </Link>
      <button onClick={handleGuestLogin} className="px-3 py-2 border border-border rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm whitespace-nowrap">
        Pelihat
      </button>
    </div>
  );

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2" onClick={() => setOpen(false)}>
              <Heart className="w-6 h-6 text-rose" fill="currentColor" />
              <span className="font-playfair text-xl font-semibold">Our Moments</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 transition-colors ${
                    isActive(item.path) ? 'text-rose font-medium' : 'text-gray-600 hover:text-rose'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="flex items-center pl-4 border-l border-border">{profileBlock}</div>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-3">
            {profileBlock}
            <button onClick={() => setOpen(!open)} className="text-gray-600 hover:text-rose transition-colors" aria-label="Menu">
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-white">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                    isActive(item.path) ? 'bg-rose-light/20 text-rose font-medium' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
