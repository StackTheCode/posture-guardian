import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../services/api';
import { motion } from 'framer-motion';
import { AnimatedButton } from '../components/ui/AnimatedButton';
import { Eye, EyeOff, Mail, User, Lock } from 'lucide-react';


const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password != confirmPassword) {
            setError('Passwords do not  match')
            return
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
        }
        setLoading(true);
        try {
            const response = await authApi.register(username, email, password);
            login(response.data.token, response.data.username, response.data.email);
            navigate('/dashboard');


        } catch (error: any) {
            setError(error.response?.data?.message || 'Registration failed');

        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-strong rounded-3xl p-8 md:p-12 w-full max-w-md shadow-2xl"
            >
                {/* Logo / Title */}
                <motion.div
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        Posture Guardian
                    </h1>
                    <p className="text-slate-400 mt-2">Create your account</p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Username
                        </label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 glass rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                placeholder="Choose a username"
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 glass rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                placeholder="your@email.com"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-12 py-3 glass rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                placeholder="Min 6 characters"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 glass rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                placeholder="Confirm your password"
                                required
                            />
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 text-red-400 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Submit */}
                    <AnimatedButton
                        type="submit"
                        className="w-full"
                        variant="primary"
                    >
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </AnimatedButton>

                    {/* Login link */}
                    <p className="text-center text-slate-400 text-sm">
                        Already have an account?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
                        >
                            Sign in
                        </button>
                    </p>
                </form>
            </motion.div>
        </div>
    )
}

export default RegisterPage