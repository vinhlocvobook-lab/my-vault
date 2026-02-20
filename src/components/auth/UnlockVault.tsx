// Đường dẫn: src/components/auth/UnlockVault.tsx
import React, { useState } from 'react';
import { toast } from 'react-hot-toast'; // Thêm import này
import { useVaultStore } from '../../store/vaultStore';
import { KeyRound, Eye, EyeOff } from 'lucide-react';


export const UnlockVault = () => {
    const [password, setPassword] = useState('');
    const unlockVault = useVaultStore((state) => state.unlockVault);
    const [showPassword, setShowPassword] = useState(false);

    // const handleUnlock = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     if (password.trim().length < 6) {
    //         toast.error('Master Password phải có ít nhất 6 ký tự!');
    //         return;
    //     }
    //     // Đưa mật khẩu vào RAM (Zustand Store)
    //     unlockVault(password);
    // };
    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        if (password.trim().length < 6) {
            toast.error('Master Password phải có ít nhất 6 ký tự!'); // Thay alert
            return;
        }

        unlockVault(password);
        toast.success('Mở khóa thành công!'); // Thêm thông báo chào mừng
        // THÊM 3 DÒNG NÀY VÀO ĐÂY: Xin quyền gửi thông báo khi user bấm nút
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    };
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                        <KeyRound size={32} className="text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Mở Khóa Két Sắt</h2>
                    <p className="text-slate-400 text-center text-sm">
                        Vui lòng nhập Master Password để giải mã dữ liệu của bạn.
                        <br />
                        <span className="text-red-400">Chú ý: Chúng tôi không lưu mật khẩu này!</span>
                    </p>
                </div>

                <form onSubmit={handleUnlock} className="space-y-6">
                    <div className="relative">
                        <input
                            // type="password"
                            type={showPassword ? 'text' : 'password'} // Linh hoạt đổi type
                            autoFocus
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập Master Password..."
                            className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl border border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-center tracking-widest"
                        />
                        {/* Nút bấm Ẩn/Hiện Mật khẩu */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            // className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-400 transition-colors"
                            className="absolute right-10 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-400 transition-colors"

                            title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                    >
                        Mở Khóa
                    </button>
                </form>
            </div>
        </div>
    );
};