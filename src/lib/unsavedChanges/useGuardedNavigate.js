import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { confirmUnsavedNavigation, useUnsavedChangesContext } from './UnsavedChangesProvider'

export function useGuardedNavigate() {
  const navigate = useNavigate()
  const { isDirty } = useUnsavedChangesContext()
  const { t } = useTranslation()

  return useCallback(
    (to, options) => {
      confirmUnsavedNavigation(isDirty, t, () => navigate(to, options))
    },
    [navigate, isDirty, t]
  )
}

export function useGuardedAction() {
  const { isDirty } = useUnsavedChangesContext()
  const { t } = useTranslation()

  return useCallback(
    (action) => {
      confirmUnsavedNavigation(isDirty, t, action)
    },
    [isDirty, t]
  )
}
