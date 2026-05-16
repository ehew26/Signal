'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/home')
      router.refresh()
    }
  }

  return (
    <main className="min-h-screen bg-background flex">
      {/* Left: form */}
      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-md">
          <Link href="/" className="font-fraunces text-2xl text-cream mb-16 block">
            Signal<span className="text-accent">.</span>
          </Link>

          <div className="mb-12">
            <div className="text-accent text-xs tracking-[0.3em] uppercase mb-4">Welcome back</div>
            <h1 className="font-fraunces text-4xl text-cream">Sign in to Signal</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-cream-muted text-xs tracking-widest uppercase block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-transparent border border-border text-cream px-4 py-3.5 focus:outline-none focus:border-accent transition-colors placeholder-cream-muted/30"
              />
            </div>
            <div>
              <label className="text-cream-muted text-xs tracking-widest uppercase block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-transparent border border-border text-cream px-4 py-3.5 pr-12 focus:outline-none focus:border-accent transition-colors placeholder-cream-muted/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-cream-muted hover:text-cream transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="border border-accent/30 bg-accent/10 text-accent text-sm px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-cream py-4 text-sm tracking-[0.2em] uppercase font-medium hover:bg-opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-3 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="mt-8 flex flex-col gap-3 text-center">
            <p className="text-cream-muted text-sm">
              Don't have an account?{' '}
              <Link href="/signup" className="text-accent hover:underline">
                Join Signal
              </Link>
            </p>
            <a href="#" className="text-cream-muted text-xs hover:text-cream transition-colors">
              Forgot password?
            </a>
          </div>
        </div>
      </div>

      {/* Right: image */}
      <div className="hidden lg:block w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1543157145-f78c636d4ef7?w=800&h=1200&fit=crop"
          alt="Login"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent" />
        <div className="absolute bottom-16 left-12 right-12">
          <p className="font-fraunces text-4xl italic text-cream leading-tight">
            "Five real matches.<br />Every Monday."
          </p>
          <p className="text-cream-muted text-sm mt-3">— Signal, Sarasota</p>
        </div>
      </div>
    </main>
  )
}
