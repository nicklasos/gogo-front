import { createContext, useCallback, useContext, useMemo, useRef } from 'react'
import { confirmUnsavedNavigation } from './confirmUnsavedNavigation'

const UnsavedChangesContext = createContext(null)

export function UnsavedChangesProvider({ children }) {
  const dirtyRef = useRef(false)

  const setDirty = useCallback((isDirty) => {
    dirtyRef.current = Boolean(isDirty)
  }, [])

  const isDirty = useCallback(() => dirtyRef.current, [])

  const value = useMemo(() => ({ setDirty, isDirty }), [setDirty, isDirty])

  return (
    <UnsavedChangesContext.Provider value={value}>
      {children}
    </UnsavedChangesContext.Provider>
  )
}

// Hook + re-export live next to the provider (same pattern as backoffice).
/* eslint-disable react-refresh/only-export-components */
export function useUnsavedChangesContext() {
  const context = useContext(UnsavedChangesContext)
  if (!context) {
    throw new Error('useUnsavedChangesContext must be used within UnsavedChangesProvider')
  }
  return context
}

export { confirmUnsavedNavigation }
