import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Login from './components/Login'

const CURRENT_YEAR = new Date().getFullYear()

export default function App() {
  const [session, setSession] = useState(null)
  const [loadingSession, setLoadingSession] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    // 1. Consultar la sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoadingSession(false)
    })

    // 2. Escuchar cambios de autenticación en tiempo real
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoadingSession(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    try {
      setLoggingOut(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
      alert('Error al cerrar sesión: ' + (err.message || 'Error desconocido'))
    } finally {
      setLoggingOut(false)
    }
  }

  // Pantalla de carga mientras se recupera la sesión inicial
  if (loadingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-400 font-medium">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8">
      {/* Header General */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <svg className="w-6 h-6 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Fundación Vivir Para Servir</h1>
            <p className="text-xs text-slate-400">Portal Institucional</p>
          </div>
        </div>

        {session ? (
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-semibold text-white">{session.user.email}</span>
              <span className="text-[11px] text-emerald-400">Sesión Activa</span>
            </div>
            <button
              onClick={handleSignOut}
              disabled={loggingOut}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 hover:border-rose-800/60 disabled:opacity-50 text-slate-200 text-xs sm:text-sm font-semibold transition-all border border-slate-700 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>{loggingOut ? 'Cerrando...' : 'Cerrar Sesión'}</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700/50">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Supabase Auth</span>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-5xl w-full mx-auto my-8 flex items-center justify-center">
        {!session ? (
          /* Vista de Autenticación */
          <Login />
        ) : (
          /* Vista Dashboard Principal */
          <div className="w-full relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl p-6 sm:p-10">
            {/* Glow ambient background */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Dashboard Hero Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
                      Usuario Autenticado
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mt-1">¡Bienvenido al Panel Principal!</h2>
                  <p className="text-sm text-slate-400">
                    Has iniciado sesión correctamente como <span className="text-emerald-400 font-mono font-medium">{session.user.email}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                disabled={loggingOut}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-sm font-semibold transition-all border border-rose-500/30 self-start sm:self-center cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>{loggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}</span>
              </button>
            </div>

            {/* Session Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  Correo Electrónico
                </span>
                <p className="mt-1.5 font-mono text-sm text-white break-all select-all">
                  {session.user.email}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  ID de Usuario (UUID)
                </span>
                <p className="mt-1.5 font-mono text-xs text-indigo-300 break-all select-all">
                  {session.user.id}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  Estado de Autenticación
                </span>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-sm font-medium text-emerald-400">En línea (Supabase Auth)</span>
                </div>
              </div>
            </div>

            {/* Foundation Modules Preview */}
            <div className="mt-8 pt-6 border-t border-slate-800/80">
              <h3 className="text-sm font-semibold text-slate-300 mb-4">
                Módulos de la Fundación Vivir Para Servir
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 hover:border-slate-700 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-sm text-white">Voluntarios</h4>
                  <p className="text-xs text-slate-400 mt-1">Gestión de integrantes y asignación a programas sociales.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 hover:border-slate-700 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-sm text-white">Donaciones</h4>
                  <p className="text-xs text-slate-400 mt-1">Registro y control de aportes y recursos comunitarios.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 hover:border-slate-700 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-sm text-white">Proyectos</h4>
                  <p className="text-xs text-slate-400 mt-1">Seguimiento de iniciativas de ayuda y desarrollo comunitario.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer General */}
      <footer className="max-w-5xl w-full mx-auto text-center text-xs text-slate-500 pt-6">
        Fundación Vivir Para Servir &copy; {CURRENT_YEAR} &bull; Autenticación segura con Supabase
      </footer>
    </div>
  )
}
