import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, History, User, ClipboardList, Settings, ChevronRight, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';

function formatMemberSince(dateValue) {
  if (!dateValue) return 'N/A';
  const date = new Date(dateValue);
  const day = date.toLocaleDateString('en-PH', { day: '2-digit' });
  const monthYear = date
    .toLocaleDateString('en-PH', { month: 'short', year: 'numeric' })
    .toUpperCase();
  return `${day} ${monthYear}`;
}

function getInitials(name) {
  const parts = String(name || 'John Doe')
    .trim()
    .split(' ')
    .filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'JD';
}

function ProfileSideNav({ role }) {
  const navigate = useNavigate();
  const isRequester = role === 'requester';

  const navItems = isRequester
    ? [
        { id: 'home', label: 'Home', icon: Home, path: '/requester/board' },
        { id: 'history', label: 'History', icon: History, path: '/requester/history' },
        { id: 'profile', label: 'Profile', icon: User, path: '/requester/profile', selected: true },
      ]
    : [
        { id: 'board', label: 'Board', icon: ClipboardList, path: '/runner/board' },
        { id: 'history', label: 'History', icon: History, path: '/runner/history' },
        { id: 'profile', label: 'Profile', icon: User, path: '/runner/profile', selected: true },
      ];

  return (
    <aside className="bg-surface-white border-r border-border-rule flex min-h-screen min-w-60 flex-col px-4 py-6 self-stretch">
      <div className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              className={`min-h-11 px-3 rounded-xl flex items-center gap-3 text-left ${
                item.selected ? 'bg-primary-orange-bg text-primary-orange' : 'text-ink-mid'
              }`}
              onClick={() => navigate(item.path)}
            >
              <Icon className="w-5 h-5" />
              <span className={`text-sm ${item.selected ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-8">
        <UserFooter role={role} />
      </div>
    </aside>
  );
}

function UserFooter({ role }) {
  const { user } = useAppStore();
  const fullName = user?.user_metadata?.full_name || 'User';

  return (
    <div className="flex items-center gap-3 min-w-52">
      <div className="w-9 h-9 rounded-full bg-primary-orange inline-flex items-center justify-center text-surface-white text-sm font-bold">
        {getInitials(fullName)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink-default truncate">{fullName}</p>
        <p className="text-caption text-ink-light">{role === 'requester' ? 'Requester' : 'Runner'}</p>
      </div>
      <Settings className="w-5 h-5 text-ink-mid" />
    </div>
  );
}

function InfoCard({ rows }) {
  return (
    <section className="bg-surface-white border border-border-rule rounded-2xl shadow-sm p-5 w-full max-w-90">
      <h2 className="text-label text-ink-default text-center pb-1 border-b border-border-rule">Personal Information</h2>
      <div className="mt-2">
        {rows.map((row) => (
          <div key={row.label} className="py-3 border-b border-border-rule flex items-center justify-between gap-3">
            <span className="text-caption text-ink-light uppercase tracking-[0.08em]">{row.label}</span>
            <span className="text-label text-ink-default">{row.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function AccountCard({ onSignOut }) {
  return (
    <section className="bg-surface-white border border-border-rule rounded-2xl shadow-sm p-5 w-full max-w-90">
      <h2 className="text-label text-ink-default text-center pb-1 border-b border-border-rule">Account</h2>
      <button
        type="button"
        className="w-full py-3 flex items-center justify-between text-label text-ink-default"
        onClick={() => {
          // TODO: Connect Change Password route/screen when it is implemented.
        }}
      >
        <span>Change Password</span>
        <ChevronRight className="w-4 h-4 text-ink-light" />
      </button>
      <button
        type="button"
        className="w-full py-3 flex items-center justify-between text-label text-status-red"
        onClick={onSignOut}
      >
        <span>Sign Out</span>
        <ChevronRight className="w-4 h-4 text-status-red" />
      </button>
    </section>
  );
}

function UserCard({ fullName, role, joined }) {
  const isRequester = role === 'requester';
  return (
    <section className="bg-surface-white border border-border-rule rounded-2xl shadow-sm p-6 w-full max-w-90 text-center">
      <div className="w-16 h-16 rounded-full bg-primary-orange mx-auto inline-flex items-center justify-center text-surface-white text-[30px] font-bold">
        {getInitials(fullName)}
      </div>
      <p className="mt-3 text-heading-2 text-ink-default font-semibold">{fullName}</p>
      <p className={`mt-1 inline-flex px-2 py-1 rounded-full text-caption ${isRequester ? 'bg-status-blue-bg text-status-blue' : 'bg-status-green-bg text-status-green'}`}>
        {isRequester ? 'Requester' : 'Runner'}
      </p>

      <div className="mt-3 border-t border-b border-border-rule py-3">
        <p className="font-heading text-heading-2 text-ink-default">{joined}</p>
        <p className="text-caption text-ink-light">Completed Member since</p>
      </div>
    </section>
  );
}

function ZoneCard({ zone, onChange }) {
  return (
    <section className="bg-surface-white border border-border-rule rounded-2xl shadow-sm p-5 w-full max-w-90">
      <div className="flex items-center justify-between text-label">
        <p className="text-ink-default">📍 My Zone</p>
        <button
          type="button"
          className="text-primary-orange underline"
          onClick={onChange}
        >
          Change
        </button>
      </div>
      <div className="mt-3 inline-flex items-center px-3 h-7 rounded-full border border-primary-orange text-primary-orange text-caption font-semibold">
        {zone}
      </div>
    </section>
  );
}

function RunnerPaymentCard({ gcashNumber }) {
  const hasGcash = Boolean(gcashNumber);

  return (
    <section className="bg-surface-white border border-border-rule rounded-2xl shadow-sm p-5 w-full">
      <div className="flex items-center justify-between pb-2 border-b border-border-rule">
        <h2 className="text-label text-ink-default">Payment Details</h2>
        <button
          type="button"
          className="text-caption text-primary-orange underline"
          onClick={() => {
            // TODO: Connect edit payment details flow.
          }}
        >
          Edit
        </button>
      </div>

      <div className="flex items-center justify-between py-3">
        <p className="text-caption text-ink-light uppercase tracking-[0.08em]">GCash Number</p>
        <p className={`text-label ${hasGcash ? 'text-ink-default' : 'text-status-red'}`}>{hasGcash ? gcashNumber : 'Not Set'}</p>
      </div>

      {!hasGcash ? (
        <div className="rounded-xl bg-status-red-bg p-3 flex items-center gap-2 text-status-red text-caption">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Add your GCash number so Requesters can pay you after delivery.</span>
        </div>
      ) : null}
    </section>
  );
}

export default function ProfileScreen({ role = 'requester' }) {
  const navigate = useNavigate();
  const { user, setUser } = useAppStore();
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);

  const fullName = user?.user_metadata?.full_name || 'User';
  const phone = user?.user_metadata?.phone || 'Not set';
  const zone = user?.user_metadata?.zone || 'Not set';
  const gcashNumber = user?.user_metadata?.gcash_number || '';
  const joined = formatMemberSince(user?.created_at);

  const infoRows = useMemo(
    () => [
      { label: 'Full Name', value: fullName },
      { label: 'Phone', value: phone },
      { label: 'Role', value: role === 'requester' ? 'Requester' : 'Runner' },
      { label: 'Joined', value: joined },
    ],
    [fullName, joined, phone, role],
  );

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handleRoleSwitch = async (nextRole) => {
    if (nextRole === role || isSwitchingRole) {
      return;
    }

    try {
      setIsSwitchingRole(true);
      const { data, error } = await supabase.auth.updateUser({
        data: {
          ...(user?.user_metadata || {}),
          role: nextRole,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        setUser(data.user);
      }

      navigate(nextRole === 'runner' ? '/runner/profile' : '/requester/profile');
    } catch (switchError) {
      // TODO: Replace with toast/inline error component once global notification system is available.
      console.error('Role switch failed:', switchError);
    } finally {
      setIsSwitchingRole(false);
    }
  };

  return (
    <div className="bg-surface-default flex min-h-screen w-full items-stretch">
      <ProfileSideNav role={role} />

      <main className="bg-surface-default flex-1 min-h-screen overflow-y-auto p-10">
        <section className="max-w-245 mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-heading font-bold text-heading-1 tracking-tight text-ink-default">Profile</h1>
            <div className="flex items-center gap-2">
              <div className="h-11 rounded-xl border border-border-rule bg-surface-white p-1 inline-flex items-center gap-1">
                <button
                  type="button"
                  className={`h-9 px-3 rounded-lg text-caption ${
                    role === 'requester' ? 'bg-primary-orange-bg text-primary-orange font-semibold' : 'text-ink-mid'
                  }`}
                  disabled={isSwitchingRole}
                  onClick={() => handleRoleSwitch('requester')}
                >
                  Requester
                </button>
                <button
                  type="button"
                  className={`h-9 px-3 rounded-lg text-caption ${
                    role === 'runner' ? 'bg-primary-orange-bg text-primary-orange font-semibold' : 'text-ink-mid'
                  }`}
                  disabled={isSwitchingRole}
                  onClick={() => handleRoleSwitch('runner')}
                >
                  Runner
                </button>
              </div>

              <button
                type="button"
                className="h-11 rounded-xl px-4 bg-primary-orange-bg text-primary-orange text-label"
                onClick={() => navigate(role === 'runner' ? '/runner/profile/edit' : '/requester/profile/edit')}
              >
                Edit Profile
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">
            <div className="space-y-4">
              <UserCard fullName={fullName} role={role} joined={joined} />
              <ZoneCard
                zone={zone}
                onChange={() => navigate(role === 'runner' ? '/runner/profile/edit' : '/requester/profile/edit')}
              />
            </div>

            <div className="space-y-4 max-w-140">
              <InfoCard rows={infoRows} />
              {role === 'runner' ? <RunnerPaymentCard gcashNumber={gcashNumber} /> : null}
              <AccountCard onSignOut={handleSignOut} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}