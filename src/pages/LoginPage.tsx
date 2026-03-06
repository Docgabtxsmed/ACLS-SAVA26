import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import './LoginPage.css'

export default function LoginPage() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { signIn, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Redireciona usuarios ja autenticados
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await signIn(email, password)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      <Navbar />
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Entrar</h1>
          <p className="login-subtitle">Acesse sua conta para usar o assistente IA</p>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label htmlFor="email" className="login-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                placeholder="seu@email.com"
                required
                disabled={isLoading}
              />
            </div>

            <div className="login-field">
              <label htmlFor="password" className="login-label">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            <div className="login-forgot">
              <Link to="/forgot-password" className="login-link">
                Esqueci minha senha
              </Link>
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="login-footer">
            Não tem uma conta?{' '}
            <Link to="/register" className="login-link">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

