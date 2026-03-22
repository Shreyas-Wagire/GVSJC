import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Menu, X, Search, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const languages = [
  { code: 'en' as const, label: 'English' },
  { code: 'hi' as const, label: 'हिन्दी' },
  { code: 'mr' as const, label: 'मराठी' },
];

const Header = () => {
  const { t, language, setLanguage } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/academics', label: t('nav.academics') },
    { path: '/admissions', label: t('nav.admissions') },
    { path: '/faculty', label: t('nav.faculty') },
    { path: '/gallery', label: t('nav.gallery') },
    { path: '/events', label: t('nav.events') },
    { path: '/contact', label: t('nav.contact') },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md shadow-sm border-b border-border">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground text-xs py-1.5">
        <div className="container-school flex justify-between items-center">
          <span>📞 +91 20 1234 5678 | ✉️ info@saraswatividyamandir.edu.in</span>
          <div className="hidden sm:flex items-center gap-3">
            <Link to="/students" className="hover:underline">{t('nav.students')}</Link>
            <span>|</span>
            <Link to="/parents" className="hover:underline">{t('nav.parents')}</Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container-school flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-lg">
            S
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base font-display font-bold text-foreground leading-tight">Saraswati Vidya Mandir</h1>
            <p className="text-[10px] text-muted-foreground tracking-wider uppercase">सरस्वती विद्या मंदिर</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground/70 hover:text-foreground hover:bg-muted'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Search */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-md hover:bg-muted transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 p-2 rounded-md hover:bg-muted transition-colors text-sm"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{languages.find(l => l.code === language)?.label}</span>
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 bg-card rounded-lg shadow-xl border border-border py-1 min-w-[120px]">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${
                      language === lang.code ? 'font-semibold text-primary' : ''
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="border-t border-border py-3 container-school animate-reveal-up">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
            autoFocus
          />
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-card animate-reveal-up">
          <nav className="container-school py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/70 hover:bg-muted'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/students" onClick={() => setMobileOpen(false)} className="px-4 py-2.5 rounded-md text-sm text-foreground/70 hover:bg-muted">{t('nav.students')}</Link>
            <Link to="/parents" onClick={() => setMobileOpen(false)} className="px-4 py-2.5 rounded-md text-sm text-foreground/70 hover:bg-muted">{t('nav.parents')}</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
