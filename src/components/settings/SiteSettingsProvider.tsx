'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { BUSINESS_PHONE, WHATSAPP_NUMBER } from '@/lib/business-config';
import type { SiteSettings } from '@/types';

const fallbackSettings: SiteSettings = {
  id: '1',
  business_name: process.env.NEXT_PUBLIC_BUSINESS_NAME || 'ABD WORLD',
  logo_url: '/company-logo.png',
  phone: BUSINESS_PHONE,
  whatsapp_number: WHATSAPP_NUMBER,
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || 'contact@abdworld.in',
  address: 'Aminpur Bazar, Boalghata Road, Paltadanga, West Bengal 743423',
  city: 'Barasat',
  state: 'West Bengal',
  about_content: '',
  certifications: '',
  business_hours: 'Mon - Sat: 9:00 AM - 6:00 PM',
  facebook_url: null,
  instagram_url: null,
  youtube_url: null,
  updated_at: '',
};

const SiteSettingsContext = createContext<SiteSettings>(fallbackSettings);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(fallbackSettings);

  useEffect(() => {
    let isActive = true;

    fetch('/api/settings', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (isActive && data?.settings) {
          setSettings((current) => ({ ...current, ...data.settings }));
        }
      })
      .catch(() => undefined);

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

export function normalizePhoneNumber(value: string | null | undefined) {
  return value?.replace(/\D/g, '') || WHATSAPP_NUMBER;
}