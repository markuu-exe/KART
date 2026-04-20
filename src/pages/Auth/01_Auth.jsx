import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { Button, Input, Card } from '@/components';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { setUser, setLoading: setAppLoading } = useAppStore();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const authMethod = isSignUp ? 'signUp' : 'signInWithPassword';
      const { data, error: authError } = await supabase.auth[authMethod]({
        email,
        password,
      });

      if (authError) throw authError;

      setUser(data.user);
      setAppLoading(false);
      // Navigate to dashboard
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card variant="Base" style={{ width: '100%', maxWidth: '400px' }}>
        <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Email"
            type="Text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />

          <Input
            label="Password"
            type="Text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error && <p style={{ color: '#d93025' }}>{error}</p>}

          <Button type="Primary" disabled={loading}>
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>

          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ background: 'none', border: 'none', color: '#ff5c1a', cursor: 'pointer' }}
          >
            {isSignUp ? 'Already have account? Sign In' : "Don't have account? Sign Up"}
          </button>
        </form>
      </Card>
    </div>
  );
}