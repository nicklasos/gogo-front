import { createElement, type ReactNode } from 'react'
import type { Translate } from './serverErrors'

export function enumLabel(t: Translate, enumName: string, value: string): string {
  return t(`enums.${enumName}.${value}`, { defaultValue: value })
}

export function enumOptions<T extends string>(
  t: Translate,
  enumName: string,
  values: readonly T[],
  testIdPrefix?: string
): { value: T; label: ReactNode }[] {
  return values.map((value) => {
    const text = enumLabel(t, enumName, value)
    return {
      value,
      label: testIdPrefix ? createElement('span', { 'data-testid': `${testIdPrefix}-${value}` }, text) : text,
    }
  })
}
