import { create } from 'zustand';

type UserType = 'admin' | 'merchant' | 'shopper' | null;

interface UserState {
  userType: UserType;
  walletAddress: string | null;
  token: string | null;
  setUserType: (userType: UserType) => void;
  setWalletAddress: (walletAddress: string) => void;
  setToken: (token: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  userType: null,
  walletAddress: null,
  token: null,
  setUserType: (userType) => set({ userType }),
  setWalletAddress: (walletAddress) => set({ walletAddress }),
  setToken: (token) => set({ token }),
  clearUser: () => set({ userType: null, walletAddress: null, token: null }),
}));