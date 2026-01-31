
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
    primary: `bg-gradient-to-r from-sky-500 to-blue-600 
    hover:from-purple-500 hover:to-blue-500 
    text-white 
    shadow-blue-500/20 
    hover:shadow-purple-500/40 
    active:scale-[0.98]`,
    secondary: "glass hover:glass-strong"

  };
  return (
 <motion.button type={type}
 onClick={onClick}
 whileTap={{scale:0.96}}
 whileHover={{scale:1.02}}
 className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
{children}
 </motion.button>
  )

}

