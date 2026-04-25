import { useLocation } from 'react-router-dom';

import Footer from './Footer';
import Header from './Header';

const SETTINGS_PATHS = [
  '/requester/profile',
  '/requester/profile/edit',
  '/runner/profile',
  '/runner/profile/edit',
];

export default function AppShell({ children, user, needsOnboarding }) {
  const { pathname } = useLocation();
  const showFooter = pathname === '/' || pathname === '/auth' || SETTINGS_PATHS.some((path) => pathname.startsWith(path));
  const headerMode = !user ? 'public' : needsOnboarding ? 'onboarding' : (user?.user_metadata?.role === 'runner' ? 'runner' : 'requester');

  return (
    <div className="flex min-h-screen flex-col bg-surface-default text-ink-default">
      <Header mode={headerMode} />
      <div className="flex-1">
        {children}
      </div>
      {showFooter ? <Footer /> : null}
    </div>
  );
}