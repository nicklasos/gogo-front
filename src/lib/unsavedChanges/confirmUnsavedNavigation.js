import { Modal } from 'antd'

export function confirmUnsavedNavigation(isDirty, t, onConfirm, modalConfirm = Modal.confirm) {
  if (!isDirty()) {
    onConfirm()
    return
  }

  modalConfirm({
    title: t('messages.unsavedChangesTitle'),
    content: t('messages.unsavedChanges'),
    okText: t('messages.unsavedChangesLeave'),
    cancelText: t('common.cancel'),
    onOk: onConfirm,
  })
}
