import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Mail, Lock, User } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, loginAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream to-rose-light px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Heart className="w-16 h-16 text-rose" fill="currentColor" />
          </div>
          <h1 className="text-4xl font-playfair font-bold text-charcoal mb-2">
            Our Moments
          </h1>
          <p className="text-gray-600">Simpan kenangan bersama selamanya</p>
        </div>

        <div className="card">
          <h2 className="text-2xl font-playfair font-bold text-center mb-6">
            Login
          </h2>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm mb-3">Atau</p>
            <button
              type="button"
              onClick={async () => {
                const result = await loginAsGuest();
                if (result.success) {
                  navigate('/dashboard');
                }
              }}
              disabled={loading}
              className="w-full px-6 py-2.5 border border-border rounded-lg text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Masuk sebagai Pelihat (Guest)
            </button>
          </div>

          <p className="text-sm text-gray-500 text-center mt-6">
            This is a private album. Contact admin for access.
          </p>
        </div>
      </div>
    </div>
  );
}
