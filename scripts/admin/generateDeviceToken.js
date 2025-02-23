import crypto from "crypto";
import dotenv from "dotenv";
import admin from "firebase-admin";
import { dirname } from "path";
import { fileURLToPath } from "url";

// Get current file path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Verify environment variables are loaded
const requiredEnvVars = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
];

const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);
if (missingEnvVars.length > 0) {
  console.error("Missing required environment variables:", missingEnvVars);
  process.exit(1);
}

// Initialize Firebase Admin
const app = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const db = admin.firestore(app);

async function generateDeviceToken(deviceName) {
  try {
    console.log("Initializing with project:", process.env.FIREBASE_PROJECT_ID);

    // Generate a secure random token
    const token = crypto.randomBytes(16).toString("hex");

    // Create a new device document using token as ID
    const deviceDoc = {
      name: deviceName,
      token: token, // Keep token in document for reference
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastUsed: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Add to Firestore using token as document ID
    console.log("Adding device to Firestore...");
    await db.collection("authorized_devices").doc(token).set(deviceDoc);

    // Get the app URL from environment variables
    const appUrl = process.env.VITE_APP_URL || "http://localhost:5173";
    const gameUrl = `${appUrl}/?device=${token}`;

    console.log("\nDevice Token Generated Successfully!");
    console.log("----------------------------------------");
    console.log(`Device Name: ${deviceName}`);
    console.log(`Token: ${token}`);
    console.log(`\nGame URL: ${gameUrl}`);
    console.log("\nInstructions:");
    console.log("1. Open this URL on the iPad");
    console.log("2. Add to Home Screen:");
    console.log("   - In Safari, tap the share button (square with arrow)");
    console.log('   - Select "Add to Home Screen"');
    console.log('   - Name it "Math Champions"');
    console.log('   - Tap "Add"');
  } catch (error) {
    console.error("Error generating device token:");
    console.error("Error code:", error.code);
    console.error("Error details:", error.details);
    console.error("Full error:", error);
    process.exit(1);
  }
}

// Check if device name was provided
const deviceName = process.argv[2];
if (!deviceName) {
  console.error(
    'Please provide a device name: npm run generate-token "Kid1\'s iPad"'
  );
  process.exit(1);
}

generateDeviceToken(deviceName);
