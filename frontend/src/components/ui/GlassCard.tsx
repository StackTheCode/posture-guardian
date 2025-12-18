import {hover, motion} from 'framer-motion'
import type { ReactNode } from 'react';

interface GlassCardProps{
    children:ReactNode;
    className?:string;
    hover?:boolean;
}

export const GlassCard = ({ children, className = '', hover = true }: GlassCardProps) => {
return (
    {children}
)

}