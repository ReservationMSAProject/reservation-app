import React from 'react';
import { motion } from 'framer-motion';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  className = '',
  onClick,
  ...props 
}) {
  const baseClasses = "relative overflow-hidden font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ripple";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 focus:ring-primary-500 shadow-lg hover:shadow-xl",
    secondary: "bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 focus:ring-accent-500 shadow-lg hover:shadow-xl",
    success: "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 focus:ring-green-500 shadow-lg hover:shadow-xl",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500 shadow-lg hover:shadow-xl",
    outline: "border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white focus:ring-primary-500",
    ghost: "text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 focus:ring-primary-500",
    glass: "glass text-white backdrop-blur-md hover:backdrop-blur-lg",
    neo: "neo-button text-gray-800 dark:text-gray-200"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-xl",
    xl: "px-10 py-5 text-xl rounded-2xl"
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${
    disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
  }`;

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
}

export function Input({ 
  label, 
  error, 
  className = '', 
  type = 'text',
  ...props 
}) {
  return (
    <div className="relative">
      <input
        type={type}
        className={`
          peer w-full px-4 py-3 bg-white/10 dark:bg-gray-800/50 border border-gray-300/30 dark:border-gray-600/30 
          rounded-xl backdrop-blur-md focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 
          transition-all duration-300 placeholder-transparent focus-glow
          ${className}
        `}
        placeholder={label}
        {...props}
      />
      <label className="
        absolute left-4 -top-2.5 px-2 text-sm font-medium text-gray-600 dark:text-gray-300 
        bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-md
        peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
        peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-placeholder-shown:bg-transparent
        peer-focus:-top-2.5 peer-focus:left-4 peer-focus:text-sm peer-focus:text-primary-500
        peer-focus:bg-white/80 dark:peer-focus:bg-gray-800/80
        transition-all duration-300 cursor-text
      ">
        {label}
      </label>
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

export function Card({ 
  children, 
  className = '', 
  hover = true,
  glass = false,
  ...props 
}) {
  const baseClasses = "rounded-2xl transition-all duration-300";
  const glassClasses = glass ? "glass" : "bg-white dark:bg-gray-800 shadow-lg";
  const hoverClasses = hover ? "hover:shadow-2xl hover:scale-105" : "";
  
  return (
    <motion.div
      whileHover={hover ? { y: -5 } : {}}
      className={`${baseClasses} ${glassClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Modal({ isOpen, show, onClose, children, title }) {
  const modalOpen = isOpen || show;
  if (!modalOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-lg glass rounded-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            {title}
          </h2>
        )}
        {children}
      </motion.div>
    </motion.div>
  );
}

export function Badge({ children, variant = 'primary', className = '' }) {
  const variants = {
    primary: "bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300",
    secondary: "bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300",
    success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
  };

  return (
    <span className={`
      inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
      ${variants[variant]} ${className}
    `}>
      {children}
    </span>
  );
}

export function Skeleton({ className = '', ...props }) {
  return (
    <div 
      className={`skeleton rounded-lg ${className}`}
      {...props}
    />
  );
}

export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`${sizes[size]} ${className}`}>
      <div className="relative w-full h-full">
        <div className="absolute inset-0 border-4 border-primary-200 dark:border-primary-800 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
