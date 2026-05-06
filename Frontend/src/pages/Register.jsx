import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  ShoppingBag,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  Sprout,
  Briefcase,
  Globe,
  ChevronRight,
  Users,
  Layers,
  CreditCard,
  Navigation
} from 'lucide-react';
const Register = () => {
  const [role, setRole] = useState('farmer'); // Removed leader rollcard per request[cite: 3]
  const [formData, setFormData] = useState({
  name: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',

  // Farmer Fields
  stateDistrict: '',
  fullLocation: '',
  aadhaar: '',
  gpsLocation: '',
  village: '',
  landSize: '',
  cropType: '',

  // Buyer Fields
  businessName: '',
  buyerType: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex w-12 h-12 bg-green-800 rounded-xl items-center justify-center shadow-lg shadow-green-100 mb-6">
          <Users className="text-white" size={24} />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Join the Collective</h2>
        <p className="mt-2 text-sm text-gray-500">Select your role to get started with AgriSangh[cite: 3]</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-10 shadow-xl shadow-gray-200/50 rounded-3xl border border-gray-100">
          {/* Role Selection[cite: 1, 3] */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => setRole('farmer')}
              className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${role === 'farmer' ? 'border-green-800 bg-green-50 text-green-800' : 'border-gray-100 bg-white text-gray-400'}`}
            >
              <User size={24} className="mb-2" />
              <span className="text-xs font-bold uppercase">Farmer</span>
            </button>
            <button
              onClick={() => setRole('buyer')}
              className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${role === 'buyer' ? 'border-green-800 bg-green-50 text-green-800' : 'border-gray-100 bg-white text-gray-400'}`}
            >
              <ShoppingBag size={24} className="mb-2" />
              <span className="text-xs font-bold uppercase">Buyer</span>
            </button>
          </div>

          <form className="space-y-4">
            <div className="space-y-4 mb-6">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input name="name" placeholder="Full Name" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-800" onChange={handleInputChange} />
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input name="phone" placeholder="Phone Number" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-800" onChange={handleInputChange} />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-800"
                    onChange={handleInputChange}
                />
                </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={role}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4 border-l-2 border-green-800/20 pl-4 py-2"
              >
                {role === 'farmer' ? (
                  <>
                    <div className="relative"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input name="village" placeholder="Village Name" className="w-full pl-11 py-3 bg-gray-50 border border-gray-200 rounded-xl" onChange={handleInputChange} /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative"><Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} /><input name="landSize" placeholder="Acres" className="w-full pl-10 py-3 bg-gray-50 border border-gray-200 rounded-xl" onChange={handleInputChange} /></div>
                      <div className="relative"><Sprout className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} /><input name="cropType" placeholder="Crop" className="w-full pl-10 py-3 bg-gray-50 border border-gray-200 rounded-xl" onChange={handleInputChange} /></div>
                    </div>
                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        
                        <input
                            name="stateDistrict"
                            placeholder="State / District"
                            className="w-full pl-11 py-3 bg-gray-50 border border-gray-200 rounded-xl"
                            onChange={handleInputChange}
                        />
                        </div>

                        <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        
                        <input
                            name="fullLocation"
                            placeholder="Full Location"
                            className="w-full pl-11 py-3 bg-gray-50 border border-gray-200 rounded-xl"
                            onChange={handleInputChange}
                        />
                        </div>

                        <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        
                        <input
                            name="aadhaar"
                            placeholder="Aadhaar Number"
                            className="w-full pl-11 py-3 bg-gray-50 border border-gray-200 rounded-xl"
                            onChange={handleInputChange}
                        />
                        </div>

                        <div className="relative">
                        <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        
                        <input
                            name="gpsLocation"
                            placeholder="GPS Location"
                            className="w-full pl-11 py-3 bg-gray-50 border border-gray-200 rounded-xl"
                            onChange={handleInputChange}
                        />
                        </div>
                  </>
                ) : (
                  <>
                    <div className="relative"><Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input name="businessName" placeholder="Business Name" className="w-full pl-11 py-3 bg-gray-50 border border-gray-200 rounded-xl" onChange={handleInputChange} /></div>
                    <div className="relative"><Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input name="buyerType" placeholder="Buyer Type (e.g. Retail)" className="w-full pl-11 py-3 bg-gray-50 border border-gray-200 rounded-xl" onChange={handleInputChange} /></div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="space-y-4">

                {/* Password */}
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                    <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Set Password"
                    className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-800"
                    onChange={handleInputChange}
                    />

                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                    <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-800"
                    onChange={handleInputChange}
                    />

                    <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                </div>

            <button className="w-full bg-green-800 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-green-900 shadow-lg shadow-green-100 flex items-center justify-center gap-2 transition-all">
              Complete Registration <ChevronRight size={18} />
            </button>

            <p className="text-center text-sm text-gray-500 pt-4">
              Already have an account? <Link to="/login" className="text-green-800 font-bold hover:underline">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;