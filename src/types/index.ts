// Đường dẫn: src/types/index.ts

export type ItemType = 'LINK' | 'SECRET' | 'NOTE' | 'TODO' | 'IDEA' | 'SNIPPET';

// Cấu trúc của một Item lưu trong Database
export interface VaultItem {
    id?: string;
    user_id?: string;
    type: ItemType;
    title: string;
    is_encrypted: boolean;
    content: string; // Chuỗi string đã mã hóa (encrypted)
    tags?: string[];
    created_at?: string;
}