import React, { useEffect, useState } from 'react';
import { KeyRound, Save, Settings as SettingsIcon } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const emptySettings = {
  logoUrl: '',
  websiteName: 'Brew & Hearth',
  instagramUrl: 'https://instagram.com/brewandhearth',
  facebookUrl: '',
  twitterUrl: '',
  linkedinUrl: '',
  quickLinks: 'Home|/\nMenu|/menu\nAbout|/about\nGallery|/gallery\nReservations|/reservations',
  whatsappNumber: '+15551234567',
  whatsappEnabled: true,
  whatsappMessage: 'Hello, I would like to know more about Brew & Hearth.',
  shopOpenTime: '08:00 AM',
  shopCloseTime: '08:00 PM',
  contactNumber: '+1 (555) 123-4567',
  email: 'hello@brewandhearth.com',
  address: '123 Artisan Alley, Portland, OR 97209',
  footerText: 'A space for mindful consumption and deliberate pauses.',
  footerLinks: 'Careers | Privacy Policy | Terms of Service',
  copyright: '© 2024 Brew & Hearth. All Rights Reserved.'
};

const AdminSettings = () => {
  const { getSettings, updateSettings, changePassword } = useAdmin();
  const [form, setForm] = useState(emptySettings);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordStatus, setPasswordStatus] = useState('');

  useEffect(() => {
    getSettings()
      .then((settings) => setForm({ ...emptySettings, ...settings }))
      .catch((error) => setStatus(error.message || 'Could not load settings.'))
      .finally(() => setLoading(false));
  }, []);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const chooseLogo = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update('logoUrl', reader.result);
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    update('logoUrl', '');
  };

  const hasLogo = typeof form.logoUrl === 'string' && form.logoUrl.trim().length > 0;

  const save = async (event) => {
    event.preventDefault();
    setStatus('Saving...');
    try {
      const saved = await updateSettings(form);
      setForm({ ...emptySettings, ...saved });
      setStatus('Saved successfully.');
    } catch (error) {
      setStatus(error.message || 'Could not save settings.');
    }
  };

  const updatePasswordField = (key, value) => {
    setPasswordForm((current) => ({ ...current, [key]: value }));
  };

  const savePassword = async (event) => {
    event.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus('New passwords do not match.');
      return;
    }

    setPasswordStatus('Changing password...');
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordStatus('Password changed successfully.');
    } catch (error) {
      setPasswordStatus(error.message || 'Could not change password.');
    }
  };

  const inputClass = 'w-full bg-surface p-3 rounded-xl border border-primary/5 outline-none focus:ring-2 focus:ring-primary/10';

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="text-primary" size={28} />
        <h1 className="font-headline-md text-4xl text-primary">Settings</h1>
      </div>

      <form onSubmit={save} className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-primary/5 space-y-6">
        {loading ? <p className="text-secondary/60">Loading settings...</p> : (
          <>
            <div className="block text-sm font-bold text-secondary">
              <span>Logo (shown in navbar and footer)</span>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <input type="file" accept="image/*" onChange={chooseLogo} className="block text-sm" />
                {hasLogo && (
                  <button type="button" onClick={removeLogo} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100">
                    Remove Logo
                  </button>
                )}
              </div>
              {hasLogo ? (
                <img src={form.logoUrl} alt="Current logo" className="mt-3 h-16 w-auto rounded border border-primary/10 p-1" />
              ) : (
                <p className="mt-3 text-xs font-normal text-secondary/70">No logo selected. The site will show only the website name.</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {[
                ['websiteName', 'Website Name'],
                ['instagramUrl', 'Instagram URL'],
                ['facebookUrl', 'Facebook URL'],
                ['twitterUrl', 'X (Twitter) URL'],
                ['linkedinUrl', 'LinkedIn URL'],
                ['whatsappNumber', 'WhatsApp Number'],
                ['shopOpenTime', 'Shop Open Time'],
                ['shopCloseTime', 'Shop Close Time'],
                ['contactNumber', 'Contact Number'],
                ['email', 'Email']
              ].map(([key, label]) => (
                <label key={key} className="block text-sm font-bold text-secondary">
                  {label}
                  <input value={form[key] || ''} onChange={(event) => update(key, event.target.value)} className={`${inputClass} mt-2 font-normal`} />
                </label>
              ))}
            </div>

            <label className="flex items-center gap-3 text-sm font-bold text-secondary">
              <input type="checkbox" checked={form.whatsappEnabled} onChange={(event) => update('whatsappEnabled', event.target.checked)} />
              Enable WhatsApp button
            </label>

            <label className="block text-sm font-bold text-secondary">
              WhatsApp Message
              <input value={form.whatsappMessage || ''} onChange={(event) => update('whatsappMessage', event.target.value)} className={`${inputClass} mt-2 font-normal`} />
            </label>

            {[
              ['address', 'Address'],
              ['footerText', 'Footer Text'],
              ['quickLinks', 'Footer Quick Links (one per line: Label|/page, e.g. Menu|/menu)'],
              ['copyright', 'Copyright']
            ].map(([key, label]) => (
              <label key={key} className="block text-sm font-bold text-secondary">
                {label}
                <textarea rows="3" value={form[key] || ''} onChange={(event) => update(key, event.target.value)} className={`${inputClass} mt-2 font-normal`} />
              </label>
            ))}

            <div className="flex items-center gap-4">
              <button type="submit" className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
                <Save size={17} /> Save Settings
              </button>
              {status && <p className="text-sm font-bold text-secondary">{status}</p>}
            </div>
          </>
        )}
      </form>

      <form onSubmit={savePassword} className="mt-6 bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-primary/5 space-y-5">
        <div className="flex items-center gap-3">
          <KeyRound className="text-primary" size={22} />
          <h2 className="font-headline-md text-2xl text-primary">Change Admin Password</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            ['currentPassword', 'Current Password'],
            ['newPassword', 'New Password'],
            ['confirmPassword', 'Confirm New Password']
          ].map(([key, label]) => (
            <label key={key} className="block text-sm font-bold text-secondary">
              {label}
              <input
                type="password"
                required
                minLength={key === 'currentPassword' ? undefined : 6}
                value={passwordForm[key]}
                onChange={(event) => updatePasswordField(key, event.target.value)}
                className={`${inputClass} mt-2 font-normal`}
              />
            </label>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button type="submit" className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
            <KeyRound size={17} /> Change Password
          </button>
          {passwordStatus && <p className="text-sm font-bold text-secondary">{passwordStatus}</p>}
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;