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

    // 1. LẤY THÔNG TIN USER ĐANG ĐĂNG NHẬP (Dòng code mới thêm)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error('Bạn chưa đăng nhập!');
    }

    const jsonString = JSON.stringify(secretPayload);
    const encryptedContent = encryptData(jsonString, masterKey);

    const newItem = {
        user_id: user.id, // 2. GẮN ID CỦA USER VÀO ĐÂY ĐỂ SUPABASE CHẤP NHẬN
        type: 'SECRET',
        title: title,
        is_encrypted: true,
        content: encryptedContent,
    };

    const { data, error } = await supabase
        .from('items')
        .insert([newItem])
        .select()
        .single();

    if (error) {
        // In lỗi chi tiết ra màn hình console để dễ debug nếu có lỗi khác
        console.error('Lỗi chi tiết từ Supabase:', error);
        throw new Error(`Lỗi khi lưu DB: ${error.message}`);
    }

    return data;
};
export const getItems = async (): Promise<VaultItem[]> => {
    const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false }); // Sắp xếp mới nhất lên đầu

    if (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        throw new Error(error.message);
    }

    return data || [];
};