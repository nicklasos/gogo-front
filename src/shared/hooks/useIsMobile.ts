import { Grid } from 'antd'

/** Phone layout below `md` (768px). Tables switch to cards later, below `lg` (see ResponsiveTable). */
export function useIsMobile(): boolean {
  const screens = Grid.useBreakpoint()
  return !screens.md
}
