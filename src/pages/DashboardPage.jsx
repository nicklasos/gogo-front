import { Card, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../stores/authStore'

const { Title, Paragraph } = Typography

function DashboardPage() {
  const { t } = useTranslation()
  const { user } = useAuthStore()

  return (
    <Card data-testid="dashboard-page">
      <Title level={3}>{t('dashboard.title')}</Title>
      <Paragraph data-testid="dashboard-welcome">
        {t('dashboard.welcome', { name: user?.name || user?.email || '' })}
      </Paragraph>
      <Paragraph type="secondary">{t('dashboard.subtitle')}</Paragraph>
    </Card>
  )
}

export default DashboardPage
