'use client';

import {
  Building2,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { normalizePhoneNumber, useSiteSettings } from '@/components/settings/SiteSettingsProvider';
import { getWhatsAppMessageUrl, WHATSAPP_CHANNEL_URL } from '@/lib/business-config';

type SiteContactDetailsProps = {
  variant: 'cards' | 'hours' | 'wholesale';
};

export default function SiteContactDetails({ variant }: SiteContactDetailsProps) {
  const settings = useSiteSettings();
  const phone = settings.phone || '';
  const phoneHref = phone ? `tel:${normalizePhoneNumber(phone)}` : '';
  const email = settings.email || '';
  const emailHref = email ? `mailto:${email}` : '';
  const address = [settings.address, settings.city, settings.state].filter(Boolean).join(', ');
  const mapsCoordinates = '22.6717722,88.579711';
  const mapsHref = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsCoordinates)}`
    : '';
  const whatsappHref = getWhatsAppMessageUrl(
    'Hello! I want to enquire about your rice products.',
    settings.whatsapp_number,
  );

  if (variant === 'cards') {
    const cards = [
      ...(phone ? [{ icon: Phone, title: 'Phone', lines: [phone], href: phoneHref }] : []),
      { icon: MessageCircle, title: 'WhatsApp', lines: ['Message us directly'], href: whatsappHref },
      { icon: MessageCircle, title: 'WhatsApp Channel', lines: ['Follow channel updates'], href: WHATSAPP_CHANNEL_URL },
      ...(email ? [{ icon: Mail, title: 'Email', lines: [email], href: emailHref }] : []),
      ...(address ? [{ icon: MapPin, title: 'Address', lines: [address], href: mapsHref }] : []),
    ];

    return (
      <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <div key={card.title} className="group rounded-2xl border border-cream-200 bg-white p-6 text-center transition-all duration-300 hover:border-gold-400 hover:shadow-xl hover:shadow-gold-500/10">
            <div className="gold-gradient mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
              <card.icon className="h-7 w-7 text-emerald-950" />
            </div>
            <h3 className="mb-2 font-heading text-lg font-bold text-emerald-950">{card.title}</h3>
            {card.lines.map((line) => (
              <a
                key={line}
                href={card.href}
                target={card.href.startsWith('http') ? '_blank' : undefined}
                rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="block break-words text-sm text-emerald-900/60 transition-colors hover:text-emerald-700"
              >
                {line}
              </a>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'hours') {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-cream-200 bg-white p-8 shadow-lg shadow-emerald-900/5">
          <div className="mb-6 flex items-center gap-3">
            <div className="gold-gradient flex h-11 w-11 items-center justify-center rounded-xl">
              <Clock className="h-5 w-5 text-emerald-950" />
            </div>
            <h3 className="font-heading text-xl font-bold text-emerald-950">Business Hours</h3>
          </div>
          <p className="text-sm leading-relaxed text-emerald-900/75">
            {settings.business_hours || 'Contact us for business hours'}
          </p>
        </div>

        {address && (
          <div className="rounded-2xl border border-cream-200 bg-white p-8 shadow-lg shadow-emerald-900/5">
            <div className="mb-6 flex items-center gap-3">
              <div className="gold-gradient flex h-11 w-11 items-center justify-center rounded-xl">
                <Building2 className="h-5 w-5 text-emerald-950" />
              </div>
              <h3 className="font-heading text-xl font-bold text-emerald-950">Our Location</h3>
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-xl border border-cream-200 bg-cream-100">
              <iframe
                title={`Map showing ${address}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(mapsCoordinates)}&z=17&output=embed`}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex text-xs font-semibold uppercase tracking-widest text-emerald-800 transition-colors hover:text-emerald-600"
            >
              Open in Google Maps
            </a>
          </div>
        )}
      </div>
    );
  }

  const directLinks = [
    ...(phone ? [{ icon: Phone, title: 'Call Us', detail: phone, href: phoneHref }] : []),
    { icon: MessageCircle, title: 'WhatsApp Message', detail: 'Chat with our sales team', href: whatsappHref },
    { icon: MessageCircle, title: 'WhatsApp Channel', detail: 'Follow our channel', href: WHATSAPP_CHANNEL_URL },
    ...(email ? [{ icon: Mail, title: 'Email Us', detail: email, href: emailHref }] : []),
    ...(address ? [{ icon: MapPin, title: 'Address', detail: address, href: mapsHref }] : []),
  ];

  return (
    <div className="rounded-2xl border border-cream-200 bg-white p-6 shadow-lg shadow-emerald-900/5">
      <h3 className="mb-4 font-heading text-lg font-bold text-emerald-950">Prefer to Talk Directly?</h3>
      <ul className="space-y-4">
        {directLinks.map((item) => (
          <li key={item.title}>
            <a
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group flex items-start gap-3 text-sm text-emerald-900/70 transition-colors hover:text-emerald-700"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 transition-colors group-hover:bg-emerald-100">
                <item.icon className="h-4 w-4 text-emerald-600" />
              </span>
              <span className="min-w-0 break-words">
                <strong className="block text-emerald-950">{item.title}</strong>
                {item.detail}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}