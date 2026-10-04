import { Children, type ReactNode } from 'react'
import { theme } from 'antd'

/** Search and filter controls above a list: full width on phones, side by side (up to 280px each) on wider screens. */
export function FilterBar({ children }: { children: ReactNode }) {
  const { token } = theme.useToken()
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: token.marginSM, marginBottom: token.margin }}>
      {Children.toArray(children).map((child, index) => (
        <div key={index} style={{ flex: '1 1 200px', maxWidth: 280, minWidth: 0 }} className="filter-bar-item">
          {child}
        </div>
      ))}
    </div>
  )
}
