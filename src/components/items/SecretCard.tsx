// Đường dẫn: src/components/items/SecretCard.tsx
import React, { useState } from 'react';
import { toast } from 'react-hot-toast'; // Thêm import này
import { useVaultStore } from '../../store/vaultStore';
import { decryptData } from '../../lib/crypto';
import type { VaultItem } from '../../types';
import { deleteItem } from '../../services/itemService'; // 1. Import hàm xóa
import { EditSecretModal } from './EditSecretModal'; // Thêm dòng này
import { Eye, EyeOff, Copy, Server, Trash2, Edit } from 'lucide-react';

interface SecretCardProps {
    item: VaultItem;
    onRefresh: () => void;
}

export const SecretCard: React.FC<SecretCardProps> = ({ item, onRefresh }) => {
    // 1. Lấy Master Key từ bộ nhớ đệm (RAM)
    const masterKey = useVaultStore((state) => state.masterKey);

    // 2. State quản lý UI
    const [showPassword, setShowPassword] = useState(false);
    // const [copySuccess, setCopySuccess] = useState('');
    const [isDeleting, setIsDeleting] = useState(false); // State để tạo hiệu ứng loading khi xóa
    const [isEditOpen, setIsEditOpen] = useState(false); // Thêm dòng này
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
    // Hàm xử lý Xóa
    // const handleDelete = async () => {
    //     if (!window.confirm(`Bạn có chắc muốn xóa vĩnh viễn "${item.title}" không?`)) return;

    //     setIsDeleting(true);
    //     try {
    //         await deleteItem(item.id!);
    //         onRefresh(); // Xóa xong thì gọi hàm load lại danh sách ở App.tsx
    //     } catch (error) {
    //         alert('Lỗi khi xóa!');
    //         setIsDeleting(false);
    //     }
    // };
    // Hàm xử lý Xóa
    const handleDelete = async () => {
        if (!window.confirm(`Bạn có chắc muốn xóa vĩnh viễn "${item.title}" không?`)) return;

        setIsDeleting(true);
        try {
            await deleteItem(item.id!);
            toast.success('Đã xóa thẻ này!');
            onRefresh();
        } catch (error: any) { // Thêm chữ : any vào đây
            // Báo lỗi chi tiết thay vì báo chung chung
            toast.error(`Lỗi chi tiết: ${error.message}`);
            setIsDeleting(false);
        }
    };
    // Hàm xử lý copy nhanh
    // const handleCopy = (text: string, type: string) => {
    //     navigator.clipboard.writeText(text);
    //     setCopySuccess(type);
    //     setTimeout(() => setCopySuccess(''), 2000); // Ẩn thông báo sau 2s
    // };
    const handleCopy = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        // Thay toàn bộ logic cũ bằng 1 dòng toast siêu đẹp
        toast.success(`Đã copy ${type === 'user' ? 'Username' : 'Password'}`);
    };
    // Nếu giải mã thất bại (Sai pass hoặc chưa nhập pass)
    if (!secretData) {
        return (
            <div className="p-4 border border-red-500 bg-red-50 rounded-lg text-red-600 relative flex justify-between items-center">
                <span>🔒 Không thể giải mã dữ liệu.</span>
                <button onClick={handleDelete} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-100 rounded">
                    <Trash2 size={18} />
                </button>
            </div>
        );
    }

    // 4. Render Giao diện khi giải mã thành công
    return (
        <>
            <div className={`p-5 border border-slate-200 rounded-xl shadow-sm bg-white hover:shadow-md transition-all relative ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}>
                {/* Nút Xóa */}
                {/* <button
                onClick={handleDelete}
                className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Xóa thẻ này"
            >
                <Trash2 size={18} />
            </button> */}

                {/* Nhóm Nút Xóa và Sửa góc phải */}
                <div className="absolute top-4 right-4 flex gap-1">
                    <button
                        onClick={() => setIsEditOpen(true)} // Mở modal sửa
                        className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa thẻ này"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa thẻ này"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
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
                    {/* {copySuccess && (
                        <div className="text-xs text-green-600 text-right animate-pulse">
                            Đã copy {copySuccess === 'user' ? 'Username' : 'Password'}!
                        </div>
                    )} */}
                </div>

            </div>
            {/* Nhúng Modal Chỉnh sửa vào đây (Chỉ render khi secretData giải mã thành công) */}
            {secretData && (
                <EditSecretModal
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    onSuccess={onRefresh} // Cập nhật xong thì tải lại dữ liệu ngoài App.tsx
                    item={item}           // Truyền dữ liệu cũ vào
                    secretData={secretData} // Truyền pass cũ vào
                />
            )}
        </>
    );
};