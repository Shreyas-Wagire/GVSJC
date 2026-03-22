import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail, Clock } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-school py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-display font-bold">S</div>
              <div>
                <h3 className="font-display font-bold text-lg">Gurukul Vidyalay & Jr. College</h3>
                <p className="text-xs opacity-70">गुरुकुल विद्यालय ॲन्ड ज्युनियर कॉलेज</p>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">{t('footer.desc')}</p>
            <div className="flex gap-3 mt-5">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-secondary/80 flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">{t('footer.quicklinks')}</h4>
            <div className="flex flex-col gap-2">
              {[
                { to: '/about', label: t('nav.about') },
                { to: '/academics', label: t('nav.academics') },
                { to: '/admissions', label: t('nav.admissions') },
                { to: '/gallery', label: t('nav.gallery') },
                { to: '/events', label: t('nav.events') },
                { to: '/contact', label: t('nav.contact') },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="text-sm opacity-80 hover:opacity-100 hover:text-secondary transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">{t('footer.contact')}</h4>
            <div className="flex flex-col gap-3 text-sm opacity-80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>123, Education Lane, Kothrud, Pune, Maharashtra 411038</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <span>+91 70832 37878 / 97871 84476</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <span>gurukulvidyalay2485858@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">{t('footer.hours')}</h4>
            <div className="flex flex-col gap-2 text-sm opacity-80">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Mon – Fri: 8:00 AM – 4:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Saturday: 8:00 AM – 1:00 PM</span>
              </div>
              <p className="mt-2">Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 py-5">
        <div className="container-school text-center text-sm opacity-60">
          © 2025 Gurukul Vidyalay & Jr. College. {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
