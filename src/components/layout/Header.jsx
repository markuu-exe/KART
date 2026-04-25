import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, CircleUserRound, LogOut, Menu, ToggleLeft, ToggleRight } from 'lucide-react';

import Avatar from '../ui/Avatar';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';

function getInitials(name) {
  const parts = String(name || 'Kart User')
    .trim()
    .split(' ')
    .filter(Boolean);

  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'KU';
}

export default function Header({ mode = 'public', className = '' }) {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const { user, logout } = useAppStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const fullName = user?.user_metadata?.full_name || 'Kart User';
  const role = user?.user_metadata?.role === 'runner' ? 'runner' : 'requester';
  const homePath = role === 'runner' ? '/runner/board' : '/requester/board';
  const profilePath = role === 'runner' ? '/runner/profile' : '/requester/profile';
  const editProfilePath = role === 'runner' ? '/runner/profile/edit' : '/requester/profile/edit';
  const authMode = mode === 'public' ? 'public' : mode;

  const initials = useMemo(() => getInitials(fullName), [fullName]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!menuRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    logout();
    setMenuOpen(false);
    navigate('/auth');
  };

  return (
    <header className={cn('sticky top-0 z-40 border-b border-border-rule bg-surface-white/95 backdrop-blur supports-backdrop-filter:bg-surface-white/85', className)}>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link to={user ? homePath : '/auth'} className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-orange text-lg font-black text-surface-white shadow-sm">
              K
            </span>
            <span className="min-w-0">
              <span className="block font-heading text-xl font-extrabold tracking-tight text-ink-default">Kart</span>
              <span className="block text-caption text-ink-light">Cebu's fastest errand runners</span>
            </span>
          </Link>
        </div>

        {!user ? (
          <div className="flex flex-wrap items-center justify-end gap-3">
            <a href="#site-footer" className="hidden text-sm font-medium text-ink-mid transition-colors hover:text-ink-default sm:inline-flex">
              How it Works
            </a>
            <Button type="button" variant="secondary" size="sm" onClick={() => navigate('/auth?mode=login')}>
              Login
            </Button>
            <Button type="button" variant="brand" size="sm" onClick={() => navigate('/auth?mode=signup')}>
              Sign Up
            </Button>
          </div>
        ) : role === 'requester' ? (
          <div className="flex items-center gap-3">
            <Button type="button" variant="brand" size="sm" onClick={() => navigate(homePath)}>
              Post an Errand
            </Button>

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-border-rule bg-surface-white px-2 py-1.5 text-left shadow-sm transition hover:bg-surface-default"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((currentValue) => !currentValue)}
              >
                <Avatar initials={initials} />
                <span className="hidden min-w-0 sm:block">
                  <span className="block max-w-32 truncate text-sm font-semibold text-ink-default">{fullName}</span>
                  <span className="block text-caption text-ink-light">Requester</span>
                </span>
                <ChevronDown className={cn('h-4 w-4 text-ink-light transition-transform', menuOpen && 'rotate-180')} aria-hidden="true" />
              </button>

              {menuOpen ? (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-border-rule bg-surface-white p-2 shadow-lg">
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-ink-mid transition hover:bg-surface-default hover:text-ink-default"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate(profilePath);
                    }}
                  >
                    <CircleUserRound className="h-4 w-4" aria-hidden="true" />
                    View Profile
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-ink-mid transition hover:bg-surface-default hover:text-ink-default"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate(editProfilePath);
                    }}
                  >
                    <Menu className="h-4 w-4" aria-hidden="true" />
                    Edit Profile
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-status-red transition hover:bg-status-red-bg"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Sign Out
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              className="hidden items-center gap-2 rounded-full border border-border-rule bg-surface-white px-3 py-2 text-sm font-medium text-ink-mid transition hover:bg-surface-default hover:text-ink-default sm:inline-flex"
              onClick={() => setIsOnline((currentValue) => !currentValue)}
            >
              {isOnline ? <ToggleRight className="h-4 w-4 text-status-green" aria-hidden="true" /> : <ToggleLeft className="h-4 w-4 text-ink-light" aria-hidden="true" />}
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </button>

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-border-rule bg-surface-white px-2 py-1.5 text-left shadow-sm transition hover:bg-surface-default"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((currentValue) => !currentValue)}
              >
                <Avatar initials={initials} />
                <span className="hidden min-w-0 sm:block">
                  <span className="block max-w-32 truncate text-sm font-semibold text-ink-default">{fullName}</span>
                  <span className="block text-caption text-ink-light">Runner</span>
                </span>
                <ChevronDown className={cn('h-4 w-4 text-ink-light transition-transform', menuOpen && 'rotate-180')} aria-hidden="true" />
              </button>

              {menuOpen ? (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-border-rule bg-surface-white p-2 shadow-lg">
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-ink-mid transition hover:bg-surface-default hover:text-ink-default"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate(profilePath);
                    }}
                  >
                    <CircleUserRound className="h-4 w-4" aria-hidden="true" />
                    View Profile
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-ink-mid transition hover:bg-surface-default hover:text-ink-default"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate(editProfilePath);
                    }}
                  >
                    <Menu className="h-4 w-4" aria-hidden="true" />
                    Edit Profile
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-status-red transition hover:bg-status-red-bg"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Sign Out
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {authMode === 'public' ? (
        <div className="border-t border-border-rule bg-surface-default/70 px-4 py-3 text-center text-caption text-ink-mid sm:px-6 lg:px-8">
          Post errands, match with nearby runners, and track every delivery in one place.
        </div>
      ) : null}
    </header>
  );
}