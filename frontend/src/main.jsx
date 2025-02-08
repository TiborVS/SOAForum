import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import MainLayout from './MainLayout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SectionPage from './pages/SectionPage'
import ThreadPage from './pages/ThreadPage'
import UserPage from './pages/UserPage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="section/:sectionId" element={<SectionPage />} />
          <Route path="thread/:threadId" element={<ThreadPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="user">
            <Route index element={<UserPage />} />
            <Route path=":userId" element={<UserPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
