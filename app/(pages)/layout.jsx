"use client"
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for navigation

const InnerPageLayout = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');

    // If no token found, redirect to login page
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <>
      {children}
    </>
  );
};

export default InnerPageLayout;
