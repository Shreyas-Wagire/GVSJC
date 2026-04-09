import { useState } from 'react';
import { MessageCircle, Phone, X, ChevronUp } from 'lucide-react';

const ContactWidget = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Expanded action buttons */}
      {expanded && (
        <>
          {/* WhatsApp */}
          <a
            href="https://wa.me/917083237878"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="group flex items-center gap-3 animate-reveal-up"
          >
            <span className="bg-card text-foreground text-sm font-medium px-3 py-1.5 rounded-lg shadow-md border border-border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Chat on WhatsApp
            </span>
            <div className="w-12 h-12 rounded-full bg-[hsl(142,70%,45%)] text-white shadow-lg hover:shadow-xl hover:scale-110 flex items-center justify-center transition-all active:scale-95">
              <MessageCircle className="w-5 h-5" />
            </div>
          </a>

          {/* Call */}
          <a
            href="tel:+917083237878"
            aria-label="Call us"
            className="group flex items-center gap-3 animate-reveal-up"
            style={{ animationDelay: '60ms' }}
          >
            <span className="bg-card text-foreground text-sm font-medium px-3 py-1.5 rounded-lg shadow-md border border-border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Call Us Now
            </span>
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-110 flex items-center justify-center transition-all active:scale-95">
              <Phone className="w-5 h-5" />
            </div>
          </a>
        </>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        aria-label={expanded ? 'Close contact options' : 'Open contact options'}
        className={`w-14 h-14 rounded-full text-white shadow-xl hover:shadow-2xl hover:scale-110 flex items-center justify-center transition-all active:scale-95 ${
          expanded
            ? 'bg-foreground/80 rotate-0'
            : 'bg-primary animate-pulse-slow'
        }`}
      >
        {expanded ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
    </div>
  );
};

export default ContactWidget;
