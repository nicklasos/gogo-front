import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@ant-design/v5-patch-for-react-19'
import 'antd/dist/reset.css'
import './index.css'
import App from './App.jsx'
import './i18n'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
