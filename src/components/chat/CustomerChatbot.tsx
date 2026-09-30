'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bot,
  ChevronDown,
  Loader2,
  MessageCircle,
  Phone,
  Send,
  ShoppingBag,
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
  { label: 'Browse rice', icon: Wheat, href: '/products' },
  { label: 'Minimum order', icon: ShoppingBag, question: 'What is the minimum order quantity?' },
  { label: 'Help me choose', icon: MessageCircle, question: 'Help me choose rice for my business.' },
];

export default function CustomerChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      from: 'bot',
      text: 'Hello. I can help you find rice for your business, check pack sizes and minimum quantities, or connect you with our team.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [answerProvider, setAnswerProvider] = useState<'gemini' | 'catalogue' | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const addMessage = (text: string, from: ChatMessage['from'], products?: AssistantProduct[]) => {
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
      const result = await response.json() as { answer?: string; products?: AssistantProduct[]; provider?: 'gemini' | 'catalogue'; error?: string };
      if (response.status === 429) {
        addMessage(result.error || 'Please contact our team directly for help.', 'bot');
        return;
      }
      if (!response.ok) throw new Error(result.error || 'Assistant request failed');
      setAnswerProvider(result.provider || 'catalogue');
      addMessage(result.answer || 'I could not find an answer for that. Please contact our team.', 'bot', result.products);
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
            className="w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-emerald-900/10 bg-[#fffdf8] shadow-2xl shadow-emerald-950/25"
            aria-label="ABD WORLD customer assistant"
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
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                      {answerProvider === 'gemini' ? 'Gemini AI | Product-grounded answers' : answerProvider === 'catalogue' ? 'Product catalogue answers' : 'Product and wholesale help'}
                    </p>
                  </div>
                </div>
                <button type="button" onClick={() => setIsOpen(false)} className="rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white" aria-label="Close assistant">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="max-h-[min(22rem,calc(100dvh-24rem))] min-h-32 space-y-3 overflow-y-auto px-4 py-4" role="log" aria-live="polite" aria-label="Conversation">
              {messages.map((message) => (
                <div key={message.id} className={message.from === 'customer' ? 'flex flex-col items-end' : 'flex flex-col items-start'}>
                  <p className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${message.from === 'customer' ? 'rounded-br-md bg-emerald-800 text-white' : 'rounded-bl-md bg-emerald-50 text-emerald-950'}`}>
                    {message.text}
                  </p>
                  {message.products && message.products.length > 0 && (
                    <div className="mt-2 flex w-full flex-col gap-2">
                      {message.products.map((product) => (
                        <a key={product.slug} href={`/products/${product.slug}`} className="rounded-xl border border-emerald-900/10 bg-white p-3 transition-colors hover:border-emerald-700/40 hover:bg-emerald-50">
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
              <div className="mb-3 flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((prompt) => (
                  prompt.href ? (
                    <a key={prompt.label} href={prompt.href} onClick={() => setIsOpen(false)} className="inline-flex items-center gap-1.5 rounded-full border border-emerald-700/15 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-800 transition-colors hover:border-emerald-700 hover:bg-emerald-50">
                      <prompt.icon className="h-3.5 w-3.5" aria-hidden="true" /> {prompt.label}
                    </a>
                  ) : (
                    <button key={prompt.label} type="button" disabled={isThinking} onClick={() => void askAssistant(prompt.question ?? '', prompt.label)} className="inline-flex items-center gap-1.5 rounded-full border border-emerald-700/15 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-800 transition-colors hover:border-emerald-700 hover:bg-emerald-50 disabled:opacity-50">
                      <prompt.icon className="h-3.5 w-3.5" aria-hidden="true" /> {prompt.label}
                    </button>
                  )
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-2xl border border-emerald-900/10 bg-white p-1.5 shadow-sm">
                <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about products, MOQ, or delivery..." className="min-w-0 flex-1 bg-transparent px-2 text-xs text-emerald-950 outline-none placeholder:text-emerald-900/40" aria-label="Ask the rice assistant" disabled={isThinking} />
                <button type="submit" disabled={isThinking || !input.trim()} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-800 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50" aria-label="Send message">
                  <Send className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </form>
              <p className="mt-2 text-[10px] leading-relaxed text-emerald-900/55">
                Chat may be processed by Google Gemini. Please do not share passwords or payment details.
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-900 px-3 py-2.5 text-xs font-bold text-white transition-colors hover:bg-emerald-800">
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" /> Call owner
                </a>
                <a href={getWhatsAppMessageUrl(whatsappMessage)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#25d366] px-3 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#1ebe5d]">
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" /> WhatsApp message
                </a>
                <a href={WHATSAPP_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-700/20 bg-white px-3 py-2.5 text-xs font-bold text-emerald-900 transition-colors hover:bg-emerald-50">
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" /> WhatsApp channel
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
