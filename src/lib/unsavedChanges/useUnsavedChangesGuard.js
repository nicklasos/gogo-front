import { useEffect } from 'react'
import { useUnsavedChangesContext } from './UnsavedChangesProvider'

export function useUnsavedChangesGuard(isDirty) {
  const { setDirty } = useUnsavedChangesContext()

  useEffect(() => {
    setDirty(isDirty)
    return () => setDirty(false)
  }, [isDirty, setDirty])

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!isDirty) return
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])
}
