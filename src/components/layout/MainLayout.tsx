// Đường dẫn: src/components/layout/MainLayout.tsx
import React from 'react';
import { Omnibar } from '../omnibar/Omnibar';
import { Sidebar } from './Sidebar';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
            {/* Đặt Omnibar ở đây, nó sẽ nổi đè lên tất cả nhờ class 'fixed' */}
            <Omnibar />
        </div>
    );
};