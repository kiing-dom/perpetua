import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
            signOut: () => set({ uid: null, displayName: null}),
            clearUid: () => set({ uid: null })
        }),
        {
            name: 'auth-storage',
        }
    )
);

export default useAuthStore;
