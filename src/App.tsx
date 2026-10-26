import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
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

export function AppRoutes() {
  return (
    <Routes>
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

export default function App({ repository }: { repository?: MemberRepository }) {
  const [repo] = useState(() => repository ?? createRepository())
  return (
    <RepositoryContext.Provider value={repo}>
      <MembershipDraftProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </MembershipDraftProvider>
    </RepositoryContext.Provider>
  )
}
