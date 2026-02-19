import { describe, it, expect, beforeEach } from 'vitest';
import { useVaultStore } from './vaultStore';

describe('Vault Store (Quản lý trạng thái khóa/mở Két)', () => {

    // Reset lại trạng thái của store về mặc định trước khi chạy mỗi bài test
    // Tránh việc bài test trước làm ảnh hưởng kết quả bài test sau
    beforeEach(() => {
        useVaultStore.setState({ masterKey: null, isUnlocked: false });
    });

    it('Mặc định ứng dụng phải ở trạng thái khóa (Locked)', () => {
        const state = useVaultStore.getState();
        expect(state.masterKey).toBeNull();
        expect(state.isUnlocked).toBe(false);
    });

    it('Phải lưu được Master Key vào RAM khi gọi unlockVault', () => {
        // Kịch bản: Người dùng nhập pass 'my-secret-key'
        useVaultStore.getState().unlockVault('my-secret-key');

        // Kiểm tra xem store đã cập nhật chưa
        const state = useVaultStore.getState();
        expect(state.masterKey).toBe('my-secret-key');
        expect(state.isUnlocked).toBe(true);
    });

    it('Phải xóa sạch Master Key khỏi RAM khi gọi lockVault', () => {
        // 1. Mở khóa trước
        useVaultStore.getState().unlockVault('my-secret-key');

        // 2. Gọi hàm khóa két
        useVaultStore.getState().lockVault();

        // 3. Kiểm tra xem key đã bốc hơi chưa
        const state = useVaultStore.getState();
        expect(state.masterKey).toBeNull();
        expect(state.isUnlocked).toBe(false);
    });
});