import { motion } from 'framer-motion';
import { Download, Shield, TrendingUp, Zap, Check, Github, ArrowRight, Play } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [videoPlaying, setVideoPlaying] = useState(false);

  const features = [
    {
      icon: Zap,
      title: "Real-Time Monitoring",
      description: "AI-powered posture detection using your webcam. Get instant alerts when you slouch."
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "All processing happens locally on your device. No cloud uploads. No data collection."
    },
    {
      icon: TrendingUp,
      title: "Track Your Progress",
      description: "Beautiful analytics dashboard shows your improvement over time with detailed insights."
    }
  ];

  const stats = [
    { value: "47%", label: "Average posture improvement" },
    { value: "100%", label: "Free & open source" },
    { value: "30 sec", label: "Setup time" }
  ];

  return (
    <div
      className="min-h-screen w-full text-white selection:bg-blue-500/30"
      style={{
        isolation: 'isolate',
        position: 'relative',
        background: 'linear-gradient(to bottom right, rgb(2 6 23), rgb(59 7 100), rgb(2 6 23))',
      }}
    >
      {/* Own background mesh — mirrors body::before but scoped to this page */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          pointerEvents: 'none',
          background: [
            'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.2) 0%, transparent 50%)',
            'radial-gradient(circle at 40% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
          ].join(', '),
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg  flex items-center justify-center">
             <img src='/logo_76.png' className="bg-cover"/>
            </div>
            <span className="text-xl font-bold">Posture Guardian</span>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/StackTheCode/posture-guardian" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <button
              onClick={() => navigate('/login')}
              className="cursor-pointer px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/download')}
              className="cursor-pointer px-6 py-2 bg-linear-to-r from-blue-600 to-blue-500 rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-500/25 text-sm font-semibold"
            >
              Download Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block px-4 py-2 glass rounded-full text-sm text-blue-400 mb-6">
                ✨ Free & Open Source
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
                Stop Slouching.
                <br />
                <span className="bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Start Thriving.
                </span>
              </h1>
              
              <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                Your webcam becomes your posture coach. Real-time alerts, detailed analytics, 
                and zero cloud uploads. Built for developers, remote workers, and anyone who 
                spends hours at a desk.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/download')}
                  className="px-8 cursor-pointer py-4 bg-linear-to-r from-blue-600 to-blue-500 rounded-2xl font-semibold text-lg shadow-2xl shadow-blue-500/30 flex items-center gap-2 group"
                >
                  <Download className="w-5 h-5" />
                  Download for Windows
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                
                <button
                  onClick={() => navigate('/register')}
                  className="px-8 py-4 cursor-pointer glass hover:glass-strong rounded-2xl font-semibold text-lg transition-all"
                >
                  Create Account
                </button>
              </div>

              <div className="flex items-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  No credit card
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  Windows 10/11
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  2 min setup
                </div>
              </div>
            </motion.div>

            {/* Right: Video Demo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="glass rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                {!videoPlaying ? (
                  <div className="relative aspect-video bg-linear-to-br from-slate-800 to-slate-900 flex items-center justify-center group cursor-pointer"
                       onClick={() => setVideoPlaying(true)}>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItMnptMC0ydi0yIDJ6bS0yIDB2LTIgMnptMiAydjJoLTJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
                    
                    <div className="relative z-10 flex flex-col items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-all group-hover:scale-110">
                        <Play className="w-10 h-10 text-blue-400 ml-1" />
                      </div>
                     
                    </div>
                  </div>
                ) : (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full"
                    poster="/poster.jpg"
                  >
                    <source src="/landing.mp4"  type="video/mp4" />
                  </video>
                )}
              </div>
              
              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 glass-strong rounded-2xl p-4 shadow-xl border border-white/10"
              >
                <div className="text-sm font-semibold text-green-400"> Needs Work </div>
                <div className="text-xs text-slate-400">65% this week</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 px-6 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold mb-6">
              Built for Your{' '}
              <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Health
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Technology empowers us, but health sustains us. Posture Guardian 
              helps you take care of your body while you build great things.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 px-6 bg-linear-to-b from-transparent to-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6">How It Works</h2>
            <p className="text-xl text-slate-400">
              Three simple steps to better posture
            </p>
          </motion.div>

          <div className="space-y-12">
            {[
              {
                step: "01",
                title: "Download & Install",
                description: "Register on the website, download the Windows app. Installation takes 30 seconds.",
              },
              {
                step: "02",
                title: "Sign In & Activate",
                description: "Launch the app, sign in with your account. It runs silently in your system tray.",
              },
              {
                step: "03",
                title: "Get Real-Time Alerts",
                description: "When you slouch, you'll get an instant notification. Track your progress on the dashboard.",
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-8 items-start"
              >
                <div className="text-6xl font-bold text-blue-500/20 select-none">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-slate-400 text-lg leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6">
              Loved by Developers & Remote Workers
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "I improved my posture by 47% in just 2 weeks. Finally stopped getting afternoon headaches.",
                author: "Alex Chen",
                role: "Software Engineer"
              },
              {
                quote: "Privacy-first approach is exactly what I needed. All processing happens locally on my machine.",
                author: "Sarah Miller",
                role: "Product Designer"
              },
              {
                quote: "Runs so smoothly I forget it's there. The notifications are gentle but effective.",
                author: "Michael Park",
                role: "Data Scientist"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6 border border-white/5"
              >
                <p className="text-slate-300 mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-slate-400">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-strong rounded-3xl p-12 md:p-16 text-center border border-white/10 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-purple-500/10"></div>
            
            <div className="relative z-10">
              <h2 className="text-5xl font-bold mb-6">
                Ready to Improve Your Posture?
              </h2>
              <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                Join thousands of users who are already taking care of their health. 
                Download now, completely free.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/dashboard')}
                  className="cursor-pointer px-10 py-5 bg-linear-to-r from-blue-600 to-blue-500 rounded-2xl font-semibold text-lg shadow-2xl shadow-blue-500/30 flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download for Free
                </motion.button>
                
                <button
                  onClick={() => window.open('https://github.com/StackTheCode/posture-guardian', '_blank')}
                  className="cursor-pointer px-10 py-5 glass hover:glass-strong rounded-2xl font-semibold text-lg transition-all flex items-center gap-2"
                >
                  <Github className="w-5 h-5" />
                  View on GitHub
                </button>
              </div>

              <div className="mt-8 flex items-center justify-center gap-8 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  Free forever
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  Open source
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  No credit card
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg  flex items-center justify-center">
                 <img src='/logo_76.png' className="bg-cover"/>
              </div>
              <span className="text-xl font-bold">Posture Guardian</span>
            </div>
            
            <div className="flex gap-6 text-sm text-slate-400">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms</a>
              <a href="https://github.com/StackTheCode/posture-guardian" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
              <a href="mailto:support@postureguardian.com" className="hover:text-white transition-colors">Contact</a>
            </div>
            
            <div className="text-sm text-slate-400">
              © 2026 Posture Guardian
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};