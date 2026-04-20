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
import ProfileRequester from './pages/Requester/09_Profile_Requester';
import EditProfileRequester from './pages/Requester/09b_Edit_Profile_Requester';
import RunnerErrandBoard from './pages/Runner/03_Runner_Errand_Board';
import ActiveOrderRunner from './pages/Runner/04_Active_Order_Runner';
import OrderHistoryRunner from './pages/Runner/08_Order_History_Runner';
import ProfileRunner from './pages/Runner/09_Profile_Runner';
import EditProfileRunner from './pages/Runner/09b_Edit_Profile_Runner';

export default function App() {
  const { user, setUser, setLoading } = useAppStore();
  const needsOnboarding = Boolean(user) && !user?.user_metadata?.onboarding_complete;
  const activeRole = user?.user_metadata?.role === 'runner' ? 'runner' : 'requester';
  const homePath = activeRole === 'runner' ? '/runner/board' : '/requester/board';

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
            <Route path="/" element={<Navigate to={homePath} />} />
            <Route path="/requester/board" element={<RequesterDashboard />} />
            <Route path="/requester/active-order" element={<ActiveOrderRequester />} />
            <Route path="/requester/history" element={<OrderHistoryRequester />} />
            <Route path="/requester/profile" element={<ProfileRequester />} />
            <Route path="/requester/profile/edit" element={<EditProfileRequester />} />
            <Route path="/runner/board" element={<RunnerErrandBoard />} />
            <Route path="/runner/active-order" element={<ActiveOrderRunner />} />
            <Route path="/runner/history" element={<OrderHistoryRunner />} />
            <Route path="/runner/profile" element={<ProfileRunner />} />
            <Route path="/runner/profile/edit" element={<EditProfileRunner />} />
            <Route path="*" element={<Navigate to={homePath} />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}