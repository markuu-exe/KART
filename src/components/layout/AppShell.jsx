import { useLocation } from 'react-router-dom';

import Footer from './Footer';
import Header from './Header';

const SETTINGS_PATHS = [
  '/requester/profile',
  '/requester/profile/edit',
  '/runner/profile',
  '/runner/profile/edit',
];

export default function AppShell({ children, user, needsOnboarding, isAuthResolved = true }) {
  const { pathname } = useLocation();
  const showFooter = pathname === '/' || pathname === '/auth' || SETTINGS_PATHS.some((path) => pathname.startsWith(path));
  const headerMode = !isAuthResolved ? 'public' : !user ? 'public' : needsOnboarding ? 'onboarding' : (user?.user_metadata?.role === 'runner' ? 'runner' : 'requester');

  return (
    <div className="flex min-h-screen w-full flex-col bg-surface-default text-ink-default overflow-x-hidden overflow-y-scroll">
      <Header mode={headerMode} />
      <div className="flex-1 w-full">
        {children}
      </div>
      {showFooter ? <Footer /> : null}
    </div>
  );
}