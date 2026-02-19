// Đường dẫn: src/components/items/SecretCard.tsx
import React, { useState } from 'react';
import { useVaultStore } from '../../store/vaultStore';
import { decryptData } from '../../lib/crypto';
import type { VaultItem } from '../../types';
import { Eye, EyeOff, Copy, Server } from 'lucide-react';

interface SecretCardProps {
    item: VaultItem;
}

export const SecretCard: React.FC<SecretCardProps> = ({ item }) => {
    // 1. Lấy Master Key từ bộ nhớ đệm (RAM)
    const masterKey = useVaultStore((state) => state.masterKey);

    // 2. State quản lý UI
    const [showPassword, setShowPassword] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');

    // 3. Logic Giải mã dữ liệu
    let secretData: any = null;
    if (item.is_encrypted && masterKey) {
        const decryptedString = decryptData(item.content, masterKey);
        if (decryptedString) {
            try {
                secretData = JSON.parse(decryptedString); // Chuyển chuỗi JSON thành Object
            } catch (e) {
                console.error('Lỗi parse JSON cấu trúc Secret');
            }
        }
    }

    // Hàm xử lý copy nhanh
    const handleCopy = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopySuccess(type);
        setTimeout(() => setCopySuccess(''), 2000); // Ẩn thông báo sau 2s
    };

    // Nếu giải mã thất bại (Sai pass hoặc chưa nhập pass)
    if (!secretData) {
        return (
            <div className="p-4 border border-red-500 bg-red-50 rounded-lg text-red-600">
                🔒 Không thể giải mã dữ liệu. Vui lòng kiểm tra lại Master Key!
            </div>
        );
    }

    // 4. Render Giao diện khi giải mã thành công
    return (
        <div className="p-5 border border-gray-200 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow">
            {/* Tiêu đề & Icon */}
            <div className="flex items-center gap-3 mb-4 border-b pb-3">
                <Server className="text-blue-600" size={24} />
                <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
            </div>

            {/* Thông tin chi tiết */}
            <div className="space-y-3">
                {/* Username */}
                {secretData.username && (
                    <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <span className="text-sm font-medium text-gray-500 w-24">User:</span>
                        <span className="font-mono text-gray-800 flex-1">{secretData.username}</span>
                        <button
                            onClick={() => handleCopy(secretData.username, 'user')}
                            className="p-1.5 text-gray-400 hover:text-blue-600 rounded"
                            title="Copy Username"
                        >
                            <Copy size={16} />
                        </button>
                    </div>
                )}

                {/* Password */}
                {secretData.password && (
                    <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <span className="text-sm font-medium text-gray-500 w-24">Pass:</span>
                        <span className="font-mono text-gray-800 flex-1">
                            {showPassword ? secretData.password : '••••••••••••'}
                        </span>

                        <div className="flex gap-1">
                            <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 rounded"
                                title={showPassword ? "Ẩn" : "Hiện"}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                            <button
                                onClick={() => handleCopy(secretData.password, 'pass')}
                                className="p-1.5 text-gray-400 hover:text-blue-600 rounded"
                                title="Copy Password"
                            >
                                <Copy size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Thông báo Copy */}
                {copySuccess && (
                    <div className="text-xs text-green-600 text-right animate-pulse">
                        Đã copy {copySuccess === 'user' ? 'Username' : 'Password'}!
                    </div>
                )}
            </div>
        </div>
    );
};