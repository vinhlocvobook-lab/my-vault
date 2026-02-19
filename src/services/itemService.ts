// Đường dẫn: src/services/itemService.ts
import { supabase } from '../lib/supabase';
import { encryptData } from '../lib/crypto';
import type { VaultItem } from '../types';

/**
 * Tạo một Secret mới (Password, Server Credential...)
 * Hàm này tự động mã hóa content trước khi đẩy lên DB.
 */
export const createSecretItem = async (
    title: string,
    secretPayload: object,
    masterKey: string
): Promise<VaultItem> => {

    // 1. Chuyển Object dữ liệu thành chuỗi JSON và MÃ HÓA nó
    const jsonString = JSON.stringify(secretPayload);
    const encryptedContent = encryptData(jsonString, masterKey);

    // 2. Chuẩn bị gói dữ liệu để gửi lên Supabase
    const newItem = {
        type: 'SECRET',
        title: title,
        is_encrypted: true,
        content: encryptedContent, // Đã bị mã hóa, Supabase không thể đọc được
    };

    // 3. Gọi API của Supabase để lưu vào bảng 'items'
    const { data, error } = await supabase
        .from('items')
        .insert([newItem])
        .select()
        .single();

    if (error) {
        throw new Error(`Lỗi khi lưu DB: ${error.message}`);
    }

    return data;
};