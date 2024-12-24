import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthStore = {
    uid: string | null;
    setUid: (uid: string) => void;
    clearUid: () => void;
};

const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            uid: null,
            setUid: (uid) => set({ uid }),
            clearUid: () => set({ uid: null })
        }),
        {
            name: 'auth-storage',
        }
    )
);

export default useAuthStore;
