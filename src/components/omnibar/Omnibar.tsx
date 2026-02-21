// Đường dẫn: src/components/omnibar/Omnibar.tsx
import React, { useState, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';
import { Search, Server, Link as LinkIcon, FileText, X } from 'lucide-react';
import type { VaultItem } from '../../types';

// Dữ liệu giả lập để test search
const mockDatabase: VaultItem[] = [
    { id: '1', type: 'SECRET', title: 'Production DB Server (AWS)', is_encrypted: true, content: '' },
    { id: '2', type: 'SECRET', title: 'Staging Server (DigitalOcean)', is_encrypted: true, content: '' },
    { id: '3', type: 'LINK', title: 'Tài liệu API Stripe', is_encrypted: false, content: '' },
    { id: '4', type: 'NOTE', title: 'Hướng dẫn cài đặt Nginx', is_encrypted: false, content: '' },
];

// Cấu hình Fuse.js (Tìm kiếm theo cột title)
// const fuse = new Fuse(mockDatabase, {
//     keys: ['title'],
//     threshold: 0.4, // Độ "mờ": 0 là phải gõ chính xác 100%, 1 là gõ bừa cũng ra
// });
const fuse = new Fuse(mockDatabase, {
    keys: ['title'],
    threshold: 0.5,           // Tăng độ "mờ" lên một chút (0.5 thay vì 0.4)
    ignoreLocation: true,     // QUAN TRỌNG: Tìm từ khóa ở BẤT CỨ ĐÂU trong câu, không quan trọng đầu hay cuối
    minMatchCharLength: 2,    // Phải gõ ít nhất 2 chữ cái thì mới bắt đầu tìm (chống nhiễu)
});
export const Omnibar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Lắng nghe sự kiện bàn phím toàn cục
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Nhấn Cmd+K hoặc Ctrl+K để mở/đóng
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen((open) => {
                    if (!open) setQuery(''); // Xóa text cũ khi mở lại
                    return !open;
                });
            }
            // Nhấn Esc để đóng
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Tự động focus vào ô input khi vừa mở lên
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Thực hiện tìm kiếm
    const searchResults = query ? fuse.search(query).map(result => result.item) : mockDatabase;

    return (
        // Lớp phủ đen mờ (Overlay)
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-slate-900/50 backdrop-blur-sm">
            {/* Khung Omnibar */}
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">

                {/* Ô nhập liệu */}
                <div className="flex items-center px-4 border-b border-slate-100">
                    <Search className="text-slate-400" size={24} />
                    <input
                        ref={inputRef}
                        type="text"
                        className="w-full px-4 py-4 text-lg text-slate-800 bg-transparent outline-none placeholder:text-slate-300"
                        placeholder="Tìm kiếm server, ghi chú, link... (Thử gõ 'aws' hoặc 'nginx')"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Danh sách kết quả */}
                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {searchResults.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            Không tìm thấy kết quả nào cho "{query}"
                        </div>
                    ) : (
                        searchResults.map((item) => (
                            <button
                                key={item.id}
                                className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors text-left group"
                            >
                                {/* Icon động dựa theo Type */}
                                <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                    {item.type === 'SECRET' && <Server size={20} />}
                                    {item.type === 'LINK' && <LinkIcon size={20} />}
                                    {item.type === 'NOTE' && <FileText size={20} />}
                                </div>

                                <div className="flex-1">
                                    <h4 className="font-semibold text-slate-800">{item.title}</h4>
                                    <span className="text-xs text-slate-400 font-mono">{item.type}</span>
                                </div>

                                <div className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    ↵ Mở
                                </div>
                            </button>
                        ))
                    )}
                </div>

                {/* Footer hướng dẫn phím tắt */}
                <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-white border rounded">↑</kbd><kbd className="px-1.5 py-0.5 bg-white border rounded">↓</kbd> Điều hướng</span>
                    <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-white border rounded">↵</kbd> Chọn</span>
                    <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-white border rounded">Esc</kbd> Đóng</span>
                </div>
            </div>
        </div>
    );
};