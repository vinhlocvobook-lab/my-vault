// Đường dẫn: src/lib/crypto.test.ts
import { describe, it, expect } from 'vitest';
import { encryptData, decryptData } from './crypto';

// 'describe' dùng để gom nhóm các bài test có chung chủ đề
describe('Thử nghiệm Cơ chế Mã hóa/Giải mã (Crypto Module)', () => {

    const MASTER_KEY = 'super-secret-master-password';
    const RAW_DATA = 'my_database_password_123';

    it('Phải mã hóa và giải mã về đúng dữ liệu gốc', () => {
        // 1. Thực hiện mã hóa
        const encryptedText = encryptData(RAW_DATA, MASTER_KEY);

        // Đảm bảo chuỗi mã hóa khác hoàn toàn chuỗi gốc
        expect(encryptedText).not.toBe(RAW_DATA);

        // 2. Thực hiện giải mã
        const decryptedText = decryptData(encryptedText, MASTER_KEY);

        // Đảm bảo kết quả giải mã khớp 100% với dữ liệu ban đầu
        expect(decryptedText).toBe(RAW_DATA);
    });

    it('Phải trả về null nếu dùng sai Master Password để giải mã', () => {
        const encryptedText = encryptData(RAW_DATA, MASTER_KEY);
        const WRONG_KEY = 'wrong-password';

        // Thử giải mã bằng key sai
        const decryptedText = decryptData(encryptedText, WRONG_KEY);

        // Đảm bảo hacker/người nhập sai pass sẽ nhận về null
        expect(decryptedText).toBeNull();
    });

    it('Phải văng lỗi (throw error) nếu truyền thiếu Key khi mã hóa', () => {
        // Kịch bản code bị lỗi gọi hàm mà quên truyền key
        expect(() => encryptData(RAW_DATA, '')).toThrowError();
    });
});