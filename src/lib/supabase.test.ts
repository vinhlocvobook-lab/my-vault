// Đường dẫn: src/lib/supabase.test.ts
import { describe, it, expect } from 'vitest';
import { supabase } from './supabase';

describe('Supabase Client Init', () => {
    it('Phải khởi tạo được Supabase Client mà không bị lỗi', () => {
        // Nếu biến môi trường bị thiếu, file supabase.ts sẽ throw Error
        // Việc chúng ta import được 'supabase' vào đây và nó không undefined
        // chứng tỏ client đã được tạo thành công!
        expect(supabase).toBeDefined();

        // Kiểm tra xem các module cốt lõi của Supabase có tồn tại không
        expect(supabase.auth).toBeDefined();
        expect(supabase.from).toBeDefined();
    });
});