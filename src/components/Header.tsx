import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Menu, X, Search, Globe, ChevronDown, GraduationCap, Medal, BookOpen, Users, ClipboardList, FlaskConical, CalendarDays, Phone, Image, UserCheck } from 'lucide-react';

const languages = [
  { code: 'en' as const, label: 'English' },
  { code: 'hi' as const, label: 'हिन्दी' },
  { code: 'mr' as const, label: 'मराठी' },
];

type SubItem = { label: string; path: string; hash?: string; icon: React.ElementType; desc: string };
type NavItem =
  | { path: string; label: string; children?: undefined }
  | { label: string; path?: undefined; children: SubItem[] };

const Header = () => {
  const { t, language, setLanguage } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
    setMobileExpanded(null);
  }, [location.pathname]);

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as any);
    setLangOpen(false);
    
    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectElement) {
      selectElement.value = langCode;
      selectElement.dispatchEvent(new Event('change'));
    }
  };

  // Load Google Translate Widget
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.body.appendChild(script);

        (window as any).googleTranslateElementInit = () => {
          new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,hi,mr',
              layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
            },
            'google_translate_element'
          );
        };
      }
    };
    addGoogleTranslateScript();
  }, []);

  const navItems: NavItem[] = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    {
      label: t('nav.academics'),
      children: [
        { label: 'Curriculum', path: '/academics', icon: BookOpen, desc: 'Maharashtra State Board syllabus & class structure' },
        { label: 'Our Toppers', path: '/toppers', icon: Medal, desc: 'Hall of fame — top rankers' },
        { label: 'Teaching Methods', path: '/academics', hash: '#methods', icon: FlaskConical, desc: 'How we teach & assess' },
        { label: 'Faculty', path: '/faculty', icon: Users, desc: 'Meet our expert teachers' },
      ],
    },
    {
      label: t('nav.admissions'),
      children: [
        { label: 'Apply Now', path: '/admissions', icon: ClipboardList, desc: 'Start your admission journey' },
        { label: 'Eligibility', path: '/admissions', hash: '#eligibility', icon: UserCheck, desc: 'Age & grade criteria' },
      ],
    },

    { path: '/gallery', label: t('nav.gallery') },
    { path: '/events', label: t('nav.events') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const handleNavLinkClick = (item: NavItem & { hash?: string }) => {
    if (item.hash) {
      // Navigate then scroll to hash
      setTimeout(() => {
        const el = document.querySelector(item.hash!);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    setOpenDropdown(null);
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md shadow-sm border-b border-border">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground text-xs py-1.5">
        <div className="container-school flex justify-between items-center">
          <span>📞 +91 70832 37878 / 97871 84476 | ✉️ gurukulvidyalay2425858@gmail.com</span>
          <div className="hidden sm:flex items-center gap-3">
            <Link to="/students" className="hover:underline">{t('nav.students')}</Link>
            <span>|</span>
            <Link to="/portal" className="hover:underline">Portal</Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container-school flex items-center justify-between h-16" ref={dropdownRef}>
        <Link to="/" className="flex items-center gap-3">
          <img src="/icon.png" alt="Gurukul Vidyalay Logo" className="w-10 h-10 object-contain rounded-full shadow-sm bg-white" />
          <div className="hidden sm:block">
            <h1 className="text-base font-display font-bold text-foreground leading-tight">Gurukul Vidyalay &amp; Jr. College</h1>
            <p className="text-[10px] text-muted-foreground tracking-wider uppercase">गुरुकुल विद्यालय ॲन्ड ज्युनियर कॉलेज</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            if (item.children) {
              const isOpen = openDropdown === item.label;
              return (
                <div key={item.label} className="relative">
                  <button
                    onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${isOpen ? 'bg-primary/10 text-primary' : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                      }`}
                  >
                    {item.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown card */}
                  {isOpen && (
                    <div className="absolute left-0 top-full mt-2 w-64 bg-card rounded-xl shadow-2xl border border-border overflow-hidden animate-reveal-up z-50">
                      <div className="p-2">
                        {item.children.map((sub) => (
                          <Link
                            key={sub.label}
                            to={sub.path}
                            onClick={() => handleNavLinkClick(sub as any)}
                            className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-primary/5 group transition-colors"
                          >
                            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0 group-hover:bg-secondary/20 transition-colors mt-0.5">
                              <sub.icon className="w-4 h-4 text-secondary" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{sub.label}</p>
                              <p className="text-xs text-muted-foreground leading-tight mt-0.5">{sub.desc}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path!}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${location.pathname === item.path
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Search */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-md hover:bg-muted transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Language switcher UI */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 p-2 rounded-md hover:bg-muted transition-colors text-sm"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{languages.find(l => l.code === language)?.label || 'Language'}</span>
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 bg-card rounded-lg shadow-xl border border-border py-1 min-w-[120px] z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${language === lang.code ? 'font-semibold text-primary' : ''}`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hidden Google Translate Element */}
          <div id="google_translate_element" className="absolute opacity-0 w-0 h-0 overflow-hidden pointer-events-none -z-50"></div>

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
            {navItems.map((item) => {
              if (item.children) {
                const isExpanded = mobileExpanded === item.label;
                return (
                  <div key={item.label}>
                    <button
                      onClick={() => setMobileExpanded(isExpanded ? null : item.label)}
                      className="w-full flex items-center justify-between px-4 py-2.5 rounded-md text-sm font-medium text-foreground/70 hover:bg-muted transition-colors"
                    >
                      {item.label}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    {isExpanded && (
                      <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l-2 border-secondary/30 pl-3">
                        {item.children.map((sub) => (
                          <Link
                            key={sub.label}
                            to={sub.path}
                            onClick={() => { setMobileOpen(false); handleNavLinkClick(sub as any); }}
                            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-foreground/70 hover:bg-muted hover:text-primary transition-colors"
                          >
                            <sub.icon className="w-4 h-4 text-secondary shrink-0" />
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.path}
                  to={item.path!}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${location.pathname === item.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/70 hover:bg-muted'
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link to="/students" onClick={() => setMobileOpen(false)} className="px-4 py-2.5 rounded-md text-sm text-foreground/70 hover:bg-muted">{t('nav.students')}</Link>
            <Link to="/portal" onClick={() => setMobileOpen(false)} className="px-4 py-2.5 rounded-md text-sm text-foreground/70 hover:bg-muted">Portal</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
