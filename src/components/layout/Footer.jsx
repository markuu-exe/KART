import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const companyLinks = [
  { label: 'About Us', href: '#site-footer-about' },
  { label: 'Contact Support', href: '#site-footer-support' },
  { label: 'FAQ', href: '#site-footer-faq' },
];

const legalLinks = [
  { label: 'Terms of Service', href: '#site-footer-terms' },
  { label: 'Privacy Policy', href: '#site-footer-privacy' },
];

const socialLinks = [
  { label: 'Facebook', icon: Facebook },
  { label: 'Instagram', icon: Instagram },
  { label: 'LinkedIn', icon: Linkedin },
  { label: 'X', icon: Twitter },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="site-footer" className="border-t border-border-rule bg-surface-white">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-3">
          <div>
            <p className="font-heading text-2xl font-extrabold tracking-tight text-primary-orange">Kart</p>
            <p className="text-caption text-ink-mid">Cebu's fastest errand runners</p>
          </div>
          <p className="text-sm text-ink-light">{year} © Kart. Built for fast, local errands with a focus on trust and clarity.</p>
        </div>

        <div id="site-footer-about" className="space-y-3">
          <p className="text-label font-semibold text-ink-default">Links</p>
          <nav className="flex flex-col gap-2">
            {companyLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-sm text-ink-mid transition hover:text-primary-orange">
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="space-y-3">
          <p className="text-label font-semibold text-ink-default">Legal</p>
          <nav className="flex flex-col gap-2">
            {legalLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-sm text-ink-mid transition hover:text-primary-orange">
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div id="site-footer-faq" className="space-y-3">
          <p className="text-label font-semibold text-ink-default">Social</p>
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => {
              const Icon = social.icon;

              return (
                <button
                  key={social.label}
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-rule bg-surface-white text-ink-mid transition hover:border-primary-orange hover:text-primary-orange"
                  aria-label={social.label}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </button>
              );
            })}
          </div>
          <p id="site-footer-support" className="text-sm text-ink-light">Support is available for payment, zone, and delivery issues.</p>
        </div>

        <p id="site-footer-terms" className="sr-only">Terms of Service</p>
        <p id="site-footer-privacy" className="sr-only">Privacy Policy</p>
      </div>
    </footer>
  );
}