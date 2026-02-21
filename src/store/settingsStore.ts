// Đường dẫn: src/store/settingsStore.ts
import { create } from 'zustand';

export interface AutoLockOption {
    label: string;
    value: number; // milliseconds, 0 = tắt
}

export const AUTO_LOCK_OPTIONS: AutoLockOption[] = [
    { label: 'Tắt (không tự khóa)', value: 0 },
    { label: '30 giây', value: 30 * 1000 },
    { label: '1 phút', value: 60 * 1000 },
    { label: '2 phút', value: 2 * 60 * 1000 },
    { label: '5 phút', value: 5 * 60 * 1000 },
    { label: '10 phút', value: 10 * 60 * 1000 },
    { label: '30 phút', value: 30 * 60 * 1000 },
];

interface SettingsState {
    autoLockTimeout: number; // ms, 0 = disabled
    setAutoLockTimeout: (timeout: number) => void;
}

// Đọc từ localStorage khi khởi tạo
const getStoredTimeout = (): number => {
    try {
        const stored = localStorage.getItem('my-vault-auto-lock-timeout');
        if (stored !== null) {
            const parsed = parseInt(stored, 10);
            if (!isNaN(parsed) && parsed >= 0) return parsed;
        }
    } catch {
        // localStorage không khả dụng
    }
    return 5 * 60 * 1000; // Mặc định: 5 phút
};

export const useSettingsStore = create<SettingsState>((set) => ({
    autoLockTimeout: getStoredTimeout(),

    setAutoLockTimeout: (timeout: number) => {
        try {
            localStorage.setItem('my-vault-auto-lock-timeout', String(timeout));
        } catch {
            // localStorage không khả dụng
        }
        set({ autoLockTimeout: timeout });
    },
}));
