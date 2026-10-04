import type { ReactNode } from 'react'
import { Space, theme } from 'antd'

/** Right-aligned row of section actions ("Add …") above a table or list; place it in a PageStack for spacing. */
export function SectionActions({ children }: { children: ReactNode }) {
  const { token } = theme.useToken()
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Space wrap size={token.marginSM}>
        {children}
      </Space>
    </div>
  )
}
