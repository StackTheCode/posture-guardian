import { ArrowLeft, Bell, Download, Monitor, ShieldCheck, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion";
import { GlassCard } from "../components/ui/GlassCard";

export const DownloadPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full flex justify-center">

            <div className="w-full p-6 ">

                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors mb-8 cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </button>

                <div className="text-center mb-10 py-10 flex flex-col items-center gap-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-bold bg-linear-to-br from-white to-slate-300 bg-clip-text text-transparent"
                    >
                        Posture Guardian for Windows
                    </motion.h1>

                    <p className="text-slate-300 text-lg">
                        Transform your webcam into a smart posture assistant.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
                    <GlassCard>
                        <div className="p-6 flex flex-col gap-6">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-yellow-400" />
                                Why the Desktop App?
                            </h2>
                            <ul className="space-y-4 text-slate-300 mt-5">
                                <li className="flex gap-4 items-center">
                                    <div className="p-2 bg-blue-500/10 rounded-lg ">
                                        <Bell className="w-5 h-5 text-blue-400 shrink-0" />
                                    </div>
                                    <span>Real-time system tray notifications when you slouch.</span>
                                </li>
                                <li className="flex gap-4 items-center">
                                    <div className="p-2 bg-emerald-500/10 rounded-lg ">
                                        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                                    </div>
                                    <span>Privacy focused: Video is processed locally on your PC.</span>
                                </li>
                                <li className="flex gap-4 items-center">
                                    <div className="p-2 bg-purple-500/10 rounded-lg ">
                                        <Monitor className="w-5 h-5 text-purple-400 shrink-0" />
                                    </div>
                                    <span>Runs in the background while you work or game.</span>
                                </li>
                            </ul>
                        </div>
                    </GlassCard>

                    <div className="flex flex-col justify-center items-center gap-6">
                        <GlassCard className="w-full">
                            <div className="p-8 flex flex-col items-center gap-6">
                                <div className="text-center">
                                    <p className="text-slate-400 text-sm mb-1">Latest Version</p>
                                    <p className="text-lg font-semibold">0.1.0</p>
                                </div>

                                <motion.a
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    href="https://github.com/StackTheCode/posture-guardian/releases/latest/download/PostureGuardian_Setup.exe"
                                    download
                                    className="w-full py-4 bg-linear-to-br from-slate-700 via-slate-600 to-slate-700 hover:from-slate-600 hover:via-slate-500 hover:to-slate-600 rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:shadow-xl shadow-slate-900/50 transition-all group relative overflow-hidden border border-slate-600/50"
                                >
                                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    <Download className="w-5 h-5 text-slate-200" />
                                    <span className="font-semibold text-slate-100">Download for Windows</span>
                                </motion.a>

                                <p className="text-xs text-slate-500">Windows 10/11 • 64-bit</p>
                            </div>
                        </GlassCard>
                    </div>
                    <GlassCard className="md:col-span-2">
                        <div className="p-6">
                            <h2 className="text-lg font-semibold mb-4">Installation Notes</h2>
                            <div className="space-y-4">
                                <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl text-sm text-slate-300 leading-relaxed">
                                    <p className="mb-2 flex items-start gap-2">
                                        <ShieldCheck className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                                        <span>
                                            <strong>Windows SmartScreen:</strong> Since Posture Guardian is an independent project,
                                            Windows may show a blue "SmartScreen" warning during installation.
                                        </span>
                                    </p>
                                    <p className="ml-6 text-slate-400">
                                        To continue: Click <strong className="text-slate-300">"More Info"</strong> and then <strong className="text-slate-300">"Run Anyway"</strong>.
                                        We are working on getting the app officially signed!
                                    </p>
                                </div>

                                <div className="text-sm text-slate-400 ml-1">
                                    <p className="mb-2 font-medium text-slate-300">After installation:</p>
                                    <ul className="space-y-1 list-disc list-inside">
                                        <li>The app will start automatically and appear in your system tray</li>
                                        <li>Sign in with your Posture Guardian account</li>
                                        <li>Grant camera permission when prompted</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </GlassCard>


                </div>


            </div>
        </div>
    )
}