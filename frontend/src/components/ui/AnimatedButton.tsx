
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const AnimatedButton = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  className = ''
}: AnimatedButtonProps) => {

  const baseStyles = "px-6 py-3 rounded-xl font-semibold transition-all";
  const variantStyles = {
    primary: "bg-gradient-to-r from-purple-600 to blue-600 hover:from-purple-500 hover:to-blue-500",
    secondary: "glass hover:glass-strong"

  };
  return (
    <div className='flex justify-center'>
      {children}

    </div>
  )

}

