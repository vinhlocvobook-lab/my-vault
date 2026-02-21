import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useVaultStore } from '../../store/vaultStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireUnlock?: boolean; // Nếu true, ngoài việc đăng nhập thì két sắt cũng phải đang được mở
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireUnlock = false }) => {
    const { session, isLoading } = useAuth();
    const { masterKey } = useVaultStore();

    if (isLoading) {
        return <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-500">Đang tải trạng thái...</div>;
    }

    if (!session) {
        // Chưa đăng nhập -> Đá về trang login
        return <Navigate to="/login" replace />;
    }

    if (requireUnlock && !masterKey) {
        // Yêu cầu két phải mở mà két chưa mở -> Đá về trang nhập Master Password
        return <Navigate to="/unlock" replace />;
    }

    return <>{children}</>;
};
