import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Navigate, useLocation } from 'react-router'
import { z } from 'zod'
import { LogIn } from 'lucide-react'
import { useAuth } from '../auth'
import { AuthError } from '../auth/AuthService'
import { DEMO_ACCOUNT } from '../auth/MockAuthService'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { Field } from '../ui/Field'
import { usePageTitle } from '../ui/usePageTitle'

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Indiquez votre email').pipe(z.email('Adresse email invalide')),
  password: z.string().min(1, 'Indiquez votre mot de passe'),
})
type LoginValues = z.infer<typeof loginSchema>

export function LoginPage() {
  usePageTitle('Connexion administration')
  const { session, service, signIn } = useAuth()
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/admin'
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) })

  // Single redirect point: once signed in, go back to the page that was requested.
  if (session) return <Navigate to={from} replace />

  const onSubmit = async ({ email, password }: LoginValues) => {
    setError(null)
    try {
      await signIn(email, password)
    } catch (e) {
      setError(e instanceof AuthError ? e.message : 'Connexion impossible. Réessayez plus tard.')
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:py-20">
      <h1 className="text-4xl font-semibold sm:text-5xl">
        Espace <em className="font-normal">bureau</em>
      </h1>
      <p className="mt-3 text-muted">Réservé aux membres du bureau de l'AJEMS. Les comptes sont créés par l'administrateur.</p>

      {service.kind === 'mock' && (
        <div className="mt-6">
          <Alert tone="info" title="Compte de démonstration (fictif)">
            <p>
              Email : <code className="font-semibold">{DEMO_ACCOUNT.email}</code>
              <br />
              Mot de passe : <code className="font-semibold">{DEMO_ACCOUNT.password}</code>
            </p>
          </Alert>
        </div>
      )}

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5 border-t border-navy/15 pt-8">
        {error && (
          <Alert tone="error" role="alert">
            <p>{error}</p>
          </Alert>
        )}
        <Field id="email" label="Email" type="email" autoComplete="username" error={errors.email?.message} {...register('email')} />
        <Field id="password" label="Mot de passe" type="password" autoComplete="current-password" error={errors.password?.message} {...register('password')} />
        <Button type="submit" loading={isSubmitting} className="w-full" icon={<LogIn aria-hidden className="size-5" />}>
          Se connecter
        </Button>
      </form>
    </div>
  )
}
