import { Result } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../stores/authStore'

/**
 * Auth-only route guard (gogo has no RBAC).
 */
export default function ProtectedRoute({ children }) {
  const { t } = useTranslation()
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated || !user) {
    return (
      <Result
        status="403"
        title={t('auth.accessDenied')}
        subTitle={t('auth.loginRequired')}
      />
    )
  }

  return children
}
