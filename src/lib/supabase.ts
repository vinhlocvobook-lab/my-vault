// Đường dẫn: src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Đọc biến môi trường do Vite cung cấp
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Thiếu biến môi trường Supabase! Vui lòng kiểm tra file .env');
}

// Khởi tạo và export client để các file khác dùng chung
export const supabase = createClient(supabaseUrl, supabaseAnonKey);