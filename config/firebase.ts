import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { VoteResult, Policy } from "../types";

// Your web app's Firebase configuration
// For development, these will be read from .env.local
// For production, these will be set in Vercel environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

const VOTES_COLLECTION = 'votes';

export interface VoteData {
    location: {
        province: string;
        district: string;
        subdistrict: string;
        zipcode: string;
    };
    selectedPolicies: {
        id: string;
        title: string;
        rank: number; // 1, 2, or 3
    }[];
    additionalComment?: string;
    timestamp: any;
}

// Function to submit a vote
export const submitVote = async (data: Omit<VoteData, 'timestamp'>) => {
    try {
        await addDoc(collection(db, VOTES_COLLECTION), {
            ...data,
            timestamp: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error("Error adding document: ", error);
        return false;
    }
};

// Hook for realtime dashboard updates (simplified for now)
export const subscribeToVotes = (callback: (votes: VoteData[]) => void) => {
    // In a real app with millions of records, you wouldn't fetch ALL votes like this.
    // You would likely use Firebase Extensions (like Aggregate counts) or Cloud Functions 
    // to maintain a separate 'counters' collection.
    // For this MVP/Demo, fetching recent 1000 votes is acceptable.

    const q = query(collection(db, VOTES_COLLECTION), orderBy("timestamp", "desc"), limit(1000));

    return onSnapshot(q, (querySnapshot) => {
        const votes: VoteData[] = [];
        querySnapshot.forEach((doc) => {
            votes.push(doc.data() as VoteData);
        });
        callback(votes);
    });
};
