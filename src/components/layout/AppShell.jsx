import { useLocation } from 'react-router-dom';
import { APP_ROUTES } from '@/lib/routing';

import Footer from './Footer';
import Header from './Header';

const SETTINGS_PATHS = [
  APP_ROUTES.REQUESTER_PROFILE,
  APP_ROUTES.REQUESTER_PROFILE_EDIT,
  APP_ROUTES.RUNNER_PROFILE,
  APP_ROUTES.RUNNER_PROFILE_EDIT,
];

export default function AppShell({ children, user, needsOnboarding, isAuthResolved = true }) {
  const { pathname } = useLocation();
  const showFooter = pathname === APP_ROUTES.HOME || pathname === APP_ROUTES.AUTH || SETTINGS_PATHS.some((path) => pathname.startsWith(path));
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