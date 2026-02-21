import { useEffect, useState, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { SecretCard } from '../components/items/SecretCard';
import { MainLayout } from '../components/layout/MainLayout';
import { Pagination } from '../components/layout/Pagination';
import { useAuth } from '../hooks/useAuth';
import { useVaultStore } from '../store/vaultStore';
import { getItems } from '../services/itemService';
import { AddSecretModal } from '../components/items/AddSecretModal';
import { EditSecretModal } from '../components/items/EditSecretModal';
import type { VaultItem } from '../types';
import { supabase } from '../lib/supabase';
import { useAutoLock } from '../hooks/useAutoLock';
import { decryptData } from '../lib/crypto';
import { Plus, LogOut, Lock } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

export const VaultDashboard = () => {
    const { session } = useAuth();
    const { masterKey, lockVault } = useVaultStore();

    const [items, setItems] = useState<VaultItem[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<VaultItem | null>(null);

    useAutoLock();

    const loadData = useCallback(async () => {
        setIsFetching(true);
        try {
            const data = await getItems();

            if (data.length > 0 && masterKey) {
                const testItem = data[0];
                const isCorrectKey = decryptData(testItem.content, masterKey);

                if (!isCorrectKey) {
                    toast.error('Sai Master Password! Vui lòng thử lại.', { icon: '❌' });
                    lockVault();
                    return;
                }
            }

            setItems(data);
        } catch {
            toast.error('Không thể tải dữ liệu!');
        } finally {
            setIsFetching(false);
        }
    }, [masterKey, lockVault]);

    useEffect(() => {
        if (session && masterKey) {
            loadData();
        }
    }, [session, masterKey, loadData]);

    // Filter chỉ hiển thị items loại PASSWORD
    const passwordItems = useMemo(() => {
        if (!masterKey) return [];

        return items.filter((item) => {
            const decrypted = decryptData(item.content, masterKey);
            if (!decrypted) return false;
            const type = decrypted.type || 'PASSWORD';
            return type === 'PASSWORD';
        });
    }, [items, masterKey]);

    // Reset về trang 1 khi danh sách thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [passwordItems.length]);

    // Phân trang
    const totalPages = Math.ceil(passwordItems.length / ITEMS_PER_PAGE);
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return passwordItems.slice(start, start + ITEMS_PER_PAGE);
    }, [passwordItems, currentPage]);

    const handleLogout = async () => {
        lockVault();
        await supabase.auth.signOut();
    };

    const handleEditClick = (item: VaultItem) => {
        setEditingItem(item);
        setIsEditModalOpen(true);
    };

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 flex justify-between items-end border-b pb-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">Két Mật Khẩu</h2>
                        <p className="text-slate-500 mt-2">Đăng nhập với: {session?.user?.email}</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus size={18} /> Thêm Mới
                        </button>
                        <button
                            onClick={() => {
                                lockVault();
                                toast('Đã khóa két sắt!', { icon: '🔒' });
                            }}
                            className="flex items-center gap-2 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors"
                        >
                            <Lock size={18} /> Khóa Két
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                            <LogOut size={18} /> Đăng xuất
                        </button>
                    </div>
                </header>

                {isFetching ? (
                    <div className="text-center text-slate-500 mt-10">Đang đồng bộ dữ liệu...</div>
                ) : passwordItems.length === 0 ? (
                    <div className="text-center text-slate-500 mt-10 p-10 border-2 border-dashed rounded-xl">
                        Két sắt của bạn đang trống. Hãy bấm "Thêm Mới" nhé!
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {paginatedItems.map((item) => (
                                <SecretCard
                                    key={item.id}
                                    item={item}
                                    onRefresh={loadData}
                                    onEdit={handleEditClick}
                                />
                            ))}
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            totalItems={passwordItems.length}
                            itemsPerPage={ITEMS_PER_PAGE}
                        />
                    </>
                )}

                <AddSecretModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSuccess={loadData}
                />

                <EditSecretModal
                    item={editingItem}
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setEditingItem(null);
                    }}
                    onSuccess={loadData}
                />
            </div>
        </MainLayout>
    );
};

export default VaultDashboard;

