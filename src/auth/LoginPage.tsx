import { useEffect } from 'react'
import { Form, Input, Button, Card, Typography, Alert, Row, Col, Grid, theme } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { translateServerError } from '@/shared/utils/serverErrors'
import { useAuthStore } from './authStore'

const { Title, Text } = Typography
const { useBreakpoint } = Grid

function LoginPage() {
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const { login, loading, error, clearError } = useAuthStore()
  const screens = useBreakpoint()
  const isMobile = !screens.md
  const { token } = theme.useToken()

  useEffect(() => {
    clearError()
  }, [clearError])

  const onFinish = async (values: { email: string; password: string }) => {
    await login(values.email, values.password)
  }

  const alertMessage = error
    ? error.type === 'raw'
      ? error.message
      : translateServerError(t, error.errorKey, error.message || t('auth.invalidCredentials'))
    : null

  return (
    <div
      style={{
        minHeight: '100vh',
        background: token.colorBgLayout,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: token.paddingLG,
      }}
    >
      <Row justify="center" style={{ width: '100%', maxWidth: isMobile ? 360 : 400 }}>
        <Col span={24}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: token.marginLG }}>
              <img src="/favicon.svg" alt="" width={48} height={48} style={{ marginBottom: token.marginSM }} />
              <Title level={isMobile ? 3 : 2} style={{ marginBottom: token.marginXS }}>
                {t('common.appName')}
              </Title>
              <Text type="secondary">{t('auth.welcome')}</Text>
            </div>

            {alertMessage && (
              <Alert
                data-testid="login-error-alert"
                message={alertMessage}
                type="error"
                showIcon
                style={{ marginBottom: token.marginMD }}
                closable
                onClose={clearError}
              />
            )}

            <Form
              form={form}
              name="login"
              onFinish={onFinish}
              layout="vertical"
              size={isMobile ? 'middle' : 'large'}
              data-testid="login-form"
            >
              <Form.Item
                name="email"
                label={t('auth.email')}
                rules={[
                  { required: true, message: t('auth.emailRequired') },
                  { type: 'email', message: t('auth.emailInvalid') },
                ]}
              >
                <Input
                  data-testid="login-email-input"
                  prefix={<UserOutlined />}
                  placeholder="user@example.com"
                  autoComplete="email"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={t('auth.password')}
                rules={[{ required: true, message: t('auth.passwordRequired') }]}
              >
                <Input.Password
                  data-testid="login-password-input"
                  prefix={<LockOutlined />}
                  placeholder={t('auth.password')}
                  autoComplete="current-password"
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  data-testid="login-button"
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  {loading ? t('common.loading') : t('auth.loginButton')}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default LoginPage
