// src/utils/batteryOptimization.ts
import { Plugins, Capacitor } from '@capacitor/core';
const { App } = Plugins;

export const requestIgnoreBatteryOptimizations = async () => {
  if (Capacitor.getPlatform() !== 'android') {
    return;
  }

  try {
    // Direct users to battery optimization settings
    await App.openUrl({ url: 'android.settings.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS' });
  } catch (error) {
    console.error('Error requesting battery optimization exemption:', error);
  }
};
    