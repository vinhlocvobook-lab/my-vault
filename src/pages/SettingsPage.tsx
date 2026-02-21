import { useAuth } from '../hooks/useAuth';
import { useVaultStore } from '../store/vaultStore';
import { useSettingsStore, AUTO_LOCK_OPTIONS } from '../store/settingsStore';
import { MainLayout } from '../components/layout/MainLayout';
import { useAutoLock } from '../hooks/useAutoLock';
import { supabase } from '../lib/supabase';
import { Timer, Shield, LogOut, Lock, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const SettingsPage = () => {
    const { session } = useAuth();
    const { lockVault } = useVaultStore();
    const { autoLockTimeout, setAutoLockTimeout } = useSettingsStore();

    useAutoLock();

    const handleLogout = async () => {
        lockVault();
        await supabase.auth.signOut();
    };

    const currentOption = AUTO_LOCK_OPTIONS.find((o) => o.value === autoLockTimeout);

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto">
                <header className="mb-8 flex justify-between items-end border-b pb-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">Cài Đặt</h2>
                        <p className="text-slate-500 mt-2">Đăng nhập với: {session?.user?.email}</p>
                    </div>
                    <div className="flex gap-3">
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

                {/* Auto Lock Section */}
                <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Timer size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800">Tự Động Khóa</h3>
                                <p className="text-sm text-slate-500">
                                    Tự khóa két khi bạn chuyển sang tab khác hoặc minimize trình duyệt
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {AUTO_LOCK_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setAutoLockTimeout(option.value);
                                        toast.success(`Đã đặt thời gian tự khóa: ${option.label}`);
                                    }}
                                    className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${autoLockTimeout === option.value
                                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                                            : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
                            <Info size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-amber-800">
                                <p>
                                    <strong>Hiện tại:</strong> {currentOption?.label || `${autoLockTimeout / 1000}s`}
                                </p>
                                <p className="mt-1 text-amber-700">
                                    {autoLockTimeout === 0
                                        ? 'Két sắt sẽ không tự động khóa. Hãy bấm "Khóa Két" thủ công khi rời đi.'
                                        : `Két sắt sẽ tự khóa sau ${currentOption?.label || ''} khi bạn chuyển tab hoặc minimize trình duyệt.`}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Account Info */}
                <section className="mt-6 bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Shield size={20} className="text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800">Tài Khoản</h3>
                                <p className="text-sm text-slate-500">Thông tin tài khoản hiện tại</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-3">
                        <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-slate-500">Email</span>
                            <span className="text-sm font-medium text-slate-800">{session?.user?.email}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-t border-slate-100">
                            <span className="text-sm text-slate-500">ID</span>
                            <span className="text-xs font-mono text-slate-400">{session?.user?.id}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-t border-slate-100">
                            <span className="text-sm text-slate-500">Đăng nhập lần cuối</span>
                            <span className="text-sm text-slate-600">
                                {session?.user?.last_sign_in_at
                                    ? new Date(session.user.last_sign_in_at).toLocaleString('vi-VN')
                                    : '—'}
                            </span>
                        </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
};

export default SettingsPage;
