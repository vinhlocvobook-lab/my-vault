// Đường dẫn: src/types/index.ts

export type ItemType = 'LINK' | 'SECRET' | 'NOTE' | 'TODO' | 'IDEA' | 'SNIPPET';

// Cấu trúc của một Item lưu trong Database
export interface VaultItem {
    id?: string;
    user_id?: string;
    type: ItemType;
    title: string;
    is_encrypted: boolean;
    content: any; // Sẽ là chuỗi string (nếu bị mã hóa) hoặc object (nếu là plain text)
    tags?: string[];
    created_at?: string;
}