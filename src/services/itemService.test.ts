// Đường dẫn: src/services/itemService.test.ts
import { describe, it, expect, vi } from 'vitest';
import { createSecretItem } from './itemService';

// 1. Dùng vi.hoisted để khởi tạo các hàm mock trước khi vi.mock chạy
const { mockFrom, mockInsert } = vi.hoisted(() => {
    const mSingle = vi.fn().mockResolvedValue({
        data: {
            id: 'fake-uuid',
            type: 'SECRET',
            title: 'My Server',
            is_encrypted: true,
            content: 'U2FsdGVk...mock_encrypted_string'
        },
        error: null
    });

    const mSelect = vi.fn().mockReturnValue({ single: mSingle });
    const mInsert = vi.fn().mockReturnValue({ select: mSelect });
    const mFrom = vi.fn().mockReturnValue({ insert: mInsert });

    // Trả về những hàm mock mà chúng ta muốn sử dụng để test ở bên dưới
    return { mockFrom: mFrom, mockInsert: mInsert };
});

// 2. Bây giờ vi.mock có thể gọi mockFrom thoải mái mà không sợ lỗi
vi.mock('../lib/supabase', () => ({
    supabase: {
        from: mockFrom
    }
}));

describe('Item Service (Tầng Dữ Liệu)', () => {
    it('Phải mã hóa payload và gọi Supabase insert thành công', async () => {
        const masterKey = 'super-secret';
        const payload = { type: 'PASSWORD' as const, username: 'admin', password: '123' };

        // Thực thi hàm lưu Secret
        const result = await createSecretItem('My Server', payload, masterKey);

        // Kiểm tra kết quả
        expect(result).toBeDefined();
        expect(result.id).toBe('fake-uuid');
        expect(result.title).toBe('My Server');

        // Kiểm tra xem các hàm Supabase có được gọi đúng tham số không
        expect(mockFrom).toHaveBeenCalledWith('items');
        expect(mockInsert).toHaveBeenCalledWith([
            expect.objectContaining({
                type: 'SECRET',
                title: 'My Server',
                is_encrypted: true,
            })
        ]);
    });
});