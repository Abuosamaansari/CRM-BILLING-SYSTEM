import React, { useState } from 'react';

import { toast } from "react-toastify";
 import {verify} from '../Api/authApi';
import { useNavigate , useLocation } from 'react-router-dom';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
   
  const username = location.state?.username || "";

  const [formData, setFormData] = useState({
     username,
    otp: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
   

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await verify(formData);
      console.log('✅ OTP verified:', res);

      toast.success(res.message || "OTP sent successfully!");
            
      const token = res.token;
       sessionStorage.setItem("token", token)
        sessionStorage.setItem("user", JSON.stringify(res.user))
         sessionStorage.setItem('email', res.user.email);
         sessionStorage.setItem('id', res.user.id);

      navigate('/home');  
    } catch (err) {
      console.error('❌ OTP verification error:', err);
      setError(err?.response?.data?.error || 'Invalid OTP or username');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-orange-700">Verify OTP</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          

          <input
            name="otp"
            placeholder="Enter OTP"
            value={formData.otp}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
 <div className='flex gap-5 justify-between'>
 <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white font-semibold py-2 rounded-lg hover:bg-orange-700 transition duration-300"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <button
            type="submit"
            
            className="w-full bg-orange-600 text-white font-semibold py-2 rounded-lg hover:bg-orange-700 transition duration-300"
            onClick={()=> navigate('/login')}
          >
            Back
          </button>
 </div>
          
        </form>

        {error && (
          <p className="text-red-500 text-sm text-center mt-3">{error}</p>
        )}
      </div>
    </div>
  );
};

export default VerifyOtp;
