import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import VaultDashboard from './pages/VaultDashboard';
import NotesPage from './pages/NotesPage';
import SettingsPage from './pages/SettingsPage';
import { Auth } from './pages/Auth';
import { UnlockVault } from './components/auth/UnlockVault';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Auth />} />
      <Route path="/unlock" element={
        <ProtectedRoute>
          <UnlockVault />
        </ProtectedRoute>
      } />
      <Route path="/" element={
        <ProtectedRoute requireUnlock={true}>
          <VaultDashboard />
        </ProtectedRoute>
      } />
      <Route path="/notes" element={
        <ProtectedRoute requireUnlock={true}>
          <NotesPage />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute requireUnlock={true}>
          <SettingsPage />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;