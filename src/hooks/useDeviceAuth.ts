import { firestore } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export interface AuthorizedDevice {
  id: string;
  name: string;
  token: string;
  createdAt: Date;
  lastUsed: Date;
}

export const useDeviceAuth = () => {
  const [isAuthorizedDevice, setIsAuthorizedDevice] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<AuthorizedDevice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkDeviceAuth = async () => {
      try {
        // Get device token from URL
        const params = new URLSearchParams(window.location.search);
        const deviceToken = params.get("device");
        console.log("Device token:", deviceToken);

        if (!deviceToken) {
          setIsLoading(false);
          return;
        }

        // Query Firestore for device with matching token
        const devicesRef = collection(firestore, "authorized_devices");
        const q = query(devicesRef, where("token", "==", deviceToken));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const deviceData = doc.data() as AuthorizedDevice;
          setIsAuthorizedDevice(true);
          setDeviceInfo({ ...deviceData, id: doc.id, name: deviceData.name });

          // Update last used timestamp
          await updateDoc(doc.ref, {
            lastUsed: new Date(),
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
    deviceId: deviceInfo?.id || null,
  };
};
