'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // Default options
        duration: 4000,
        style: {
          background: '#fff',
          color: '#000',
          padding: '16px',
          borderRadius: '3px',
          border: '2px solid #000',
          fontWeight: '600',
          fontSize: '14px',
        },
        // Success
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
          style: {
            background: '#ecfdf5',
            border: '2px solid #10b981',
            boxShadow: '4px 4px 0px #10b981',
          },
        },
        // Error
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
          style: {
            background: '#fef2f2',
            border: '2px solid #ef4444',
            boxShadow: '4px 4px 0px #ef4444',
          },
        },
        // Loading
        loading: {
          iconTheme: {
            primary: '#3b82f6',
            secondary: '#fff',
          },
          style: {
            background: '#eff6ff',
            border: '2px solid #3b82f6',
            boxShadow: '4px 4px 0px #3b82f6',
          },
        },
      }}
    />
  );
}
