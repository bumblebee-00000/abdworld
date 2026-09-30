'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bot,
  ChevronDown,
  DollarSign,
  Lightbulb,
  Loader2,
  MessageCircle,
  Package,
  Phone,
  Send,
  Sparkles,
  Wheat,
  X,
} from 'lucide-react';
import { BUSINESS_PHONE, WHATSAPP_CHANNEL_URL, getWhatsAppMessageUrl } from '@/lib/business-config';

const PHONE_DISPLAY = BUSINESS_PHONE;
const PHONE_TEL = PHONE_DISPLAY.replace(/[\s-]/g, '');

type ChatMessage = {
  id: string;
  text: string;
  from: 'bot' | 'customer';
  products?: AssistantProduct[];
};

type AssistantProduct = {
  name: string;
  slug: string;
  category: string;
  short_description: string;
  pack_sizes: string[];
  min_order_quantity: number;
};

const QUICK_PROMPTS = [
  { label: 'Explore Rice', icon: Wheat, href: '/products' },
  { label: 'Wholesale Information', icon: DollarSign, question: 'I need wholesale information for rice supply.' },
  { label: 'Bulk Orders', icon: Package, question: 'I want to place a bulk rice order. What details do you need?' },
  { label: 'Help Me Choose', icon: Lightbulb, question: 'Help me choose rice for my business.' },
];

