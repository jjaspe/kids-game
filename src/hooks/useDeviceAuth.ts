import { db } from "@/lib/firebase";
import { get, ref, set } from "firebase/database";
import { useEffect, useState } from "react";

export interface AuthorizedDevice {
  id: string;
  name: string;
  createdAt: number;
  lastActive: number;
}

export const useDeviceAuth = () => {
  const [isAuthorizedDevice, setIsAuthorizedDevice] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<AuthorizedDevice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkDeviceAuth = async () => {
      try {
        // Get device ID from localStorage or create new one
        let deviceId = localStorage.getItem("deviceId");
        if (!deviceId) {
          deviceId = `device_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`;
          localStorage.setItem("deviceId", deviceId);
        }

        // Check if device is authorized
        const deviceRef = ref(db, `authorizedDevices/${deviceId}`);
        const snapshot = await get(deviceRef);
        const deviceData = snapshot.val() as AuthorizedDevice | null;

        if (deviceData) {
          setIsAuthorizedDevice(true);
          setDeviceInfo(deviceData);
          // Update last active timestamp
          await set(deviceRef, {
            ...deviceData,
            lastActive: Date.now(),
          });
        }
      } catch (error) {
        console.error("Error checking device auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkDeviceAuth();
  }, []);

  return {
    isAuthorizedDevice,
    deviceInfo,
    isLoading,
    deviceId: deviceInfo?.id || localStorage.getItem("deviceId") || null,
  };
};
