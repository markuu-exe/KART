import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Home, History, User, ClipboardList, Settings, ArrowLeft, Pencil, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';

const ZONES = ['Guadalupe', 'Tisa', 'Talamban', 'Lahug', 'Labangon', 'Banilad', 'Apas', 'Zapatera'];

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
  const fullName = user?.user_metadata?.full_name || 'User';

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
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isPhoneVerifiedMock, setIsPhoneVerifiedMock] = useState(false);

  const { user } = useAppStore();
  const metadata = user?.user_metadata || {};
  const isPhoneVerified = Boolean(user?.phoneVerified ?? metadata.phoneVerified ?? metadata.phone_verified ?? false);
  const shouldShowVerify = !isPhoneVerified && !isPhoneVerifiedMock;

  const handleVerifyClick = () => {
    setIsVerifyingPhone(true);
    setOtpCode('');
  };

  const handleConfirmOtp = () => {
    if (otpCode.length !== 6) {
      return;
    }

    setIsPhoneVerifiedMock(true);
    setIsVerifyingPhone(false);
  };

  return (
    <div className="space-y-1.5">
      <p className="text-caption tracking-[0.08em] text-ink-light uppercase">Phone Number</p>
      <div className="h-11 rounded-lg border border-border-rule bg-surface-white px-3 flex items-center gap-2">
        <span className="font-mono text-mono text-primary-orange-light">+63</span>
        <span className="text-body text-ink-default">{phone}</span>
        {shouldShowVerify ? (
          <button
            type="button"
            className="ml-auto h-7 px-2.5 rounded-full border border-primary-orange text-primary-orange text-caption font-semibold"
            onClick={handleVerifyClick}
          >
            Verify
          </button>
        ) : null}
        {isPhoneVerified || isPhoneVerifiedMock ? (
          <span className="ml-auto h-7 px-2.5 rounded-full bg-status-green-bg text-status-green text-caption font-semibold inline-flex items-center">
            Verified
          </span>
        ) : null}
        <Lock className="w-4 h-4 text-ink-light" />
      </div>
      {isVerifyingPhone ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otpCode}
            onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Enter 6-digit code"
            className="h-10 flex-1 rounded-lg border border-border-rule bg-surface-white px-3 outline-none text-body text-ink-default"
          />
          <button
            type="button"
            className="h-10 px-3 rounded-lg bg-primary-orange text-surface-white text-label disabled:opacity-50"
            onClick={handleConfirmOtp}
            disabled={otpCode.length !== 6}
          >
            Confirm
          </button>
        </div>
      ) : null}
      <p className="text-caption text-ink-light text-center">Phone cannot be change</p>
    </div>
  );
}

function EditableField({ label, name, register, error, placeholder = 'Input Text' }) {
  return (
    <label className="space-y-1.5 block w-full">
      <span className="text-caption tracking-[0.08em] text-ink-light uppercase">{label}</span>
      <span className="h-11 rounded-lg border border-border-rule bg-surface-white px-3 flex items-center gap-2">
        <input
          className="flex-1 min-w-0 bg-transparent outline-none text-body text-ink-default"
          {...(register ? register(name) : {})}
          placeholder={placeholder}
        />
        <Pencil className="w-4 h-4 text-ink-light" />
      </span>
      {error ? <p className="text-red-500 text-sm mt-1">{error.message}</p> : null}
    </label>
  );
}

export default function EditProfileScreen({ role = 'requester' }) {
  const navigate = useNavigate();
  const { user } = useAppStore();
  const isRunner = role === 'runner';

  const meta = user?.user_metadata || {};
  const { firstName: initialFirstName, lastName: initialLastName } = splitName(meta.full_name || '');
  const initialZone = meta.zone || ZONES[0];
  const initialPhone = normalizePhone(meta.phone || '');
  const initialGcash = normalizePhone(meta.gcash_number || '');

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const profileSchema = useMemo(
    () =>
      z.object({
        firstName: z.string().nonempty('First name is required'),
        lastName: z.string().nonempty('Last name is required'),
        zone: z.string().nonempty(),
        gcash: z
          .string()
          .optional()
          .refine((val) => !val || /^\d{10}$/.test(val), {
            message: 'GCash number must be 10 digits (without +63).',
          }),
      }),
    []
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: initialFirstName, lastName: initialLastName, zone: initialZone, gcash: initialGcash },
  });

  const watchedZone = watch('zone');

  const profilePath = isRunner ? '/runner/profile' : '/requester/profile';
  const handleSave = handleSubmit(async (values) => {
    setError('');
    setNotice('');

    try {
      setIsSaving(true);
      const nextMetadata = {
        ...meta,
        full_name: `${values.firstName} ${values.lastName}`.trim(),
        zone: values.zone,
      };

      if (isRunner) {
        nextMetadata.gcash_number = values.gcash ? `+63${values.gcash}` : '';
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
  });

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
                <EditableField label="First Name" name="firstName" register={register} error={errors.firstName} />
                <EditableField label="Last Name" name="lastName" register={register} error={errors.lastName} />
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
                  const selected = watchedZone === zoneOption;
                  return (
                    <button
                      key={zoneOption}
                      type="button"
                      className={`h-8 px-3 rounded-full border text-caption ${
                        selected
                          ? 'bg-primary-orange-bg border-primary-orange text-primary-orange font-semibold'
                          : 'bg-surface-default border-border-rule text-ink-mid'
                      }`}
                      onClick={() => setValue('zone', zoneOption)}
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
                      {...register('gcash')}
                      onChange={(event) => setValue('gcash', event.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="9123456789"
                    />
                    <Pencil className="w-4 h-4 text-ink-light" />
                  </div>
                  <p className="text-caption text-ink-light text-center">
                    Requesters will see this number to pay you after delivery.
                  </p>
                  {errors.gcash ? <p className="text-red-500 text-sm mt-1">{errors.gcash.message}</p> : null}
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