import React, { useEffect, useState } from 'react';
import { Save, Settings as SettingsIcon } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const emptySettings = {
  logoUrl: '',
  websiteName: 'Brew & Hearth',
  instagramUrl: '',
  whatsappNumber: '',
  whatsappEnabled: true,
  whatsappMessage: 'Hello, I would like to know more about Brew & Hearth.',
  shopOpenTime: '08:00 AM',
  shopCloseTime: '08:00 PM',
  contactNumber: '',
  email: '',
  address: '',
  footerText: '',
  footerLinks: '',
  copyright: ''
};

const AdminSettings = () => {
  const { getSettings, updateSettings } = useAdmin();
  const [form, setForm] = useState(emptySettings);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSettings()
      .then((settings) => setForm({ ...emptySettings, ...settings }))
      .catch((error) => setStatus(error.message || 'Could not load settings.'))
      .finally(() => setLoading(false));
  }, [getSettings]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const chooseLogo = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update('logoUrl', reader.result);
    reader.readAsDataURL(file);
  };

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
            <label className="block text-sm font-bold text-secondary">
              Logo Upload
              <input type="file" accept="image/*" onChange={chooseLogo} className="block mt-2 text-sm" />
              {form.logoUrl && <img src={form.logoUrl} alt="Current logo" className="mt-3 h-16 w-auto rounded border border-primary/10 p-1" />}
            </label>

            <div className="grid md:grid-cols-2 gap-5">
              {[
                ['websiteName', 'Website Name'],
                ['instagramUrl', 'Instagram URL'],
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
              ['footerLinks', 'Footer Links'],
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
    </div>
  );
};

export default AdminSettings;