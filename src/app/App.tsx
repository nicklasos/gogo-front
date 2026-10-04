import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { useAuthStore } from '@/auth/authStore'
import LoginPage from '@/auth/LoginPage'
import { Providers } from './providers'
import { queryClient } from './queryClient'
import { AppRoutes } from './router'

export default function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const me = useAuthStore((s) => s.me)

  useEffect(() => {
    if (isAuthenticated) me()
    else queryClient.clear()
  }, [isAuthenticated, me])

  return (
    <BrowserRouter>
      <Providers>{isAuthenticated ? <AppRoutes /> : <LoginPage />}</Providers>
    </BrowserRouter>
  )
}
