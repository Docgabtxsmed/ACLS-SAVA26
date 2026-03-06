import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import './LoginPage.css'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { resetPassword, isAuthenticated } = useAuth()
  const navigate = useNavigate()

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
      await resetPassword(email)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar email de recuperação')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      <Navbar />
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Recuperar Senha</h1>
          <p className="login-subtitle">
            Informe seu email e enviaremos um link para redefinir sua senha
          </p>

          {error && <div className="login-error">{error}</div>}

          {success ? (
            <div className="login-success">
              Email enviado com sucesso! Verifique sua caixa de entrada (e spam) para redefinir sua senha.
            </div>
          ) : (
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

              <button type="submit" className="login-button" disabled={isLoading}>
                {isLoading ? 'Enviando...' : 'Enviar link de recuperação'}
              </button>
            </form>
          )}

          <p className="login-footer">
            Lembrou a senha?{' '}
            <Link to="/login" className="login-link">
              Voltar ao login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
