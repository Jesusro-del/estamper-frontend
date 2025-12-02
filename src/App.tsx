import ChatWidget from "./components/ui/ChatWidget.jsx";


import ProductsPage from './product/pages/ProductsPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import { useState, useEffect } from "react";

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'login' | 'products'>('landing')
  const [, setIsAuthenticated] = useState(false)

  // Verificar autenticación al cargar
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated')
    setIsAuthenticated(authStatus === 'true')
  }, [])

  // Función de login exitoso
  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
    setCurrentPage('products')
  }

  // Función de logout
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userEmail')
    setIsAuthenticated(false)
    setCurrentPage('landing')
  }

  // Exponer funciones globales para navegación
  if (typeof window !== 'undefined') {
    (window as any).navigateTo = (page: 'landing' | 'login' | 'products') => {
      if (page === 'products') {
        // Verificar autenticación antes de ir a productos
        const authStatus = localStorage.getItem('isAuthenticated')
        if (authStatus === 'true') {
          setCurrentPage('products')
        } else {
          setCurrentPage('login')
        }
      } else {
        setCurrentPage(page)
      }
    }

    (window as any).logout = handleLogout
  }

  return (
    <>
      <ProductsPage></ProductsPage>
      <ChatWidget/>
    </>
  )
}

export default App

