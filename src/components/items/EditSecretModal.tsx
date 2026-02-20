// Đường dẫn: src/components/items/EditSecretModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Save, Dices, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast'; // Thêm import này
import { updateSecretItem } from '../../services/itemService';
import { useVaultStore } from '../../store/vaultStore';
import type { VaultItem } from '../../types';

interface EditSecretModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    item: VaultItem;      // Nhận thông tin thẻ hiện tại (để lấy ID và Title)
    secretData: any;      // Nhận dữ liệu đã giải mã (để lấy Username, Password hiện tại)
}

export const EditSecretModal: React.FC<EditSecretModalProps> = ({ isOpen, onClose, onSuccess, item, secretData }) => {
    const masterKey = useVaultStore((state) => state.masterKey);
    const [loading, setLoading] = useState(false);

    // Khởi tạo state với dữ liệu cũ có sẵn
    const [title, setTitle] = useState(item.title);
    const [username, setUsername] = useState(secretData?.username || '');
    const [password, setPassword] = useState(secretData?.password || '');
    const [showPassword, setShowPassword] = useState(false);

    // Nếu Modal đóng, không render gì cả
    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !masterKey || !item.id) return;

        setLoading(true);
        try {
            const newPayload = { username, password };
            await updateSecretItem(item.id, title, newPayload, masterKey);

            onSuccess(); // Gọi hàm loadData để tải lại danh sách
            onClose();   // Đóng modal
            toast.success('Cập nhật thành công!');
        } catch (error) {
            toast.error('Có lỗi xảy ra khi cập nhật!');
        } finally {
            setLoading(false);
        }
    };
    // Hàm sinh mật khẩu siêu tốc (16 ký tự)
    const handleGeneratePassword = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
        let newPassword = '';
        for (let i = 0; i < 16; i++) {
            newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPassword(newPassword);
        toast.success('Đã tạo mật khẩu ngẫu nhiên siêu mạnh!'); // Khoe thư viện toast vừa cài luôn!
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-bold text-slate-800">Chỉnh Sửa Mật Khẩu</h3>
                    <button onClick={onClose} className="text-slate-400 hover:bg-slate-100 p-2 rounded-lg">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tên Dịch Vụ / Server *</label>
                        <input
                            required autoFocus type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tài khoản (Username)</label>
                        <input
                            type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    {/* <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu (Password)</label>
                        <input
                            type="text" value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div> */}

                    {/* <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu (Password)</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono tracking-wider text-blue-600 font-medium"

                                // className="w-full p-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={handleGeneratePassword}
                                title="Tạo mật khẩu ngẫu nhiên"
                                className="absolute right-2 top-2 p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <Dices size={20} />
                            </button>
                        </div>
                    </div> */}




                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu (Password)</label>
                        <div className="relative flex items-center">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 pr-20 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono tracking-wider text-blue-600 font-medium"
                                placeholder="••••••••"
                            />

                            {/* Nhóm 2 nút: Con mắt và Xúc xắc */}
                            <div className="absolute right-2 flex gap-1">
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleGeneratePassword}
                                    title="Tạo mật khẩu ngẫu nhiên"
                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <Dices size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 p-3 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium">
                            Hủy
                        </button>
                        <button type="submit" disabled={loading} className="flex-1 p-3 flex justify-center items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium disabled:opacity-50">
                            <Save size={18} /> {loading ? 'Đang lưu...' : 'Cập nhật'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};