export default function CustomerChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      from: 'bot',
      text: "Hi! I'm ABD Rice Assistant. How can I help you?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const addMessage = (
    text: string,
    from: ChatMessage['from'],
    products?: AssistantProduct[],
  ) => {
    setMessages((current) => [
      ...current,
      { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, text, from, products },
    ]);
  };

  const askAssistant = async (question: string, displayText = question) => {
    if (!question.trim() || isThinking) return;
    addMessage(displayText, 'customer');
    setIsThinking(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          context: messages.slice(-6).map(({ from, text }) => ({ role: from, text })),
        }),
      });
      const result = await response.json() as {
        answer?: string;
        products?: AssistantProduct[];
        provider?: 'gemini' | 'catalogue';
        error?: string;
      };
      if (response.status === 429) {
        addMessage(result.error || 'Please contact our team directly for help.', 'bot');
        return;
      }
      if (!response.ok) throw new Error(result.error || 'Assistant request failed');
      addMessage(
        result.answer || 'I could not find an answer for that. Please contact our team.',
        'bot',
        result.products,
      );
    } catch {
      addMessage('I could not reach the product catalogue just now. Browse the rice collection or message our team and include your question.', 'bot');
    } finally {
      setIsThinking(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = input.trim();
    if (!value || isThinking) return;
    setInput('');
    void askAssistant(value);
  };

  const hasStartedConversation = messages.some((message) => message.from === 'customer');
  const latestQuestion = [...messages].reverse().find((message) => message.from === 'customer')?.text;
  const whatsappMessage = latestQuestion
    ? `Hello, I need help with this question about wholesale rice: ${latestQuestion}`
    : 'Hello, I need help with a wholesale rice order.';

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-[26px] border border-emerald-900/10 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.18),transparent_20%),linear-gradient(180deg,_#fffdf9_0%,_#f7fdf9_100%)] shadow-[0_20px_70px_rgba(4,42,32,0.22)] ring-1 ring-white/60"
            aria-label="ABD WORLD customer assistant"
          >
            <div className="premium-gradient relative overflow-hidden px-5 pb-5 pt-5 text-white">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full border border-yellow-200/25 bg-yellow-200/10 blur-sm" aria-hidden="true" />
              <div className="absolute -left-10 bottom-0 h-24 w-24 rounded-full bg-white/5 blur-xl" aria-hidden="true" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 text-emerald-950 shadow-[0_10px_25px_rgba(250,204,21,0.45)] ring-2 ring-white/20">
                    <Bot className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-heading text-lg font-bold tracking-tight">ABD Rice Assistant</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-emerald-50/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                      Product &amp; wholesale help
                    </p>
                  </div>
                </div>
                <button type="button" onClick={() => setIsOpen(false)} className="rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white" aria-label="Close assistant">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="max-h-[min(20rem,calc(100dvh-16rem))] min-h-28 space-y-3 overflow-y-auto px-4 py-4" role="log" aria-live="polite" aria-label="Conversation">
              {messages.map((message) => (
                <div key={message.id} className={message.from === 'customer' ? 'flex flex-col items-end' : 'flex flex-col items-start'}>
                  <p className={`max-w-[88%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm ${message.from === 'customer' ? 'rounded-br-md bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-900 text-white shadow-emerald-900/20' : 'rounded-bl-md bg-gradient-to-br from-emerald-50 to-white text-emerald-950 shadow-emerald-900/5'}`}>
                    {message.text}
                  </p>
                  {message.products && message.products.length > 0 && (
                    <div className="mt-2 flex w-full flex-col gap-2">
                      {message.products.map((product) => (
                        <a key={product.slug} href={`/products/${product.slug}`} className="rounded-2xl border border-emerald-900/10 bg-white/90 p-3 shadow-[0_8px_18px_rgba(5,60,46,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-700/40 hover:bg-emerald-50 hover:shadow-[0_14px_30px_rgba(5,60,46,0.12)]">
                          <span className="block text-xs font-bold text-emerald-950">{product.name}</span>
                          <span className="mt-1 block text-[11px] leading-relaxed text-emerald-900/70">{product.short_description}</span>
                          <span className="mt-2 block text-[10px] font-semibold text-emerald-800">MOQ {product.min_order_quantity} kg | {product.pack_sizes.join(', ')}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isThinking && (
                <div className="flex items-center gap-2 text-xs text-emerald-800/70" role="status">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> Checking the rice catalogue...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-emerald-900/10 px-4 py-3">
              {!hasStartedConversation && (
                <div className="mb-3 grid grid-cols-2 gap-2">
                  {QUICK_PROMPTS.map((prompt) => (
                    prompt.href ? (
                      <a key={prompt.label} href={prompt.href} onClick={() => setIsOpen(false)} className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-emerald-700/15 bg-white/80 px-2.5 py-2 text-[10px] font-semibold text-emerald-800 shadow-sm transition-colors hover:border-emerald-700 hover:bg-emerald-50">
                        <prompt.icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {prompt.label}
                      </a>
                    ) : (
                      <button key={prompt.label} type="button" disabled={isThinking} onClick={() => void askAssistant(prompt.question ?? '', prompt.label)} className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-emerald-700/15 bg-white/80 px-2.5 py-2 text-left text-[10px] font-semibold text-emerald-800 shadow-sm transition-colors hover:border-emerald-700 hover:bg-emerald-50 disabled:opacity-50">
                        <prompt.icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {prompt.label}
                      </button>
                    )
                  ))}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-2xl border border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50 p-1.5 shadow-[0_10px_25px_rgba(5,60,46,0.08)]">
                <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about rice, wholesale prices, MOQ or delivery..." className="min-w-0 flex-1 bg-transparent px-2 text-xs text-emerald-950 outline-none placeholder:text-emerald-900/40" aria-label="Ask the rice assistant" disabled={isThinking} />
                <button type="submit" disabled={isThinking || !input.trim()} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-white shadow-md shadow-emerald-900/20 transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50" aria-label="Send message">
                  <Send className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </form>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-900 to-emerald-800 px-2.5 py-2 text-[11px] font-bold text-white shadow-md shadow-emerald-900/20 transition-transform hover:-translate-y-0.5">
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" /> Call Owner
                </a>
                <a href={getWhatsAppMessageUrl(whatsappMessage)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#25d366] to-[#18b657] px-2.5 py-2 text-[11px] font-bold text-white shadow-md shadow-[#25d366]/20 transition-transform hover:-translate-y-0.5">
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" /> WhatsApp
                </a>
                <a href={WHATSAPP_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-700/20 bg-white px-2.5 py-2 text-[11px] font-bold text-emerald-900 shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-emerald-50">
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" /> WhatsApp Channel
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
        className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 text-emerald-950 shadow-[0_18px_35px_rgba(245,180,0,0.45)] ring-4 ring-white/80 transition-all duration-200 hover:shadow-[0_22px_45px_rgba(245,180,0,0.55)]"
        aria-label={isOpen ? 'Close customer assistant' : 'Open customer assistant'}
        aria-expanded={isOpen}
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent" aria-hidden="true" />
        {isOpen ? <ChevronDown className="relative h-6 w-6" aria-hidden="true" /> : <MessageCircle className="relative h-6 w-6 transition-transform group-hover:rotate-[-8deg]" aria-hidden="true" />}
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-800 text-[10px] font-bold text-white shadow-lg">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
        </span>
      </motion.button>
    </div>
  );
}
