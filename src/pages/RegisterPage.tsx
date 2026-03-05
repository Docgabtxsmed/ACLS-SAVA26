import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import './RegisterPage.css'

export default function RegisterPage() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { signUp, isAuthenticated } = useAuth()
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

    // Validação: mínimo 8 caracteres + pelo menos 1 número
    if (password.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres')
      return
    }

    if (!/\d/.test(password)) {
      setError('A senha deve conter pelo menos um número')
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    setIsLoading(true)

    try {
      await signUp(email, password)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="register-page">
      <Navbar />
      <div className="register-container">
        <div className="register-card">
          <h1 className="register-title">Criar Conta</h1>
          <p className="register-subtitle">Cadastre-se para usar o assistente IA</p>

          {error && <div className="register-error">{error}</div>}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="register-field">
              <label htmlFor="email" className="register-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="register-input"
                placeholder="seu@email.com"
                required
                disabled={isLoading}
              />
            </div>

            <div className="register-field">
              <label htmlFor="password" className="register-label">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="register-input"
                placeholder="Mínimo 8 caracteres e 1 número"
                required
                disabled={isLoading}
              />
            </div>

            <div className="register-field">
              <label htmlFor="confirmPassword" className="register-label">
                Confirmar Senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="register-input"
                placeholder="Digite a senha novamente"
                required
                disabled={isLoading}
              />
            </div>

            <button type="submit" className="register-button" disabled={isLoading}>
              {isLoading ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </form>

          <p className="register-footer">
            Já tem uma conta?{' '}
            <Link to="/login" className="register-link">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

