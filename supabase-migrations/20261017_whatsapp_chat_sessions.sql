CREATE TABLE IF NOT EXISTS public.whatsapp_chat_sessions (
  phone_number TEXT PRIMARY KEY,
  messages JSONB NOT NULL DEFAULT '[]'::JSONB,
  last_message_id TEXT,
  last_response TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_chat_sessions_updated_at
  ON public.whatsapp_chat_sessions(updated_at);

ALTER TABLE public.whatsapp_chat_sessions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.whatsapp_chat_sessions FROM anon, authenticated;
GRANT ALL ON public.whatsapp_chat_sessions TO service_role;