import React, { useState } from 'react';
import { X, Save, Dices, Eye, EyeOff, KeyRound, FileText, Link as LinkIcon } from 'lucide-react';
import { useVaultStore } from '../../store/vaultStore';
import { createSecretItem } from '../../services/itemService'; // SỬA: Lấy từ itemService
import { toast } from 'react-hot-toast';

interface AddSecretModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddSecretModal: React.FC<AddSecretModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [itemType, setItemType] = useState<'PASSWORD' | 'NOTE' | 'LINK'>('PASSWORD');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [note, setNote] = useState('');
    const [url, setUrl] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const { masterKey } = useVaultStore();

    const handleGeneratePassword = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
        let newPassword = '';
        for (let i = 0; i < 16; i++) {
            newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPassword(newPassword);
        toast.success('Đã tạo mật khẩu ngẫu nhiên!');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !masterKey) return;

        setIsSubmitting(true);
        try {
            const payload: Record<string, string> = { type: itemType };

            if (itemType === 'PASSWORD') {
                payload.username = username;
                payload.password = password;
            } else if (itemType === 'NOTE') {
                payload.note = note;
            } else if (itemType === 'LINK') {
                payload.url = url;
            }

            await createSecretItem(title, payload, masterKey); // SỬA: Dùng hàm của bạn

            setTitle(''); setUsername(''); setPassword(''); setNote(''); setUrl('');
            setItemType('PASSWORD');

            onSuccess();
            onClose();
            toast.success('Đã thêm dữ liệu an toàn vào Két!');
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi lưu!');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold text-slate-800">Thêm Dữ Liệu Mới</h2>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tiêu đề (VD: Github, Thẻ Visa...)</label>
                        <input
                            autoFocus
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Nhập tiêu đề..."
                        />
                    </div>

                    <div className="flex bg-slate-100 p-1 rounded-lg mt-2 mb-4">
                        <button type="button" onClick={() => setItemType('PASSWORD')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${itemType === 'PASSWORD' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
                            <KeyRound size={16} /> Mật khẩu
                        </button>
                        <button type="button" onClick={() => setItemType('NOTE')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${itemType === 'NOTE' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
                            <FileText size={16} /> Ghi chú
                        </button>
                        <button type="button" onClick={() => setItemType('LINK')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${itemType === 'LINK' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
                            <LinkIcon size={16} /> Đường dẫn
                        </button>
                    </div>

                    <div className="space-y-4 min-h-[140px]">
                        {itemType === 'PASSWORD' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Tài khoản (Username / Email)</label>
                                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="admin, email@..." />
                                </div>
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
                                        <div className="absolute right-2 flex gap-1">
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                            <button type="button" onClick={handleGeneratePassword} title="Tạo mật khẩu tự động" className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Dices size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {itemType === 'NOTE' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nội dung ghi chú bí mật</label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    rows={4}
                                    placeholder="Nhập mã Recovery Code, thẻ tín dụng, văn bản riêng tư..."
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                />
                            </div>
                        )}

                        {itemType === 'LINK' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Đường dẫn bí mật (URL)</label>
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-blue-600"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4 border-t mt-6">
                        <button type="button" onClick={onClose} className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors">
                            Hủy
                        </button>
                        <button type="submit" disabled={isSubmitting} className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50">
                            <Save size={18} />
                            {isSubmitting ? 'Đang lưu...' : 'Lưu vào Két'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};