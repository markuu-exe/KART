import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';

// Pages
import Auth from './pages/Auth/01_Auth';
import ZoneOnboarding from './pages/Auth/07_Zone_Onboarding';
import RequesterDashboard from './pages/Requester/02_Requester_Dashboard';
import ActiveOrderRequester from './pages/Requester/05_Active_Order_Requester';
import OrderHistoryRequester from './pages/Requester/08_Order_History_Requester';
import RunnerErrandBoard from './pages/Runner/03_Runner_Errand_Board';
import ActiveOrderRunner from './pages/Runner/04_Active_Order_Runner';
import OrderHistoryRunner from './pages/Runner/08_Order_History_Runner';

export default function App() {
  const { user, setUser, setLoading } = useAppStore();
  const needsOnboarding = Boolean(user) && !user?.user_metadata?.onboarding_complete;

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
      <Routes>
        {!user ? (
          <>
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<Navigate to="/auth" />} />
          </>
        ) : needsOnboarding ? (
          <>
            <Route path="/auth/onboarding" element={<ZoneOnboarding />} />
            <Route path="*" element={<Navigate to="/auth/onboarding" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<RequesterDashboard />} />
            <Route path="/requester/active-order" element={<ActiveOrderRequester />} />
            <Route path="/requester/history" element={<OrderHistoryRequester />} />
            <Route path="/runner/board" element={<RunnerErrandBoard />} />
            <Route path="/runner/active-order" element={<ActiveOrderRunner />} />
            <Route path="/runner/history" element={<OrderHistoryRunner />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}