"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { decryptText, encryptText } from "@/utils/encryption";
import toast, { Toaster } from "react-hot-toast";
import GlobalApi from "../_services/GlobalApi";
import Link from "next/link";
import { Eye, EyeOff, Calendar, User, Lock, ArrowRight, Heart } from "lucide-react";

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [inviteUserId, setInviteUserId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      
      if (searchParams.has('userId')) {        
        const encryptedUserId = searchParams.get('userId');
        console.log("encryptedUserId", encryptedUserId)
        const decryptedUserId = decryptText(encryptedUserId);
        console.log("decryptedUserId", decryptedUserId)

        if (decryptedUserId) {
            setInviteUserId(decryptedUserId);
        }
      }
    }
  }, []); 

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }
    
    const birthDate = new Date(data.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const ageCheck = today.setFullYear(1970) > birthDate.setFullYear(1970);

    if (age < 18 || (age === 18 && ageCheck)) {
      toast.error("You must be at least 18 years old");
      return;
    }
    
    const encryptedPassword = encryptText(data.password);
    data.password = encryptedPassword;

    try {
      setIsLoading(true);
      const response = await GlobalApi.CreateUser(data);

      if (response.status === 201) {
        const { token } = response.data.data;
        localStorage.setItem("token", token);
        reset();

        if(inviteUserId){
          await GlobalApi.SaveInvitation(inviteUserId, token);
        }

        toast.success("Account created successfully!");
        router.push("/tests");
      } else {
        const errorMessage = response.data?.message || "Failed to create account.";
        toast.error(`Error: ${errorMessage}`);
      }
    } catch (err) {
      if (err.response) {
        toast.error(`Error: ${err.response.data.message || err.message}`);
      } else {
        toast.error(`Error: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const encryptedInviteUserId = inviteUserId ? encryptText(inviteUserId) : "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-400 to-red-500 p-4">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '8px',
          },
        }}
      />
      
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
        <div className="text-center mb-6">
          <div className="flex justify-center items-center">
            <Heart className="w-10 h-10 text-red-500 mr-2" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-red-600 bg-clip-text text-transparent">Qoupled</h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mt-4">Create Your Account</h2>
          <p className="text-gray-500 text-sm mt-1">Find your perfect match</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="username"
                name="username"
                className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-200"
                placeholder="Enter your username"
                required
                {...register("username")}
              />
            </div>
          </div>
          
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                  pattern: {
                    value: /(?=.*[!@#$%^&*])/,
                    message: "Password must contain at least one special character",
                  },
                })}
                className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-200"
                placeholder="Create a strong password"
                required
              />
              <button 
                type="button" 
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                {...register("confirmPassword")}
                className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-200"
                placeholder="Confirm your password"
                required
              />
              <button 
                type="button" 
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="birthDate">
              Date of Birth
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                {...register("birthDate")}
                className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">You must be at least 18 years old</p>
          </div>
          
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              {...register("gender")}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-200"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-rose-500 to-red-600 text-white font-semibold p-3 rounded-xl hover:from-rose-600 hover:to-red-700 transition duration-300 flex items-center justify-center"
            style={{
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {isLoading ? "Creating Account..." : "Sign Up"} 
            {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
          </button>
          
          <div className="text-center text-sm mt-4">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href={inviteUserId ? `/login?userId=${encryptedInviteUserId}` : '/login'}
                className="text-red-500 font-semibold hover:text-red-600 transition-colors"
              >
                Log In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;