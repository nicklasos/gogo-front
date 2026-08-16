import { useEffect } from 'react'
import { Form, Input, Button, Card, Typography, Alert, Row, Col, Grid } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../stores/authStore'
import { translateServerError } from '../utils/serverErrors'

const { Title, Text } = Typography
const { useBreakpoint } = Grid

function LoginPage() {
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const { login, loading, error, clearError } = useAuthStore()
  const screens = useBreakpoint()
  const isMobile = !screens.md

  useEffect(() => {
    clearError()
  }, [clearError])

  const onFinish = async (values) => {
    const result = await login(values.email, values.password)
    if (!result.success && result.error) {
      console.error('Login failed:', result.error)
    }
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
        background: 'linear-gradient(135deg, #1d3557 0%, #457b9d 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <Row justify="center" style={{ width: '100%', maxWidth: isMobile ? '350px' : '400px' }}>
        <Col span={24}>
          <Card style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', borderRadius: 8 }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Title level={isMobile ? 3 : 2} style={{ color: '#1d3557', marginBottom: 8 }}>
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
                style={{ marginBottom: 20 }}
                closable
                onClose={clearError}
              />
            )}

            <Form
              form={form}
              name="login"
              onFinish={onFinish}
              layout="vertical"
              size={isMobile ? 'default' : 'large'}
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
