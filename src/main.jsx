import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // 개발 중에는 StrictMode 비활성화 (중복 요청 방지)
  // <StrictMode>
    <App />
  // </StrictMode>,
)
