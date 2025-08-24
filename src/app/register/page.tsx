"use client";

import Link from "next/link";
import { useState } from "react";
import Header from "@/components/Header";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        
        // Redirect or show success message
        console.log("Form submitted successfully", formData);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-md shadow-md">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-black">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-stone-600">
              Or{" "}
              <Link href="/login" className="font-medium text-black hover:text-stone-700">
                sign in to your existing account
              </Link>
            </p>
          </div>
          
          {submitSuccess ? (
            <div className="bg-stone-100 border border-stone-200 rounded-md p-4 text-center">
              <p className="text-black font-medium">Registration successful!</p>
              <p className="text-stone-600 mt-1">You can now sign in to your account.</p>
              <Link href="/login" 
                className="mt-4 inline-block bg-black text-white px-4 py-2 rounded-md hover:bg-stone-700 transition-colors">
                Go to login
              </Link>
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`appearance-none relative block w-full px-3 py-2 border ${
                        errors.firstName ? 'border-red-300' : 'border-stone-300'
                      } placeholder-stone-400 text-black rounded-md focus:outline-none focus:ring-stone-500 focus:border-stone-500 focus:z-10 sm:text-sm`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`appearance-none relative block w-full px-3 py-2 border ${
                        errors.lastName ? 'border-red-300' : 'border-stone-300'
                      } placeholder-stone-400 text-black rounded-md focus:outline-none focus:ring-stone-500 focus:border-stone-500 focus:z-10 sm:text-sm`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`appearance-none relative block w-full px-3 py-2 border ${
                      errors.email ? 'border-red-300' : 'border-stone-300'
                    } placeholder-stone-400 text-black rounded-md focus:outline-none focus:ring-stone-500 focus:border-stone-500 focus:z-10 sm:text-sm`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`appearance-none relative block w-full px-3 py-2 border ${
                      errors.password ? 'border-red-300' : 'border-stone-300'
                    } placeholder-stone-400 text-black rounded-md focus:outline-none focus:ring-stone-500 focus:border-stone-500 focus:z-10 sm:text-sm`}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`appearance-none relative block w-full px-3 py-2 border ${
                      errors.confirmPassword ? 'border-red-300' : 'border-stone-300'
                    } placeholder-stone-400 text-black rounded-md focus:outline-none focus:ring-stone-500 focus:border-stone-500 focus:z-10 sm:text-sm`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                    isSubmitting ? 'bg-stone-500' : 'bg-black hover:bg-stone-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 transition-colors`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating your account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>
          )}
          
          <div className="text-sm text-center mt-4">
            <p className="text-stone-500">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-black hover:text-stone-700">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-black hover:text-stone-700">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
