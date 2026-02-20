import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Toaster } from 'react-hot-toast' // 1. Thêm import này
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* 2. Đặt trạm phát ở ngoài cùng để nó luôn tồn tại */}
    <Toaster position="bottom-right" />
  </StrictMode>,
)
