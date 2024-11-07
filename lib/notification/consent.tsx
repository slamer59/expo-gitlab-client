import { create } from 'zustand';

const useConsentStore = create((set) => ({
    consentGiven: false, // Initial state for GDPR consent
    setConsent: (consent) => set({ consentGiven: consent }),
}));

export default useConsentStore;
