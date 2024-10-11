import { onValue, ref } from 'firebase/database';
import create from 'zustand';
import { persist } from 'zustand/middleware';

const useFirebaseStore = create(
    persist(
        (set, get) => ({
            data: {},
            updateData: (newData) => set({ data: { ...get().data, ...newData } }),
            loadData: (path) => {
                const unsubscribe = onValue(ref(db, path), (snapshot) => {
                    if (snapshot.exists()) {
                        set({ data: { ...get().data, ...snapshot.val() } });
                    }
                });
                return unsubscribe;
            },
        }),
        {
            name: 'firebase-store', // unique name for the storage
        }
    )
);

export default useFirebaseStore;
