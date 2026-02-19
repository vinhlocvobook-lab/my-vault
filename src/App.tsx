import { useEffect } from 'react';
import { SecretCard } from './components/items/SecretCard';
import { MainLayout } from './components/layout/MainLayout';
import { Auth } from './pages/Auth';
import { useAuth } from './hooks/useAuth';
import { useVaultStore } from './store/vaultStore';
import { encryptData } from './lib/crypto';
import type { VaultItem } from './types';

function App() {
  const { session, isLoading } = useAuth();
  const unlockVault = useVaultStore((state) => state.unlockVault);

  useEffect(() => {
    // Tạm thời tự động nhập Master Password khi đã login thành công để test UI
    if (session) {
      unlockVault('my-super-secret-key');
    }
  }, [session, unlockVault]);

  // Đang kiểm tra trạng thái login...
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Đang tải...</div>;
  }

  // Nếu CHƯA đăng nhập -> Hiển thị form Auth
  if (!session) {
    return <Auth />;
  }

  // NẾU ĐÃ ĐĂNG NHẬP -> Hiện Vault
  // (Phần mock data tạm thời giữ lại để bạn nhìn thấy card)
  const mockPayload = JSON.stringify({ username: 'root', password: 'secure_password_123' });
  const mockEncryptedContent = encryptData(mockPayload, 'my-super-secret-key');
  const mockItem: VaultItem = {
    id: '1', type: 'SECRET', title: 'Production DB Server (AWS)', is_encrypted: true, content: mockEncryptedContent,
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Két Mật Khẩu</h2>
            <p className="text-slate-500 mt-2">Xin chào, {session.user.email}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SecretCard item={mockItem} />
        </div>
      </div>
    </MainLayout>
  );
}

export default App;