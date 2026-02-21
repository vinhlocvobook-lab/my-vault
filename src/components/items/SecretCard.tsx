// Đường dẫn: src/components/items/SecretCard.tsx
import React, { useState } from 'react';
import { Copy, Trash2, Edit, Eye, EyeOff, FileText, Link as LinkIcon, ExternalLink } from 'lucide-react';
import type { VaultItem } from '../../types'; // SỬA: Đã thêm 'type'
import { decryptData } from '../../lib/crypto';
import { useVaultStore } from '../../store/vaultStore';
import { deleteItem } from '../../services/itemService'; // SỬA: Trỏ về đúng thư mục services
import { toast } from 'react-hot-toast';

interface SecretCardProps {
    item: VaultItem;
    onRefresh: () => void;
    onEdit: (item: VaultItem) => void; // Đã thêm onEdit vào đây
}

export const SecretCard: React.FC<SecretCardProps> = ({ item, onRefresh, onEdit }) => {
    const { masterKey } = useVaultStore();
    const [showPassword, setShowPassword] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    if (!masterKey) return null;

    const decryptedData = decryptData(item.content, masterKey);

    if (!decryptedData) {
        return (
            <div className="bg-red-50 p-5 rounded-xl border border-red-200 shadow-sm">
                <h3 className="font-semibold text-red-700">{item.title}</h3>
                <p className="text-sm text-red-500 mt-1">Lỗi giải mã! Có thể sai Master Password hoặc dữ liệu bị hỏng.</p>
            </div>
        );
    }

    const decryptedType = decryptedData.type || 'PASSWORD';

    const handleDelete = async () => {
        if (!window.confirm(`Bạn có chắc muốn xóa vĩnh viễn "${item.title}" không?`)) return;

        setIsDeleting(true);
        try {
            await deleteItem(item.id!);
            toast.success('Đã xóa dữ liệu thành công!');
            onRefresh();
        } catch (error: unknown) {
            toast.error(`Lỗi: ${error instanceof Error ? error.message : 'Không xóa được'}`);
            setIsDeleting(false);
        }
    };

    const handleCopy = (text: string, type: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);

        let msg = 'Đã copy thành công!';
        if (type === 'user') msg = 'Đã copy Username!';
        if (type === 'pass') msg = 'Đã copy Password!';
        if (type === 'note') msg = 'Đã copy Ghi chú!';
        if (type === 'url') msg = 'Đã copy Đường dẫn!';

        toast.success(msg);
    };

    return (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative group">
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg text-slate-800">{item.title}</h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                {decryptedType === 'PASSWORD' && (
                    <>
                        <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-xs text-slate-500 font-medium mb-0.5">Tài khoản</span>
                                <span className="text-slate-700 text-sm truncate">{decryptedData.username || '(trống)'}</span>
                            </div>
                            <button onClick={() => handleCopy(decryptedData.username, 'user')} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors ml-2 flex-shrink-0">
                                <Copy size={16} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <div className="flex flex-col w-full overflow-hidden">
                                <span className="text-xs text-slate-500 font-medium mb-0.5">Mật khẩu</span>
                                <span className="text-slate-700 font-mono tracking-wider text-sm truncate pr-2">
                                    {showPassword ? decryptedData.password : '••••••••••••'}
                                </span>
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                                <button onClick={() => setShowPassword(!showPassword)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                                <button onClick={() => handleCopy(decryptedData.password, 'pass')} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                                    <Copy size={16} />
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {decryptedType === 'NOTE' && (
                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 relative group/note">
                        <div className="flex items-center gap-2 text-amber-800 font-medium mb-1.5 text-sm">
                            <FileText size={16} />
                            <span>Ghi chú bí mật</span>
                        </div>
                        <p className="text-slate-700 whitespace-pre-wrap font-mono text-sm leading-relaxed max-h-32 overflow-y-auto pr-8">
                            {decryptedData.note || '(trống)'}
                        </p>
                        <button
                            onClick={() => handleCopy(decryptedData.note, 'note')}
                            className="absolute top-2 right-2 p-1.5 bg-white text-slate-400 hover:text-amber-600 rounded opacity-0 group-hover/note:opacity-100 transition-opacity shadow-sm border border-amber-100"
                            title="Copy Ghi chú"
                        >
                            <Copy size={16} />
                        </button>
                    </div>
                )}

                {decryptedType === 'LINK' && (
                    <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-2 overflow-hidden mr-2">
                            <LinkIcon size={18} className="text-blue-500 flex-shrink-0" />
                            <span className="text-blue-700 truncate text-sm font-medium">
                                {decryptedData.url || '(trống)'}
                            </span>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                            <button
                                onClick={() => handleCopy(decryptedData.url, 'url')}
                                className="p-1.5 text-blue-400 hover:text-blue-700 hover:bg-blue-100 rounded transition-colors"
                                title="Copy Link"
                            >
                                <Copy size={16} />
                            </button>
                            <a
                                href={decryptedData.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-blue-400 hover:text-blue-700 hover:bg-blue-100 rounded transition-colors"
                                title="Mở Link trong tab mới"
                            >
                                <ExternalLink size={16} />
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};