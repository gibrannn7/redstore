import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({ 
  children, 
  className = '', 
  hover = false,
  padding = 'md'
}: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' } : {}}
      transition={{ duration: 0.2 }}
      className={`
        bg-white dark:bg-dark-surface
        border border-gray-200 dark:border-dark-border
        rounded-lg shadow-soft
        transition-all duration-200
        ${paddingStyles[padding]}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
