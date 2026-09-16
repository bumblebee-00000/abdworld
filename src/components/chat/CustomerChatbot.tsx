'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bot,
  ChevronDown,
  MessageCircle,
  Phone,
  Send,
  ShoppingBag,
  Sparkles,
  Wheat,
  X,
} from 'lucide-react';

const PHONE_DISPLAY = process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? '+91 99999 99999';
const PHONE_TEL = PHONE_DISPLAY.replace(/[\s-]/g, '');
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919999999999';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

type ChatMessage = {
  id: number;
  text: string;
  from: 'bot' | 'customer';
};

const QUICK_PROMPTS = [
  { label: 'Browse rice', icon: Wheat, href: '/products' },
  { label: 'Get wholesale price', icon: ShoppingBag, intent: 'price' },
  { label: 'Place an order', icon: MessageCircle, intent: 'order' },
];

function answerFor(intent: string) {
  switch (intent) {
    case 'price':
      return 'Wholesale pricing depends on the rice variety, pack size, quantity, and delivery location. I can connect you with our owner for a quick quote.';
    case 'order':
      return 'Great. Share your rice variety, pack size, quantity, and delivery location with our owner and we will confirm price and availability.';
    case 'quality':
      return 'Every batch is selected, checked for purity and grade, collected from an approved factory, and prepared for wholesale dispatch.';
    case 'delivery':
      return 'We arrange bulk delivery to your warehouse or business. Delivery timing depends on quantity and location, and the owner confirms it with your quote.';
    default:
      return 'I can help with rice varieties, wholesale pricing, quality, pack sizes, delivery, and orders. Choose an option below or contact our owner directly.';
  }
}

export default function CustomerChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      from: 'bot',
      text: 'Hello. I am the ABD World Rice assistant. How can I help with your rice requirement today?',
    },
  ]);
  const [input, setInput] = useState('');

  const addMessage = (text: string, from: ChatMessage['from']) => {
    setMessages((current) => [...current, { id: Date.now(), text, from }]);
  };

  const handlePrompt = (intent: string) => {
    const labels: Record<string, string> = {
      price: 'I need wholesale pricing',
      order: 'I want to place an order',
      quality: 'How do you check quality?',
      delivery: 'Tell me about delivery',
    };
    addMessage(labels[intent] ?? intent, 'customer');
    window.setTimeout(() => addMessage(answerFor(intent), 'bot'), 250);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = input.trim();
    if (!value) return;
    addMessage(value, 'customer');
    setInput('');
    const normalized = value.toLowerCase();
    const intent = normalized.includes('price') || normalized.includes('rate') || normalized.includes('cost')
      ? 'price'
      : normalized.includes('order') || normalized.includes('buy')
        ? 'order'
        : normalized.includes('quality') || normalized.includes('pure')
          ? 'quality'
          : normalized.includes('deliver') || normalized.includes('shipping')
            ? 'delivery'
            : 'help';
    window.setTimeout(() => addMessage(answerFor(intent), 'bot'), 250);
  };

  const ownerMessage = encodeURIComponent('Hello, I need help with a wholesale rice order.');

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-emerald-900/10 bg-[#fffdf8] shadow-2xl shadow-emerald-950/25"
            aria-label="ABD World Rice customer assistant"
          >
            <div className="premium-gradient relative overflow-hidden px-5 pb-5 pt-5 text-white">
              <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full border border-gold-300/20" aria-hidden="true" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gold-400 text-emerald-950 shadow-lg">
                    <Bot className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-heading text-lg font-bold">ABD Rice Assistant</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-emerald-50/75">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Usually replies instantly
                    </p>
                  </div>
                </div>
                <button type="button" onClick={() => setIsOpen(false)} className="rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white" aria-label="Close assistant">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="max-h-64 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.from === 'customer' ? 'justify-end' : 'justify-start'}`}>
                  <p className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${message.from === 'customer' ? 'rounded-br-md bg-emerald-800 text-white' : 'rounded-bl-md bg-emerald-50 text-emerald-950'}`}>
                    {message.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-emerald-900/10 px-4 py-3">
              <div className="mb-3 flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((prompt) => (
                  prompt.href ? (
                    <a key={prompt.label} href={prompt.href} onClick={() => setIsOpen(false)} className="inline-flex items-center gap-1.5 rounded-full border border-emerald-700/15 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-800 transition-colors hover:border-emerald-700 hover:bg-emerald-50">
                      <prompt.icon className="h-3.5 w-3.5" aria-hidden="true" /> {prompt.label}
                    </a>
                  ) : (
                    <button key={prompt.label} type="button" onClick={() => handlePrompt(prompt.intent ?? 'help')} className="inline-flex items-center gap-1.5 rounded-full border border-emerald-700/15 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-800 transition-colors hover:border-emerald-700 hover:bg-emerald-50">
                      <prompt.icon className="h-3.5 w-3.5" aria-hidden="true" /> {prompt.label}
                    </button>
                  )
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-2xl border border-emerald-900/10 bg-white p-1.5 shadow-sm">
                <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about rice or delivery..." className="min-w-0 flex-1 bg-transparent px-2 text-xs text-emerald-950 outline-none placeholder:text-emerald-900/40" aria-label="Ask the rice assistant" />
                <button type="submit" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-800 text-white transition-colors hover:bg-emerald-700" aria-label="Send message">
                  <Send className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </form>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-900 px-3 py-2.5 text-xs font-bold text-white transition-colors hover:bg-emerald-800">
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" /> Call owner
                </a>
                <a href={`${WHATSAPP_URL}?text=${ownerMessage}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#25d366] px-3 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#1ebe5d]">
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" /> WhatsApp order
                </a>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-gold-400 text-emerald-950 shadow-xl shadow-gold-500/30 ring-4 ring-white/80 transition-colors hover:bg-gold-300"
        aria-label={isOpen ? 'Close customer assistant' : 'Open customer assistant'}
        aria-expanded={isOpen}
      >
        {isOpen ? <ChevronDown className="h-6 w-6" aria-hidden="true" /> : <MessageCircle className="h-6 w-6 transition-transform group-hover:rotate-[-8deg]" aria-hidden="true" />}
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-800 text-[10px] font-bold text-white">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
        </span>
      </motion.button>
    </div>
  );
}
