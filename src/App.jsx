import { useState, useEffect, useMemo } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom'
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Spin,
  Drawer,
  Grid,
  ConfigProvider,
} from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  DashboardOutlined,
  LogoutOutlined,
  FileTextOutlined,
  MenuOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import enUS from 'antd/locale/en_US'
import ukUA from 'antd/locale/uk_UA'
import { useAuthStore } from './stores/authStore'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './components/LoginPage'
import LanguageSwitcher from './components/LanguageSwitcher'
import TopProgressBar from './components/TopProgressBar'
import DashboardPage from './pages/DashboardPage'
import ExamplesPage from './pages/ExamplesPage'
import ExampleEditorPage from './pages/ExampleEditorPage'
import { UnsavedChangesProvider, useGuardedNavigate } from './lib/unsavedChanges'
import './App.css'

const { Header, Sider, Content } = Layout
const { useBreakpoint } = Grid

function AppLayout() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const navigate = useGuardedNavigate()
  const screens = useBreakpoint()
  const isMobile = !screens.md
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const { user, isAuthenticated, logout } = useAuthStore()

  const antdLocale = i18n.language?.startsWith('uk') ? ukUA : enUS

  const menuItems = useMemo(
    () => [
      {
        key: '/',
        icon: <DashboardOutlined />,
        label: t('navigation.dashboard'),
      },
      {
        key: '/examples',
        icon: <FileTextOutlined />,
        label: t('navigation.examples'),
      },
    ],
    [t]
  )

  const selectedKey = location.pathname.startsWith('/examples')
    ? '/examples'
    : '/'

  const onMenuClick = ({ key }) => {
    navigate(key)
    setDrawerOpen(false)
  }

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: <span data-testid="user-menu-logout">{t('auth.logout')}</span>,
      onClick: () => logout(),
    },
  ]

  if (!isAuthenticated) {
    return <LoginPage />
  }

  const sideMenu = (
    <Menu
      data-testid="main-menu"
      theme="dark"
      mode="inline"
      selectedKeys={[selectedKey]}
      items={menuItems}
      onClick={onMenuClick}
    />
  )

  return (
    <ConfigProvider locale={antdLocale}>
      <Layout style={{ minHeight: '100vh' }}>
        <TopProgressBar />
        {!isMobile && (
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            trigger={null}
            data-testid="main-sider"
          >
            <div className="logo" data-testid="app-logo">
              {collapsed ? 'G' : t('common.appName')}
            </div>
            {sideMenu}
          </Sider>
        )}

        {isMobile && (
          <Drawer
            data-testid="mobile-menu-drawer"
            placement="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            styles={{ body: { padding: 0, background: '#001529' } }}
            width={240}
          >
            <div className="logo">{t('common.appName')}</div>
            {sideMenu}
          </Drawer>
        )}

        <Layout>
          <Header className="site-layout-header" data-testid="app-header">
            <Button
              data-testid="menu-toggle-button"
              type="text"
              icon={
                isMobile ? (
                  <MenuOutlined />
                ) : collapsed ? (
                  <MenuUnfoldOutlined />
                ) : (
                  <MenuFoldOutlined />
                )
              }
              onClick={() =>
                isMobile ? setDrawerOpen(true) : setCollapsed(!collapsed)
              }
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <LanguageSwitcher />
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={['click']}
              >
                <Button data-testid="user-menu-button" type="text">
                  <Avatar size="small" icon={<UserOutlined />} />
                  <span style={{ marginLeft: 8 }} data-testid="user-menu-name">
                    {user?.name || user?.email}
                  </span>
                </Button>
              </Dropdown>
            </div>
          </Header>

          <Content className="site-layout-content" data-testid="main-content">
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/examples"
                element={
                  <ProtectedRoute>
                    <ExamplesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/examples/new"
                element={
                  <ProtectedRoute>
                    <ExampleEditorPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/examples/:id/edit"
                element={
                  <ProtectedRoute>
                    <ExampleEditorPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}

function AuthSessionGate({ children }) {
  const [sessionReady, setSessionReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    const bootstrap = async () => {
      const { token, me } = useAuthStore.getState()

      // Show the app from persisted auth immediately; validate in the background.
      if (!cancelled) {
        setSessionReady(true)
      }

      if (token) {
        const result = await me()
        // me() already clears the session on 401/403; keep persisted session on transient errors
        if (!result.success && result.unauthorized && !cancelled) {
          // session cleared by me()
        }
      }
    }

    const unsub = useAuthStore.persist.onFinishHydration(() => {
      void bootstrap()
    })

    if (useAuthStore.persist.hasHydrated()) {
      void bootstrap()
    }

    return () => {
      cancelled = true
      unsub?.()
    }
  }, [])

  if (!sessionReady) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Spin size="large" data-testid="session-loading" />
      </div>
    )
  }

  return children
}

function App() {
  return (
    <Router>
      <UnsavedChangesProvider>
        <AuthSessionGate>
          <AppLayout />
        </AuthSessionGate>
      </UnsavedChangesProvider>
    </Router>
  )
}

export default App
