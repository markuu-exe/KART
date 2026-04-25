import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, History, User, ClipboardList, Settings, ArrowLeft, Pencil, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';

const ZONES = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E'];

function splitName(fullName) {
  const parts = String(fullName || '').trim().split(' ').filter(Boolean);
  if (!parts.length) return { firstName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
}

function getInitials(name) {
  const parts = String(name || 'John Doe').trim().split(' ').filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'JD';
}

function normalizePhone(phoneValue) {
  const digits = String(phoneValue || '').replace(/\D/g, '');
  if (digits.startsWith('63')) return digits.slice(2);
  if (digits.startsWith('0')) return digits.slice(1);
  return digits;
}

function SideNav({ role }) {
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

  const { user } = useAppStore();
  const fullName = user?.user_metadata?.full_name || 'Gina Cole';

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
        <div className="flex items-center gap-3 min-w-52">
          <div className="w-9 h-9 rounded-full bg-primary-orange inline-flex items-center justify-center text-surface-white text-sm font-bold">
            {getInitials(fullName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-ink-default truncate">{fullName}</p>
            <p className="text-caption text-ink-light">{isRequester ? 'Requester' : 'Runner'}</p>
          </div>
          <Settings className="w-5 h-5 text-ink-mid" />
        </div>
      </div>
    </aside>
  );
}

function ReadOnlyPhoneField({ phone }) {
  return (
    <div className="space-y-1.5">
      <p className="text-caption tracking-[0.08em] text-ink-light uppercase">Phone Number</p>
      <div className="h-11 rounded-lg border border-border-rule bg-surface-white px-3 flex items-center gap-2">
        <span className="font-mono text-mono text-primary-orange-light">+63</span>
        <span className="text-body text-ink-default">{phone}</span>
        <Lock className="w-4 h-4 text-ink-light ml-auto" />
      </div>
      <p className="text-caption text-ink-light text-center">Phone cannot be change</p>
    </div>
  );
}

function EditableField({ label, value, onChange, placeholder = 'Input Text' }) {
  return (
    <label className="space-y-1.5 block w-full">
      <span className="text-caption tracking-[0.08em] text-ink-light uppercase">{label}</span>
      <span className="h-11 rounded-lg border border-border-rule bg-surface-white px-3 flex items-center gap-2">
        <input
          className="flex-1 min-w-0 bg-transparent outline-none text-body text-ink-default"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
        <Pencil className="w-4 h-4 text-ink-light" />
      </span>
    </label>
  );
}

export default function EditProfileScreen({ role = 'requester' }) {
  const navigate = useNavigate();
  const { user } = useAppStore();
  const isRunner = role === 'runner';

  const meta = user?.user_metadata || {};
  const { firstName: initialFirstName, lastName: initialLastName } = splitName(meta.full_name || 'John Doe');
  const initialZone = meta.zone || ZONES[0];
  const initialPhone = normalizePhone(meta.phone || '09123456789');
  const initialGcash = normalizePhone(meta.gcash_number || '');

  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [zone, setZone] = useState(initialZone);
  const [gcash, setGcash] = useState(initialGcash);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const fullName = useMemo(() => `${firstName} ${lastName}`.trim(), [firstName, lastName]);
  const profilePath = isRunner ? '/runner/profile' : '/requester/profile';

  const handleSave = async () => {
    setError('');
    setNotice('');

    if (!firstName.trim() || !lastName.trim()) {
      setError('First name and last name are required.');
      return;
    }

    if (isRunner && gcash && !/^\d{10}$/.test(gcash)) {
      setError('GCash number must be 10 digits (without +63).');
      return;
    }

    try {
      setIsSaving(true);
      const nextMetadata = {
        ...meta,
        full_name: fullName,
        zone,
      };

      if (isRunner) {
        nextMetadata.gcash_number = gcash ? `+63${gcash}` : '';
      }

      const { error: updateError } = await supabase.auth.updateUser({
        data: nextMetadata,
      });

      if (updateError) {
        setError(updateError.message || 'Unable to save profile right now.');
        return;
      }

      setNotice('Profile saved successfully.');
      navigate(profilePath);
    } catch (saveError) {
      setError(saveError?.message || 'Unable to save profile right now.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-surface-default flex min-h-screen w-full items-stretch">
      <SideNav role={role} />

      <main className="bg-surface-default flex-1 min-h-screen overflow-y-auto p-10">
        <section className="max-w-190">
          <button
            type="button"
            className="inline-flex items-center gap-1 text-label text-primary-orange"
            onClick={() => navigate(profilePath)}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </button>

          <div className="mt-3">
            <h1 className="font-heading font-bold text-heading-1 tracking-tight text-ink-default">Edit Profile</h1>
            <p className="text-caption text-ink-light mt-1">Changes are saved when tap save</p>
          </div>

          <div className="mt-6 space-y-6 max-w-140">
            <section className="bg-surface-white border border-border-rule rounded-2xl shadow-sm p-6">
              <p className="font-mono text-mono-sm text-ink-light text-center">PERSONAL INFORMATION</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <EditableField label="First Name" value={firstName} onChange={setFirstName} />
                <EditableField label="Last Name" value={lastName} onChange={setLastName} />
              </div>

              <div className="mt-4">
                <ReadOnlyPhoneField phone={initialPhone} />
              </div>
            </section>

            <section className="bg-surface-white border border-border-rule rounded-2xl shadow-sm p-6">
              <p className="font-mono text-mono-sm text-ink-light text-center">DELIVERY ZONE</p>
              <p className="text-body text-ink-light mt-4">
                This sets which zone you appear in - as a Requester posting, or a Runner browsing.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {ZONES.map((zoneOption) => {
                  const selected = zone === zoneOption;
                  return (
                    <button
                      key={zoneOption}
                      type="button"
                      className={`h-8 px-3 rounded-full border text-caption ${
                        selected
                          ? 'bg-primary-orange-bg border-primary-orange text-primary-orange font-semibold'
                          : 'bg-surface-default border-border-rule text-ink-mid'
                      }`}
                      onClick={() => setZone(zoneOption)}
                    >
                      {zoneOption}
                    </button>
                  );
                })}
              </div>
            </section>

            {isRunner ? (
              <section className="bg-surface-white border border-border-rule rounded-2xl shadow-sm p-6">
                <p className="font-mono text-mono-sm text-ink-light text-center">PAYMENT DETAILS</p>

                <div className="mt-4 space-y-1.5">
                  <p className="text-caption tracking-[0.08em] text-ink-light uppercase">GCash Number</p>
                  <div className="h-11 rounded-lg border border-border-rule bg-surface-white px-3 flex items-center gap-2">
                    <span className="font-mono text-mono text-primary-orange-light">+63</span>
                    <input
                      className="flex-1 min-w-0 bg-transparent outline-none text-body text-ink-default"
                      value={gcash}
                      onChange={(event) => setGcash(event.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="9123456789"
                    />
                    <Pencil className="w-4 h-4 text-ink-light" />
                  </div>
                  <p className="text-caption text-ink-light text-center">
                    Requesters will see this number to pay you after delivery.
                  </p>
                </div>
              </section>
            ) : null}

            {error ? <p className="text-caption text-status-red">{error}</p> : null}
            {notice ? <p className="text-caption text-status-green">{notice}</p> : null}

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="h-11 px-4 rounded-xl bg-surface-white border border-border-rule text-label text-ink-mid"
                onClick={() => navigate(profilePath)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="h-11 px-4 rounded-xl bg-primary-orange shadow-sm text-label text-surface-white disabled:opacity-60"
                disabled={isSaving}
                onClick={handleSave}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}