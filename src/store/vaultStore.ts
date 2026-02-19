import { create } from 'zustand';

interface VaultState {
    masterKey: string | null;
    isUnlocked: boolean;
    unlockVault: (key: string) => void;
    lockVault: () => void;
}

// Tạo store lưu trữ trong RAM
export const useVaultStore = create<VaultState>((set) => ({
    masterKey: null,      // Mặc định ban đầu là null (chưa có chìa khóa)
    isUnlocked: false,    // Mặc định là đang khóa

    // Hàm gọi khi user nhập đúng Master Password
    unlockVault: (key: string) => set({ masterKey: key, isUnlocked: true }),

    // Hàm gọi khi user bấm nút "Đăng xuất" hoặc "Khóa Két", xóa sạch key khỏi RAM
    lockVault: () => set({ masterKey: null, isUnlocked: false }),
}));