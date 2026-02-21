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
import { Plus, LogOut, Lock, FileText, Link as LinkIcon, Layers } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

type FilterTab = 'ALL' | 'NOTE' | 'LINK';

export const NotesPage = () => {
    const { session } = useAuth();
    const { masterKey, lockVault } = useVaultStore();

    const [items, setItems] = useState<VaultItem[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
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

    // Filter chỉ lấy items NOTE và LINK
    const filteredItems = useMemo(() => {
        if (!masterKey) return [];

        return items.filter((item) => {
            const decrypted = decryptData(item.content, masterKey);
            if (!decrypted) return false;

            const type = decrypted.type || 'PASSWORD';

            if (type === 'PASSWORD') return false; // Loại bỏ PASSWORD

            if (activeTab === 'ALL') return true;
            return type === activeTab;
        });
    }, [items, masterKey, activeTab]);

    // Reset về trang 1 khi filter thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, filteredItems.length]);

    // Phân trang
    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredItems.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredItems, currentPage]);

    const handleLogout = async () => {
        lockVault();
        await supabase.auth.signOut();
    };

    const handleEditClick = (item: VaultItem) => {
        setEditingItem(item);
        setIsEditModalOpen(true);
    };

    const tabs: { key: FilterTab; label: string; icon: React.ReactNode }[] = [
        { key: 'ALL', label: 'Tất cả', icon: <Layers size={16} /> },
        { key: 'NOTE', label: 'Ghi chú', icon: <FileText size={16} /> },
        { key: 'LINK', label: 'Đường dẫn', icon: <LinkIcon size={16} /> },
    ];

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 flex justify-between items-end border-b pb-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">Ghi Chú & Đường Dẫn</h2>
                        <p className="text-slate-500 mt-2">Đăng nhập với: {session?.user?.email}</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
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

                {/* Tab Filter */}
                <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-all ${activeTab === tab.key
                                ? 'bg-white shadow text-amber-600'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {isFetching ? (
                    <div className="text-center text-slate-500 mt-10">Đang đồng bộ dữ liệu...</div>
                ) : filteredItems.length === 0 ? (
                    <div className="text-center text-slate-500 mt-10 p-10 border-2 border-dashed rounded-xl">
                        <FileText size={48} className="mx-auto mb-3 text-slate-300" />
                        <p>Chưa có ghi chú hay đường dẫn nào.</p>
                        <p className="text-sm mt-1">Hãy bấm "Thêm Mới" để bắt đầu nhé!</p>
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
                            totalItems={filteredItems.length}
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

export default NotesPage;
