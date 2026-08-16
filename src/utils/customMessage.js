import { message } from 'antd'

const customMessage = {
  success: (content, duration = 4, onClose) => message.success(content, duration, onClose),
  error: (content, duration = 9, onClose) => message.error(content, duration, onClose),
  warning: (content, duration = 9, onClose) => message.warning(content, duration, onClose),
  info: (content, duration = 4, onClose) => message.info(content, duration, onClose),
  loading: (content, duration = 0, onClose) => message.loading(content, duration, onClose),
  open: message.open,
  destroy: message.destroy,
  config: message.config,
}

export default customMessage
