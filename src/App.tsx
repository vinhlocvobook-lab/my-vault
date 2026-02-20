// Đường dẫn: src/App.tsx
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { SecretCard } from './components/items/SecretCard';
import { MainLayout } from './components/layout/MainLayout';
import { Auth } from './pages/Auth';
import { useAuth } from './hooks/useAuth';
import { useVaultStore } from './store/vaultStore';
import { getItems, createSecretItem } from './services/itemService';
import { UnlockVault } from './components/auth/UnlockVault';
import { AddSecretModal } from './components/items/AddSecretModal';
import type { VaultItem } from './types';
// import { Plus, LogOut } from 'lucide-react';
import { supabase } from './lib/supabase';
import { useAutoLock } from './hooks/useAutoLock';
import { decryptData } from './lib/crypto';
import { Plus, LogOut, Lock } from 'lucide-react'; // Thêm icon Lock

function App() {
  const { session, isLoading } = useAuth();
  // const { masterKey, unlockVault, lockVault } = useVaultStore();
  const { masterKey, lockVault } = useVaultStore(); // Xóa unlockVault ở đây đi

  // State lưu trữ danh sách items thật từ DB
  const [items, setItems] = useState<VaultItem[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  // Thêm dòng này ngay dưới đoạn khai báo các state khác
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. Kích hoạt Lính gác: Yêu cầu khóa két sau 10 giây (10000 ms) không hoạt động để test
  useAutoLock(10000);
  // Khi đã có session và masterKey, tự động kéo dữ liệu từ DB về
  useEffect(() => {
    if (session && masterKey) {
      loadData();
    }
  }, [session, masterKey]);

  // Giả lập nhập Master Key tạm thời (Sau này sẽ làm form nhập Két thật)
  // useEffect(() => {
  //   if (session && !masterKey) {
  //     unlockVault('my-super-secret-key');
  //   }
  // }, [session, masterKey, unlockVault]);

  // const loadData = async () => {
  //   setIsFetching(true);
  //   try {
  //     const data = await getItems();
  //     setItems(data);
  //   } catch (error) {
  //     alert('Không thể tải dữ liệu!');
  //   } finally {
  //     setIsFetching(false);
  //   }
  // };

  // Hàm tạo dữ liệu thật đẩy lên Supabase
  const handleCreateTestItem = async () => {
    if (!masterKey) return alert('Chưa mở khóa Két!');

    const randomNum = Math.floor(Math.random() * 1000);
    const payload = { username: `admin_${randomNum}`, password: `pass_${randomNum}` };

    try {
      // 1. Lưu lên DB
      await createSecretItem(`Server Test #${randomNum}`, payload, masterKey);
      // 2. Tải lại danh sách để hiện ra màn hình
      await loadData();
    } catch (error) {
      alert('Lỗi khi tạo item!');
    }
  };

  const handleLogout = async () => {
    lockVault(); // Xóa Master Key khỏi RAM
    await supabase.auth.signOut(); // Đăng xuất Supabase
  };

  // const loadData = async () => {
  //   setIsFetching(true);
  //   try {
  //     const data = await getItems();
  //     setItems(data);
  //   } catch (error) {
  //     toast.error('Không thể tải dữ liệu!'); // Thay alert bằng toast.error
  //   } finally {
  //     setIsFetching(false);
  //   }
  // };
  const loadData = async () => {
    setIsFetching(true);
    try {
      const data = await getItems();

      // --- LOGIC MỚI: KIỂM TRA CHÌA KHÓA ---
      if (data.length > 0 && masterKey) {
        // Thử lấy thẻ đầu tiên ra giải mã
        const testItem = data[0];
        const isCorrectKey = decryptData(testItem.content, masterKey);

        if (!isCorrectKey) {
          // Nếu giải mã thất bại -> Sai pass!
          toast.error('Sai Master Password! Vui lòng thử lại.', { icon: '❌' });
          lockVault(); // Xóa Master Key khỏi RAM, tự động văng ra màn hình Mở Khóa
          return;      // Dừng lại, không in dữ liệu lỗi ra màn hình nữa
        }
      }
      // ------------------------------------

      setItems(data);
    } catch (error) {
      toast.error('Không thể tải dữ liệu!');
    } finally {
      setIsFetching(false);
    }
  };
  // if (isLoading) return <div className="h-screen flex items-center justify-center">Đang tải...</div>;
  // if (!session) return <Auth />;

  // Các lớp bảo vệ
  if (isLoading) return <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-500">Đang tải cấu hình...</div>;

  // Lớp bảo vệ 1: Chưa đăng nhập Supabase -> Hiện form Đăng nhập
  if (!session) return <Auth />;

  // Lớp bảo vệ 2: Đã đăng nhập nhưng chưa có Master Key trong RAM -> Hiện form Mở khóa
  if (!masterKey) return <UnlockVault />;
  return (
    <MainLayout>
      {/* <Toaster position="bottom-right" reverseOrder={false} /> */}
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-end border-b pb-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Két Mật Khẩu</h2>
            <p className="text-slate-500 mt-2">Đăng nhập với: {session.user.email}</p>
          </div>
          <div className="flex gap-3">
            {/* <button
              onClick={handleCreateTestItem}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} /> Tạo thẻ Test
            </button> */}
            <button
              onClick={() => setIsModalOpen(true)} // ĐỔI SỰ KIỆN Ở ĐÂY
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} /> Thêm Mới
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors"
            >
              <LogOut size={18} /> Đăng xuất
            </button>
          </div>
        </header>

        {isFetching ? (
          <div className="text-center text-slate-500 mt-10">Đang đồng bộ dữ liệu...</div>
        ) : items.length === 0 ? (
          <div className="text-center text-slate-500 mt-10 p-10 border-2 border-dashed rounded-xl">
            Két sắt của bạn đang trống. Hãy bấm "Tạo thẻ Test" nhé!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => (
              <SecretCard key={item.id} item={item}
                onRefresh={loadData}
              />
            ))}
          </div>
        )}
        {/* Đặt Modal ở cuối cùng */}
        <AddSecretModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={loadData} // Lưu xong thì gọi lại hàm loadData để tải mới danh sách
        />
      </div>
    </MainLayout>
  );
}

export default App;