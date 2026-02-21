// Đường dẫn: src/hooks/useAutoLock.ts
import { useEffect, useRef } from 'react';
import { useVaultStore } from '../store/vaultStore';
import { useSettingsStore } from '../store/settingsStore';
import { toast } from 'react-hot-toast';

export const useAutoLock = () => {
    const lockVault = useVaultStore((state) => state.lockVault);
    const masterKey = useVaultStore((state) => state.masterKey);
    const autoLockTimeout = useSettingsStore((state) => state.autoLockTimeout);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // 1. Khởi tạo loa âm thanh và giữ nó trong RAM bằng useRef
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Tải file âm thanh sẵn vào RAM
        audioRef.current = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');

        // MẸO LÁCH LUẬT: Lén phát âm thanh rồi tắt ngay khi user click chuột lần đầu
        const unlockAudio = () => {
            if (audioRef.current) {
                audioRef.current.play().then(() => {
                    audioRef.current?.pause(); // Vừa phát là tắt ngay
                    audioRef.current!.currentTime = 0; // Trả về đầu bài
                }).catch(() => { });
            }
            // Xin được quyền rồi thì gỡ cái bẫy click này đi
            document.removeEventListener('click', unlockAudio);
        };

        // Cài bẫy click vào toàn bộ trang web
        document.addEventListener('click', unlockAudio);

        return () => {
            document.removeEventListener('click', unlockAudio);
        };
    }, []);

    useEffect(() => {
        // Nếu chưa unlock hoặc timeout = 0 (tắt auto-lock) → không làm gì
        if (!masterKey || autoLockTimeout === 0) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                timeoutRef.current = setTimeout(() => {
                    lockVault();
                    toast('Két sắt đã tự động khóa!', { icon: '🔒' });

                    // 2. PHÁT ÂM THANH (Lúc này đã có "Kim bài miễn tử" nên sẽ kêu)
                    if (audioRef.current) {
                        audioRef.current.currentTime = 0; // Tua lại từ đầu
                        audioRef.current.play().catch(e => console.log('Vẫn bị chặn:', e));
                    }

                    if ('Notification' in window && Notification.permission === 'granted') {
                        new Notification('My Vault - Bảo mật', {
                            body: 'Két sắt đã tự động khóa do bạn rời đi quá lâu.',
                            icon: '/vite.svg',
                        });
                    }
                }, autoLockTimeout);
            } else {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current = null;
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [masterKey, lockVault, autoLockTimeout]);
};