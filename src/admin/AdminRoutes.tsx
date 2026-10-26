import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router'
import { useAuth } from '../auth'
import { AdminLayout } from './AdminLayout'
import { LoginPage } from './LoginPage'
import { MemberDetailPage } from './MemberDetailPage'
import { MemberPrintPage } from './MemberPrintPage'
import { MembersPage } from './MembersPage'

function RequireAdmin() {
  const { session, ready } = useAuth()
  const location = useLocation()
  if (!ready) return <p className="mx-auto max-w-6xl px-4 py-14 text-muted sm:px-6">Vérification de la session…</p>
  if (!session) return <Navigate to="/admin/connexion" replace state={{ from: location.pathname }} />
  return <Outlet />
}

/** Admin area, loaded on demand (separate bundle chunk). */
export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="connexion" element={<LoginPage />} />
        <Route element={<RequireAdmin />}>
          <Route index element={<MembersPage />} />
          <Route path="membres/:id" element={<MemberDetailPage />} />
          <Route path="membres/:id/impression" element={<MemberPrintPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  )
}
