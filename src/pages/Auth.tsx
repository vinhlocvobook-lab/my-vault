// Đường dẫn: src/pages/Auth.tsx
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Shield } from 'lucide-react';

export const Auth = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleAuth = async (type: 'LOGIN' | 'SIGNUP') => {
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            if (type === 'SIGNUP') {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setMessage({ text: 'Đăng ký thành công! Vui lòng kiểm tra email để xác nhận (nếu Supabase yêu cầu).', type: 'success' });
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            }
        } catch (error: unknown) {
            setMessage({ text: error instanceof Error ? error.message : 'Đã xảy ra lỗi', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
                <div className="flex flex-col items-center mb-8">
                    <Shield size={48} className="text-blue-600 mb-2" />
                    <h1 className="text-2xl font-bold text-slate-800">My Vault</h1>
                    <p className="text-slate-500 text-sm">Đăng nhập để vào Két Sắt của bạn</p>
                </div>

                {message.text && (
                    <div className={`p-3 mb-4 rounded text-sm ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {message.text}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="admin@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={() => handleAuth('LOGIN')}
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white p-3 rounded font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                            Đăng Nhập
                        </button>
                        <button
                            onClick={() => handleAuth('SIGNUP')}
                            disabled={loading}
                            className="flex-1 bg-slate-200 text-slate-800 p-3 rounded font-medium hover:bg-slate-300 disabled:opacity-50"
                        >
                            Đăng Ký
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};