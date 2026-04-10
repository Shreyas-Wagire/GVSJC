import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  const links = [
    { to: '/about',      label: 'About' },
    { to: '/academics',  label: 'Academics' },
    { to: '/admissions', label: 'Admissions' },
    { to: '/toppers',    label: 'Toppers' },
    { to: '/gallery',    label: 'Gallery' },
    { to: '/contact',    label: 'Contact' },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Gold accent line */}
      <div className="h-0.5 bg-secondary w-full" />

      <div className="container-school py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary font-display font-bold text-lg shrink-0">
                G
              </div>
              <div>
                <p className="font-display font-bold text-base leading-tight">Gurukul Vidyalay</p>
                <p className="text-xs opacity-60">& Jr. College, Kolhapur</p>
              </div>
            </div>
            <p className="text-sm opacity-70 leading-relaxed">
              Empowering students from Class 1–12 through quality education under the Maharashtra State Board.
            </p>
            <div className="flex gap-2 mt-1">
              {[
                { Icon: Facebook,  href: '#' },
                { Icon: Instagram, href: '#' },
                { Icon: Youtube,   href: '#' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-secondary/80 flex items-center justify-center transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-display font-semibold text-sm uppercase tracking-widest text-secondary">Quick Links</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {links.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm opacity-70 hover:opacity-100 hover:text-secondary transition-all duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h4 className="font-display font-semibold text-sm uppercase tracking-widest text-secondary">Contact</h4>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2 text-sm opacity-70">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-secondary" />
                <span>Chokak, Taluka Hatkanangale, Kolhapur – 416118</span>
              </li>
              <li className="flex items-center gap-2 text-sm opacity-70">
                <Phone className="w-4 h-4 shrink-0 text-secondary" />
                <a href="tel:+917083237878" className="hover:opacity-100 transition-opacity">
                  +91 70832 37878
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm opacity-70">
                <Mail className="w-4 h-4 shrink-0 text-secondary" />
                <a href="mailto:gurukulvidyalay2425858@gmail.com" className="hover:opacity-100 transition-opacity break-all">
                  gurukulvidyalay2425858@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-4">
        <div className="container-school flex flex-col sm:flex-row items-center justify-between gap-2 text-xs opacity-50">
          <span>© {year} Gurukul Vidyalay & Jr. College. All rights reserved.</span>
          <span>Maharashtra State Board</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
