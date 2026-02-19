// Đường dẫn: src/components/auth/UnlockVault.tsx
import React, { useState } from 'react';
import { useVaultStore } from '../../store/vaultStore';
import { KeyRound } from 'lucide-react';

export const UnlockVault = () => {
    const [password, setPassword] = useState('');
    const unlockVault = useVaultStore((state) => state.unlockVault);

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        if (password.trim().length < 6) {
            alert('Master Password phải có ít nhất 6 ký tự!');
            return;
        }
        // Đưa mật khẩu vào RAM (Zustand Store)
        unlockVault(password);
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
                    <div>
                        <input
                            type="password"
                            autoFocus
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập Master Password..."
                            className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl border border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-center tracking-widest"
                        />
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