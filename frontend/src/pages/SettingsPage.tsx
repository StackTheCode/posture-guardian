import { useEffect, useState } from "react";
import { useSettings } from "../hooks/useSettings";
import { AlertCircle, Bell, Clock, Moon, RefreshCw, Save, Sun } from "lucide-react";
import { motion } from 'framer-motion';
import { GlassCard } from "../components/ui/GlassCard";
import { AnimatedButton } from "../components/ui/AnimatedButton";
import { useTheme } from '../context/ThemeContext'; 


export const SettingsPage = () => {
  const { settings, loading, saving, updateSettings } = useSettings();
  const {  setTheme } = useTheme(); 
  const [formData, setFormData] = useState({
    captureIntervalSeconds: 30,
    notificationsEnabled: true,
    notificationSensitivity: 'medium' as 'low' | 'medium' | 'high',
    workingHoursEnabled: false,
    workingHoursStart: '09:00',
    workingHoursEnd: '17:00',
    cameraIndex: 0,
    theme: 'dark' as 'dark' | 'light',
  });



  useEffect(() => {
    if (settings) {
      setFormData({
        captureIntervalSeconds: settings.captureIntervalSeconds,
        notificationsEnabled: settings.notificationsEnabled,
        notificationSensitivity: settings.notificationSensitivity,
        workingHoursEnabled: settings.workingHoursEnabled,
        workingHoursStart: settings.workingHoursStart.substring(0, 5), // "09:00:00" -> "09:00"
        workingHoursEnd: settings.workingHoursEnd.substring(0, 5),
        cameraIndex: settings.cameraIndex,
        theme: settings.theme,

      })
    }
  }, [settings])



  const handleSave = async () => {
    await updateSettings({
      ...formData,
      workingHoursStart: `${formData.workingHoursStart}:00`,
      workingHoursEnd: `${formData.workingHoursEnd}:00`,


    })
  }

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setFormData({ ...formData, theme: newTheme });
    setTheme(newTheme);
  };
  if (loading) {
    <div className='min-h-screen p-6 flex items-center justify-center'>
      <div className="glass-strong rounded-2xl p-8 flex flex-col items-center gap-4">
        <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
        <p className="text-slate-300">Loading settings...</p>
      </div>
    </div>
  }

  return (
    <div className='min-h-screen p-6 flex flex-col gap-10'>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-slate-400 mt-1">Customize your posture monitoring experience</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mx-auto">
        {/* Monitoring Settings */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 glass rounded-xl bg-purple-500/20">
              <Clock className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Monitoring Settings</h2>
              <p className="text-sm text-slate-400">Configure how often posture is checked</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Capture Interval */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Capture Interval
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="5"
                  value={formData.captureIntervalSeconds}
                  onChange={(e) => setFormData({ ...formData, captureIntervalSeconds: parseInt(e.target.value) })}
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <span className="text-lg font-semibold w-20 text-right">
                  {formData.captureIntervalSeconds}s
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                How often to capture and analyze your posture (10-120 seconds)
              </p>
            </div>

            {/* Camera Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Camera
              </label>
              <select
                value={formData.cameraIndex}
                onChange={(e) => setFormData({ ...formData, cameraIndex: parseInt(e.target.value) })}
                className="w-full px-4 py-3 glass rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value={0}>Default Camera (0)</option>
                <option value={1}>Camera 1</option>
                <option value={2}>Camera 2</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Notification Settings */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 glass rounded-xl bg-blue-500/20">
              <Bell className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Notifications</h2>
              <p className="text-sm text-slate-400">Configure posture alerts</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Enable Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-slate-300">
                  Enable Notifications
                </label>
                <p className="text-xs text-slate-400">Get alerts when bad posture is detected</p>
              </div>
              <button
                onClick={() => setFormData({ ...formData, notificationsEnabled: !formData.notificationsEnabled })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.notificationsEnabled ? 'bg-purple-600' : 'bg-slate-600'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>

            {/* Notification Sensitivity */}
            {formData.notificationsEnabled && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Notification Sensitivity
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['low', 'medium', 'high'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setFormData({ ...formData, notificationSensitivity: level })}
                      className={`px-4 py-3 rounded-xl transition-all ${formData.notificationSensitivity === level
                          ? 'bg-purple-600 text-white'
                          : 'glass hover:glass-strong'
                        }`}
                    >
                      <span className="capitalize">{level}</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  {formData.notificationSensitivity === 'low' && 'Only alert for severe posture issues'}
                  {formData.notificationSensitivity === 'medium' && 'Alert for moderate posture issues'}
                  {formData.notificationSensitivity === 'high' && 'Alert for any posture deviation'}
                </p>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Working Hours */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 glass rounded-xl bg-green-500/20">
              <Clock className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Working Hours</h2>
              <p className="text-sm text-slate-400">Only monitor during specific hours</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Enable Working Hours */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-slate-300">
                  Enable Working Hours
                </label>
                <p className="text-xs text-slate-400">Pause monitoring outside these hours</p>
              </div>
              <button
                onClick={() => setFormData({ ...formData, workingHoursEnabled: !formData.workingHoursEnabled })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.workingHoursEnabled ? 'bg-green-600' : 'bg-slate-600'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.workingHoursEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>

            {/* Time Range */}
            {formData.workingHoursEnabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={formData.workingHoursStart}
                    onChange={(e) => setFormData({ ...formData, workingHoursStart: e.target.value })}
                    className="w-full px-4 py-3 glass rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={formData.workingHoursEnd}
                    onChange={(e) => setFormData({ ...formData, workingHoursEnd: e.target.value })}
                    className="w-full px-4 py-3 glass rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Appearance */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 glass rounded-xl bg-yellow-500/20">
              {formData.theme === 'dark' ? (
                <Moon className="w-6 h-6 text-yellow-400" />
              ) : (
                <Sun className="w-6 h-6 text-yellow-400" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold">Appearance</h2>
              <p className="text-sm text-slate-400">Customize the look and feel</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Theme
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['dark', 'light'] as const).map((themeOption) => (
                <button
                  key={themeOption}
                  onClick={() => handleThemeChange(themeOption)}
                  className={`px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${formData.theme === themeOption
                      ? 'bg-yellow-600 text-white'
                      : 'glass hover:glass-strong'
                    }`}
                >
                  {themeOption === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  <span className="capitalize">{themeOption}</span>
                </button>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Save Button */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between p-6 glass-strong rounded-2xl">
            <div className="flex items-center gap-3 text-slate-400">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">
                Desktop agent will update automatically within 30 seconds
              </span>
            </div>

            <AnimatedButton
              onClick={handleSave}
              variant="primary"
              className="flex items-center gap-2"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Settings
                </>
              )}
            </AnimatedButton>
          </div>
        </div>
      </div>
    </div>
  )
}

