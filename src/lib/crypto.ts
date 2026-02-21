// Đường dẫn: src/lib/crypto.ts
import CryptoJS from 'crypto-js';

/**
 * Mã hóa dữ liệu (object hoặc string)
 * @param data Dữ liệu gốc cần mã hóa — nếu là object sẽ tự JSON.stringify
 * @param secretKey Master Password của bạn
 * @returns Chuỗi đã mã hóa (Ciphertext)
 */
export const encryptData = (data: unknown, secretKey: string): string => {
    if (!data || !secretKey) throw new Error('Thiếu dữ liệu hoặc Key mã hóa');
    const plainText = typeof data === 'string' ? data : JSON.stringify(data);
    return CryptoJS.AES.encrypt(plainText, secretKey).toString();
};

/**
 * Giải mã dữ liệu và tự parse JSON
 * @param ciphertext Chuỗi đã bị mã hóa
 * @param secretKey Master Password của bạn
 * @returns Dữ liệu gốc đã parse, trả về null nếu sai Key
 */
export const decryptData = (ciphertext: string, secretKey: string): any | null => {
    if (!ciphertext || !secretKey) return null;

    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);

        // Nếu giải mã thất bại (sai key), originalText sẽ là chuỗi rỗng
        if (!originalText) return null;

        return JSON.parse(originalText);
    } catch {
        return null; // Bắt lỗi nếu chuỗi ciphertext bị hỏng hoặc parse thất bại
    }
};