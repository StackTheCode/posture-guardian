import { useEffect, useState } from 'react';
import type { UserSettings } from '../types';
import { settingsApi } from '../services/api';
import { handleApiError, showSuccess } from '../utils/errorHandler';
import toast from 'react-hot-toast';


export const useSettings = () => {
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const loadSettings = async () => {
        try {
            setLoading(true)
            const response = await settingsApi.getSettings();
            setSettings(response.data);
        } catch (error) {
            handleApiError(error, 'Failed to load settings');
        } finally {
            setLoading(false);
        }
    }



    const updateSettings = async (updates: Partial<UserSettings>) => {
        try {
            setSaving(true)
            const loadingToast = toast.loading("Saving settings...");
            const response = await settingsApi.updateSettings(updates);

            setSettings(response.data)
            toast.dismiss(loadingToast);
            showSuccess("Settings saved successfully")

            return true;
        } catch (error) {
            handleApiError(error, "Failed to update setting");
            return false;
        } finally{
            setSaving(false);
        }
    }

    useEffect(() =>{
        loadSettings()
    },[])


    return {settings,loading,saving,updateSettings,reloadSettings:loadSettings};


}

