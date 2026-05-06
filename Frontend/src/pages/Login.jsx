import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Lock, Eye, EyeOff, Users } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '',
    phone: '',
    password: ''
    });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex w-12 h-12 bg-green-800 rounded-xl items-center justify-center shadow-lg shadow-green-100 mb-6">
          <Users className="text-white" size={24} />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
        <p className="mt-2 text-sm text-gray-500">Login to your AgriSangh account</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-10 shadow-xl shadow-gray-200/50 rounded-3xl border border-gray-100">
          <form className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1"> Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Enter your details"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-800 focus:border-transparent outline-none transition-all"
                  onChange={(e) => setFormData({...formData, identifier: e.target.value})}
                />
              </div>
            </div>

            <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">
                    Phone Number
                </label>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Phone size={18} />
                    </div>

                    <input
                    type="tel"
                    placeholder="Enter phone number"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-800 focus:border-transparent outline-none transition-all"
                    onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                    }
                    />
                </div>
                </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-800 focus:border-transparent outline-none transition-all"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-green-800 focus:ring-green-800 h-4 w-4" />
                <span className="text-gray-500 font-medium">Remember me</span>
              </label>
              <a href="#" className="font-bold text-green-800 hover:underline">Forgot Password?</a>
            </div>

            <button className="w-full bg-green-800 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-green-900 shadow-lg shadow-green-100 transition-all">
              Login Account
            </button>

            <p className="text-center text-sm text-gray-500 pt-4">
              New to AgriSangh? <Link to="/register" className="text-green-800 font-bold hover:underline">Create Account</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;