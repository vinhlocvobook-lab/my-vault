// Đường dẫn: src/lib/crypto.ts
import CryptoJS from 'crypto-js';

/**
 * Mã hóa một chuỗi dữ liệu
 * @param data Dữ liệu gốc cần mã hóa (ví dụ: password123)
 * @param secretKey Master Password của bạn
 * @returns Chuỗi đã mã hóa (Ciphertext)
 */
export const encryptData = (data: string, secretKey: string): string => {
    if (!data || !secretKey) throw new Error('Thiếu dữ liệu hoặc Key mã hóa');
    return CryptoJS.AES.encrypt(data, secretKey).toString();
};

/**
 * Giải mã một chuỗi dữ liệu
 * @param ciphertext Chuỗi đã bị mã hóa
 * @param secretKey Master Password của bạn
 * @returns Dữ liệu gốc, trả về null nếu sai Key
 */
export const decryptData = (ciphertext: string, secretKey: string): string | null => {
    if (!ciphertext || !secretKey) return null;

    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);

        // Nếu giải mã thất bại (sai key), originalText sẽ là chuỗi rỗng
        if (!originalText) return null;

        return originalText;
    } catch (error) {
        return null; // Bắt lỗi nếu chuỗi ciphertext bị hỏng
    }
};