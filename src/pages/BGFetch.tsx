// src/pages/BGFetch.tsx
import {
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
} from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import { BackgroundTask } from "@capawesome/capacitor-background-task";
import { requestIgnoreBatteryOptimizations } from "../utils/batteryOptimization";
import { useIonAlert } from "@ionic/react";
import { AndroidSettings, NativeSettings } from "capacitor-native-settings";

const BGFetch: React.FC = () => {
  const API_URL = "https://jsonplaceholder.typicode.com/posts";
  const fetchIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [fdata, setData] = useState<any>(null);
  const [present] = useIonAlert();

  const fetchData = async () => {
    try {
      console.log("Attempting to fetch data from:", API_URL);
      const response = await fetch(API_URL);
      const json = await response.json();
      setData(json);
      const data=JSON.stringify(json)
      console.log("Fetched data:", data);
       // Log the fetched data directly
     
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const showBatteryOptimizationAlert = () => {
    present({
      header: "Battery Optimization",
      message:
        "To ensure reliable background fetching, please exclude this app from battery optimizations.",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Open Settings",
          handler: () => {
            NativeSettings.openAndroid({
              option: AndroidSettings.BatteryOptimization,
            });
          },
        },
      ],
    });
  };

  useEffect(() => {
    // Request to ignore battery optimizations
    requestIgnoreBatteryOptimizations();

    // Show alert to guide users
    showBatteryOptimizationAlert();

    // Start fetching data immediately
    fetchData();

    // Start the interval for foreground fetching
    fetchIntervalRef.current = setInterval(fetchData, 15000); // 30 seconds

    // Listen for app state changes (foreground/background)
    const appStateListener = CapacitorApp.addListener(
      "appStateChange",
      (state) => {
        if (!state.isActive) {
          console.log("App has moved to the background");

          // Register a background task with the correct callback signature
          BackgroundTask.beforeExit(async (taskId: string) => {
            console.log("Background task started with taskId:", taskId);

            // Fetch data once during the background task
            await fetchData();

            console.log("Background task completed");

            // Finish the background task with the correct taskId
            BackgroundTask.finish({ taskId });
          });
        } else {
          console.log("App is in the foreground");

          // Clear any existing intervals to prevent multiple intervals
          if (fetchIntervalRef.current) {
            clearInterval(fetchIntervalRef.current);
          }

          // Restart the interval for foreground fetching
          fetchIntervalRef.current = setInterval(fetchData, 15000); // 30 seconds
        }
      }
    );

    // Cleanup on unmount
    return () => {
      appStateListener.remove();
      if (fetchIntervalRef.current) {
        clearInterval(fetchIntervalRef.current);
      }
    };
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonMenuButton slot="start" />
          <IonTitle>Background Fetch</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h2>Background Fetch</h2>
        <p>
          This app fetches geolocation data every 30 seconds, even when running
          in the background.
        </p>
        {/* Optionally, add a manual fetch button */}
        {/* <IonButton onClick={fetchData}>Fetch Data Now</IonButton> */}
        <div>
          <h3>Fetched Data:</h3>
          <pre>
            {fdata ? JSON.stringify(fdata, null, 2) : "No data fetched yet."}
          </pre>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BGFetch;
