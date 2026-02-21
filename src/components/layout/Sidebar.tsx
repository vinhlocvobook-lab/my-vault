// Đường dẫn: src/components/layout/Sidebar.tsx
import { Shield, Book, CheckSquare, Search, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
        ? 'bg-blue-600/20 text-blue-400'
        : 'text-slate-300 hover:bg-slate-800'
    }`;

export const Sidebar = () => {
    return (
        <aside className="w-64 bg-slate-900 text-slate-300 h-screen flex flex-col">
            {/* Logo / Header */}
            <div className="p-6 flex items-center gap-3 text-white">
                <Shield size={28} className="text-blue-500" />
                <h1 className="text-xl font-bold tracking-wider">MY VAULT</h1>
            </div>

            {/* Menu Navigation */}
            <nav className="flex-1 px-4 space-y-2 mt-4">
                <NavLink to="/" end className={navLinkClass}>
                    <Shield size={20} />
                    <span className="font-medium">Két Mật Khẩu</span>
                </NavLink>
                <NavLink to="/notes" className={navLinkClass}>
                    <Book size={20} />
                    <span className="font-medium">Ghi chú & Links</span>
                </NavLink>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors">
                    <CheckSquare size={20} />
                    <span className="font-medium">To-do List</span>
                </button>
            </nav>

            {/* Nút Search nhanh (Gợi ý Ctrl+K) */}
            <div className="p-4">
                <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700 transition-colors">
                    <div className="flex items-center gap-2">
                        <Search size={18} />
                        <span>Tìm kiếm...</span>
                    </div>
                    <kbd className="bg-slate-900 px-2 py-1 rounded text-xs font-mono">⌘K</kbd>
                </button>
            </div>

            {/* Settings */}
            <div className="p-4 border-t border-slate-800 mt-auto">
                <NavLink to="/settings" className={navLinkClass}>
                    <Settings size={20} />
                    <span className="font-medium">Cài đặt</span>
                </NavLink>
            </div>
        </aside>
    );
};