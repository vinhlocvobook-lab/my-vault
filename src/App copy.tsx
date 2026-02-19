// Đường dẫn: src/App.tsx
import { useEffect } from 'react';
import { SecretCard } from './components/items/SecretCard';
import { MainLayout } from './components/layout/MainLayout'; // Import Layout mới
import { useVaultStore } from './store/vaultStore';
import { encryptData } from './lib/crypto';
import type { VaultItem } from './types';

function App() {
  const unlockVault = useVaultStore((state) => state.unlockVault);

  useEffect(() => {
    unlockVault('my-super-secret-key');
  }, [unlockVault]);

  const mockPayload = JSON.stringify({ username: 'root', password: 'secure_password_123' });
  const mockEncryptedContent = encryptData(mockPayload, 'my-super-secret-key');

  const mockItem: VaultItem = {
    id: '1',
    type: 'SECRET',
    title: 'Production DB Server (AWS)',
    is_encrypted: true,
    content: mockEncryptedContent,
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header của phần nội dung */}
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800">Két Mật Khẩu</h2>
          <p className="text-slate-500 mt-2">Nơi lưu trữ an toàn các thông tin đăng nhập và hệ thống.</p>
        </header>

        {/* Danh sách thẻ (Giả lập Grid chia cột) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SecretCard item={mockItem} />
          {/* Bạn có thể copy dòng trên ra nhiều lần để thấy giao diện nhiều thẻ */}
          <SecretCard item={{ ...mockItem, id: '2', title: 'Staging Server (DigitalOcean)' }} />
        </div>
      </div>
    </MainLayout>
  );
}

export default App;