import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import LoginPage from './pages/LoginPage'
import { useAuthStore } from './store/authStore'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { DashboardPage } from './pages/DashboardPage'
import RegisterPage from './pages/RegisterPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { SettingsPage } from './pages/SettingsPage'


const queryClient = new QueryClient()

const PrivateRoute = ({ children } :{ children:React.ReactNode}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <> {children}</> : <Navigate to="/login" />

}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/dashboard'
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>} />
              <Route path='/' element={<Navigate to="/dashboard"/>}/>

           <Route path="/analytics"
           element={
            <PrivateRoute>
              <AnalyticsPage/>
            </PrivateRoute>
           }/>   
           <Route
           path="/settings"
           element={
            <PrivateRoute>
              <SettingsPage/>
            </PrivateRoute>
           }
           />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
