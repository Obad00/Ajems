import { Suspense, lazy, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { createAuth } from './auth'
import { AuthProvider } from './auth/AuthProvider'
import type { AuthService } from './auth/AuthService'
import { ConfirmationPage } from './pages/ConfirmationPage'
import { MembershipPage } from './pages/MembershipPage'
import { MembershipDraftProvider } from './pages/membership/DraftContext'
import { AboutPage } from './pages/AboutPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { ReglementPage } from './pages/ReglementPage'
import { RepositoryContext, createRepository } from './storage'
import type { MemberRepository } from './storage/MemberRepository'
import { Layout } from './ui/Layout'

// Admin code is split into its own chunk: visitors of the public site never download it.
const AdminRoutes = lazy(() => import('./admin/AdminRoutes'))

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="admin/*"
        element={
          <Suspense fallback={<p className="p-6 text-muted">Chargement…</p>}>
            <AdminRoutes />
          </Suspense>
        }
      />
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="adhesion" element={<MembershipPage />} />
        <Route path="adhesion/confirmation" element={<ConfirmationPage />} />
        <Route path="a-propos" element={<AboutPage />} />
        <Route path="reglement" element={<ReglementPage />} />
        <Route path="confidentialite" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default function App({ repository, auth }: { repository?: MemberRepository; auth?: AuthService }) {
  const [repo] = useState(() => repository ?? createRepository())
  const [authService] = useState(() => auth ?? createAuth())
  return (
    <RepositoryContext.Provider value={repo}>
      <AuthProvider service={authService}>
        <MembershipDraftProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </MembershipDraftProvider>
      </AuthProvider>
    </RepositoryContext.Provider>
  )
}
