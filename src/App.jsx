import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { AppShell } from '@/components';
import { useAppStore } from '@/store/useAppStore';
import { APP_ROUTES } from '@/lib/routing';

// Pages
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth/01_Auth';
import ZoneOnboarding from './pages/Auth/07_Zone_Onboarding';
import RequesterDashboard from './pages/Requester/02_Requester_Dashboard';
import ActiveOrderRequester from './pages/Requester/05_Active_Order_Requester';
import OrderHistoryRequester from './pages/Requester/08_Order_History_Requester';
import ProfileRequester from './pages/Requester/09_Profile_Requester';
import EditProfileRequester from './pages/Requester/09b_Edit_Profile_Requester';
import RunnerErrandBoard from './pages/Runner/03_Runner_Errand_Board';
import ActiveOrderRunner from './pages/Runner/04_Active_Order_Runner';
import OrderHistoryRunner from './pages/Runner/08_Order_History_Runner';
import ProfileRunner from './pages/Runner/09_Profile_Runner';
import EditProfileRunner from './pages/Runner/09b_Edit_Profile_Runner';

export default function App() {
  const { user, setUser, setLoading, isAuthResolved } = useAppStore();
  const needsOnboarding = Boolean(user) && !user?.user_metadata?.onboarding_complete;
  const activeRole = user?.user_metadata?.role === 'runner' ? 'runner' : 'requester';
  const homePath = activeRole === 'runner' ? APP_ROUTES.RUNNER_BOARD : APP_ROUTES.REQUESTER_BOARD;

  useEffect(() => {
    // Check if user is logged in
    setLoading(true);
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setLoading, setUser]);

  return (
    <BrowserRouter>
      <AppShell user={user} needsOnboarding={needsOnboarding} isAuthResolved={isAuthResolved}>
        <Routes>
          {!user ? (
            <>
              <Route path={APP_ROUTES.HOME} element={<LandingPage />} />
              <Route path={APP_ROUTES.AUTH} element={<Auth />} />
              <Route path="*" element={<Navigate to={APP_ROUTES.HOME} />} />
            </>
          ) : needsOnboarding ? (
            <>
              <Route path={APP_ROUTES.ONBOARDING} element={<ZoneOnboarding />} />
              <Route path="*" element={<Navigate to={APP_ROUTES.ONBOARDING} />} />
            </>
          ) : (
            <>
              <Route path={APP_ROUTES.HOME} element={<Navigate to={homePath} />} />
              <Route path={APP_ROUTES.REQUESTER_BOARD} element={<RequesterDashboard />} />
              <Route path={APP_ROUTES.REQUESTER_ACTIVE_ORDER} element={<ActiveOrderRequester />} />
              <Route path={APP_ROUTES.REQUESTER_HISTORY} element={<OrderHistoryRequester />} />
              <Route path={APP_ROUTES.REQUESTER_PROFILE} element={<ProfileRequester />} />
              <Route path={APP_ROUTES.REQUESTER_PROFILE_EDIT} element={<EditProfileRequester />} />
              <Route path={APP_ROUTES.RUNNER_BOARD} element={<RunnerErrandBoard />} />
              <Route path={APP_ROUTES.RUNNER_ACTIVE_ORDER} element={<ActiveOrderRunner />} />
              <Route path={APP_ROUTES.RUNNER_HISTORY} element={<OrderHistoryRunner />} />
              <Route path={APP_ROUTES.RUNNER_PROFILE} element={<ProfileRunner />} />
              <Route path={APP_ROUTES.RUNNER_PROFILE_EDIT} element={<EditProfileRunner />} />
              <Route path="*" element={<Navigate to={homePath} />} />
            </>
          )}
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}