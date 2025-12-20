import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { AnimatedButton } from '../components/ui/AnimatedButton';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true);
        try {
            const response = await authApi.login(username, password);
            login(response.data.token, response.data.username, response.data.email);
            navigate('/dashboard');


        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');

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
                    <h1 className="text-4xl font-bold bg-linear-to-r from-purple-400 to-blue-400 
                       bg-clip-text text-transparent">
                        Posture Guardian
                    </h1>
                    <p className="text-slate-400 mt-2">Sign in to your account</p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 glass rounded-xl focus:ring-2 focus:ring-purple-500 
                       outline-none transition-all"
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 glass rounded-xl focus:ring-2 focus:ring-purple-500 
                         outline-none transition-all pr-12"
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 
                         hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
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
                        {loading ? 'Signing in...' : 'Sign In'}
                    </AnimatedButton>

                    {/* Register link */}
                    <p className="text-center text-slate-400 text-sm">
                        Don't have an account?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
                        >
                            Sign up
                        </button>
                    </p>
                </form>
            </motion.div>
        </div>
    )
}

export default LoginPage