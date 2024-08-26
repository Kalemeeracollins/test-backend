'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    repassword: '',
    country: '',
    upline: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const validate = () => {
    let tempErrors = {};
    if (!formData.username) tempErrors.username = 'Username is required';
    if (!formData.email) tempErrors.email = 'Email is required';
    if (!formData.phone) tempErrors.phone = 'Phone number is required';
    if (!formData.password) tempErrors.password = 'Password is required';
    if (formData.password !== formData.repassword)
      tempErrors.repassword = 'Passwords do not match';
    if (!formData.country) tempErrors.country = 'Country code is required';
    if (!formData.upline) tempErrors.upline = 'Upline is required';
    return tempErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear specific error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}register`,
        formData
      );
      setSuccessMessage('Signup successful!');
      setTimeout(() => {
        router.push('/login'); // Redirect to login page after successful signup
      }, 2000);
    } catch (error) {
      setErrors({ api: error.response ? error.response.data.message : 'An error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        {successMessage && (
          <div className="mb-4 text-green-600 text-center">
            {successMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div>
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
          <div>
            <input
              type="password"
              name="repassword"
              placeholder="Re-enter Password"
              value={formData.repassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.repassword ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.repassword && (
              <p className="text-red-500 text-sm">{errors.repassword}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="country"
              placeholder="Country Code"
              value={formData.country}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.country ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
          </div>
          <div>
            <input
              type="text"
              name="upline"
              placeholder="Upline"
              value={formData.upline}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.upline ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.upline && <p className="text-red-500 text-sm">{errors.upline}</p>}
          </div>
          {errors.api && (
            <p className="text-red-500 text-center text-sm">{errors.api}</p>
          )}
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}
