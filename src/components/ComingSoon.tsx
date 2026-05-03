import { Link } from 'react-router-dom';
import { Construction, ArrowLeft, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ComingSoonProps {
  title?: string;
  subtitle?: string;
}

export default function ComingSoon({
  title = 'Coming Soon',
  subtitle = 'This page is under development. We are working hard to bring it to you.',
}: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col items-center justify-center px-4 py-16">
      {/* Logo */}
      <Link to="/" className="mb-10">
        <img src="/icon.png" alt="Gurukul Vidyalay" className="w-14 h-14 rounded-full shadow object-contain bg-white" />
      </Link>

      <div className="text-center max-w-md space-y-6">
        {/* Icon */}
        <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-primary/10 mx-auto">
          <Construction className="w-12 h-12 text-primary" />
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-[10px] font-bold text-white animate-bounce">!</span>
        </div>

        {/* Badge + Text */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse inline-block" />
            Under Development
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500 leading-relaxed text-sm">{subtitle}</p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200" />

        {/* Contact */}
        <div className="space-y-2">
          <p className="text-xs text-gray-400">Need help right now? Reach us at</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="tel:+917083237878" className="flex items-center gap-1.5 text-primary hover:underline font-medium">
              <Phone className="w-3.5 h-3.5" /> 70832 37878
            </a>
            <a href="mailto:gurukulvidyalay2425858@gmail.com" className="flex items-center gap-1.5 text-primary hover:underline font-medium">
              <Mail className="w-3.5 h-3.5" /> Email us
            </a>
          </div>
        </div>

        {/* Back button */}
        <Button variant="outline" asChild>
          <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
