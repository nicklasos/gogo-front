import { Navigate, Route, Routes } from 'react-router-dom'
import { RequireRole, RequireSuperAdmin } from '@/auth/guards'
import { ROLE_ADMIN } from '@/auth/roles'
import ProfilePage from '@/features/account/ProfilePage'
import DashboardPage from '@/features/dashboard/DashboardPage'
import ExampleEditorPage from '@/features/examples/pages/ExampleEditorPage'
import ExamplesPage from '@/features/examples/pages/ExamplesPage'
import AdminsPage from '@/features/users/pages/AdminsPage'
import SuperAdminsPage from '@/features/users/pages/SuperAdminsPage'
import UsersPage from '@/features/users/pages/UsersPage'
import { AppShell } from '@/layout/AppShell'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="examples" element={<ExamplesPage />} />
        <Route path="examples/new" element={<ExampleEditorPage />} />
        <Route path="examples/:id/edit" element={<ExampleEditorPage />} />
        <Route
          path="users"
          element={
            <RequireRole roles={[ROLE_ADMIN]}>
              <UsersPage />
            </RequireRole>
          }
        />
        <Route
          path="admin/super-admins"
          element={
            <RequireSuperAdmin>
              <SuperAdminsPage />
            </RequireSuperAdmin>
          }
        />
        <Route
          path="admin/admins"
          element={
            <RequireSuperAdmin>
              <AdminsPage />
            </RequireSuperAdmin>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
