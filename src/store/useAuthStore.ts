import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth } from "../../auth";
import { signOut as firebaseSignOut } from 'firebase/auth';

type AuthStore = {
    uid: string | null;
    displayName: string | null;
    setUser: (uid: string, displayName: string | null) => void;
    signOut: () => void;
    clearUid: () => void;
};

const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            uid: null,
            displayName: null,
            setUser: (uid, displayName) => set({ uid, displayName }),
            signOut: () => {
                firebaseSignOut(auth)
                    .then(() => {
                        set({ uid: null, displayName: null });
                    })
                    .catch((error) => {
                        console.error('Error signing out: ', error);
                        throw error;
                    });
            },
            clearUid: () => set({ uid: null })
        }),
        {
            name: 'auth-storage',
        }
    )
);

export default useAuthStore;