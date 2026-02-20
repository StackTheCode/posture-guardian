import { motion } from 'framer-motion'
import type { ReactNode } from 'react';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
}

export const GlassCard = ({ children, className = '', hover = true }: GlassCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={hover ? { scale: 1.02 } : {}}
            className={`glass-strong rounded-2xl p-6 shadow-2xl ${className}`}
        >
            {children}
        </motion.div>
    );

}