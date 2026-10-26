import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { Menu, X } from 'lucide-react'
import mapUrl from '../assets/mermoz-map.svg?url'
import { buttonClasses } from './classes'
import { keepTogether } from './typography'

const NAV = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/a-propos', label: 'À propos' },
  { to: '/reglement', label: 'Règlement intérieur' },
] as const

export function Logo() {
  return (
    <Link to="/" className="group inline-flex min-h-11 items-center gap-3" aria-label="AJEMS — accueil">
      <span className="flex flex-col">
        <span className="font-serif text-2xl leading-none font-bold tracking-wide text-white">AJEMS</span>
        <span aria-hidden className="mt-1.5 h-0.5 w-full bg-gold" />
      </span>
      <span className="hidden max-w-44 text-xs leading-snug text-white/80 lg:block">
        {keepTogether('Alliance des Jeunes Entrepreneurs de Mermoz-Sacré-Cœur')}
      </span>
    </Link>
  )
}

function Header() {
  const { pathname } = useLocation()
  // The menu is open for the path it was opened on: navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn === pathname
  const setOpen = (value: boolean) => setOpenOn(value ? pathname : null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenOn(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex min-h-11 items-center px-3 font-medium text-white ${isActive ? 'text-gold' : ''}`
  const label = (text: string) => <span className="link-draw pb-0.5">{text}</span>

  return (
    <header className="on-dark no-print sticky top-0 z-40 bg-navy text-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <nav aria-label="Navigation principale" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={'end' in item} className={linkClass}>
              {label(item.label)}
            </NavLink>
          ))}
          <Link to="/adhesion" className={buttonClasses('onDark', 'ml-3 min-h-11')}>
            Demander mon adhésion
          </Link>
        </nav>

        <button
          type="button"
          className="grid size-11 place-items-center rounded-md hover:bg-white/10 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          onClick={() => setOpen(!open)}
        >
          {open ? <X aria-hidden className="size-6" /> : <Menu aria-hidden className="size-6" />}
        </button>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Navigation principale" className="border-t border-white/15 px-4 pt-2 pb-5 md:hidden">
          <ul className="space-y-1">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={'end' in item} className={linkClass} onClick={() => setOpen(false)}>
                  {label(item.label)}
                </NavLink>
              </li>
            ))}
          </ul>
          <Link to="/adhesion" onClick={() => setOpen(false)} className={buttonClasses('onDark', 'mt-4 w-full')}>
            Demander mon adhésion
          </Link>
        </nav>
      )}
    </header>
  )
}

function Footer() {
  const footerLink = 'link-draw inline-flex min-h-11 items-center'
  return (
    <footer className="on-dark no-print relative isolate mt-0 overflow-hidden bg-navy text-white/85">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gold opacity-[0.13]"
        style={{
          maskImage: `url(${mapUrl})`,
          WebkitMaskImage: `url(${mapUrl})`,
          maskSize: 'cover',
          WebkitMaskSize: 'cover',
          maskPosition: '70% 40%',
          WebkitMaskPosition: '70% 40%',
        }}
      />
      <div className="mx-auto max-w-6xl px-4 pt-14 pb-8 sm:px-6">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="space-y-3 md:col-span-5">
            <p className="font-serif text-4xl font-semibold text-white">AJEMS</p>
            <p className="max-w-sm">
              {keepTogether('Alliance des Jeunes Entrepreneurs de Mermoz-Sacré-Cœur')}, Dakar. Association en cours de formalisation.
            </p>
          </div>
          <div className="space-y-2 md:col-span-3">
            <p className="font-serif text-lg text-gold italic">Contact</p>
            <p>Téléphone et email [À VALIDER]</p>
          </div>
          <ul className="md:col-span-4">
            <li>
              <Link className={footerLink} to="/a-propos">
                À propos
              </Link>
            </li>
            <li>
              <Link className={footerLink} to="/reglement">
                Règlement intérieur
              </Link>
            </li>
            <li>
              <Link className={footerLink} to="/confidentialite">
                Confidentialité et mentions légales
              </Link>
            </li>
          </ul>
        </div>
        <p className="mt-12 border-t border-gold/40 pt-4 text-xs text-white/65">Plan du quartier © les contributeurs OpenStreetMap (ODbL)</p>
      </div>
    </footer>
  )
}

/** New page → back to the top (the router keeps the scroll position otherwise). */
function ScrollToTop() {
  const { pathname } = useLocation()
  // Braces matter: recent Chromium returns a Promise from scrollTo, which React would treat as a cleanup.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#contenu"
        className="on-dark no-print sr-only z-50 bg-navy px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Aller au contenu
      </a>
      <ScrollToTop />
      <Header />
      <main id="contenu" tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
